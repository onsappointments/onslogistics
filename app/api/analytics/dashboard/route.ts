import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/lib/mongodb"; // adjust path as needed
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = searchParams.get("days") || "30";

    // Calculate date range
    let startDate: Date | null = null;
    if (days !== "all") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
    }

    const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

    // ====================
    // JOB METRICS
    // ====================
    const allJobs = await Job.find(dateFilter);
    const jobMetrics = {
      total: allJobs.length,
      new: allJobs.filter((j) => j.status === "new").length,
      active: allJobs.filter((j) => j.status === "active").length,
      completed: allJobs.filter((j) => j.status === "completed").length,
      completionRate:
        allJobs.length > 0
          ? Math.round(
              (allJobs.filter((j) => j.status === "completed").length /
                allJobs.length) *
                100
            )
          : 0,
    };

    // ====================
    // QUOTE METRICS
    // ====================
    const allQuotes = await Quote.find(dateFilter);
    const quoteMetrics = {
      total: allQuotes.length,
      pending: allQuotes.filter((q) => q.status === "pending").length,
      reviewing: allQuotes.filter((q) => q.status === "reviewing").length,
      indicativeSent: allQuotes.filter((q) => q.status === "indicative_sent")
        .length,
      approved: allQuotes.filter((q) => q.status === "approved").length,
      rejected: allQuotes.filter((q) => q.status === "rejected").length,
      conversionRate:
        allQuotes.length > 0
          ? Math.round(
              (allQuotes.filter((q) => q.status === "approved").length /
                allQuotes.length) *
                100
            )
          : 0,
    };

    // ====================
    // TECHNICAL QUOTE METRICS
    // ====================
    const allTechQuotes = await TechnicalQuote.find(dateFilter);
    const techQuoteMetrics = {
      total: allTechQuotes.length,
      draft: allTechQuotes.filter((tq) => tq.status === "draft").length,
      internalReview: allTechQuotes.filter(
        (tq) => tq.status === "internal_review"
      ).length,
      sentToClient: allTechQuotes.filter((tq) => tq.status === "sent_to_client")
        .length,
      clientApproved: allTechQuotes.filter(
        (tq) => tq.status === "client_approved"
      ).length,
      clientRejected: allTechQuotes.filter(
        (tq) => tq.status === "client_rejected"
      ).length,
      approvalRate:
        allTechQuotes.filter(
          (tq) =>
            tq.status === "client_approved" || tq.status === "client_rejected"
        ).length > 0
          ? Math.round(
              (allTechQuotes.filter((tq) => tq.status === "client_approved")
                .length /
                allTechQuotes.filter(
                  (tq) =>
                    tq.status === "client_approved" ||
                    tq.status === "client_rejected"
                ).length) *
                100
            )
          : 0,
    };

    // ====================
    // REVENUE METRICS
    // ====================
    const approvedTechQuotes = allTechQuotes.filter(
      (tq) => tq.status === "client_approved"
    );

    let totalRevenue = 0;
    const revenueByShipmentType = { import: 0, export: 0, courier: 0 };
    const revenueByCurrency = { INR: 0, USD: 0, EUR: 0 };

    approvedTechQuotes.forEach((tq) => {
      // Total revenue uses grandTotalINR (already converted to base currency)
      const grandTotal = tq.grandTotalINR || 0;
      totalRevenue += grandTotal;

      // Revenue by shipment type (also uses grandTotalINR - no double counting)
      if (tq.shipmentType === "import") {
        revenueByShipmentType.import += grandTotal;
      } else if (tq.shipmentType === "export") {
        revenueByShipmentType.export += grandTotal;
      } else if (tq.shipmentType === "courier") {
        revenueByShipmentType.courier += grandTotal;
      }

      // Revenue by currency breakdown (from line items in original currencies)
      // This shows the currency mix BEFORE conversion to INR
      // Useful for understanding which currencies clients are paying in
      tq.lineItems?.forEach((item: any) => {
        const itemTotal = item.totalAmount || 0;
        if (item.currency === "INR") {
          revenueByCurrency.INR += itemTotal;
        } else if (item.currency === "USD") {
          revenueByCurrency.USD += itemTotal;
        } else if (item.currency === "EUR") {
          revenueByCurrency.EUR += itemTotal;
        }
      });
    });

    const revenueMetrics = {
      total: Math.round(totalRevenue),
      byShipmentType: {
        import: Math.round(revenueByShipmentType.import),
        export: Math.round(revenueByShipmentType.export),
        courier: Math.round(revenueByShipmentType.courier),
      },
      byCurrency: {
        INR: Math.round(revenueByCurrency.INR),
        USD: Math.round(revenueByCurrency.USD),
        EUR: Math.round(revenueByCurrency.EUR),
      },
    };

    // ====================
    // CLIENT METRICS
    // ====================
    const allClients = await User.find({ role: "client", ...dateFilter });
    const clientMetrics = {
      total: allClients.length,
      verified: allClients.filter((c) => c.verified).length,
      leads: allClients.filter((c) => !c.verified).length,
      converted: allClients.filter((c) => c.verified && c.kycVerified).length,
      topClients: [] as Array<{
        name: string;
        revenue: number;
        jobCount: number;
      }>,
    };

    // Calculate top clients by revenue
    // Using company name as the grouping key since jobs store company as string
    const clientRevenueMap = new Map<
      string,
      { name: string; revenue: number; jobCount: number }
    >();

    // Fetch all jobs with populated technicalQuoteId to get revenue
    const jobsWithTechQuotes = await Job.find(dateFilter)
      .populate("technicalQuoteId")
      .lean();

    for (const job of jobsWithTechQuotes) {
      const clientName = job.company || job.customerName || "Unknown";
      
      if (!clientRevenueMap.has(clientName)) {
        clientRevenueMap.set(clientName, {
          name: clientName,
          revenue: 0,
          jobCount: 0,
        });
      }

      const clientData = clientRevenueMap.get(clientName)!;
      clientData.jobCount += 1;

      // Get revenue from populated technical quote
      const techQuote = job.technicalQuoteId as any;
      if (techQuote && techQuote.status === "client_approved") {
        clientData.revenue += techQuote.grandTotalINR || 0;
      }
    }

    clientMetrics.topClients = Array.from(clientRevenueMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((c) => ({
        ...c,
        revenue: Math.round(c.revenue),
      }));

    // ====================
    // ADMIN ACTIVITY METRICS
    // ====================
    const allAuditLogs = await AuditLog.find(dateFilter).populate(
      "performedBy",
      "fullName adminType"
    );

    const adminActivityMap = new Map<
      string,
      { name: string; actions: number; role: string }
    >();
    const actionTypeMap = new Map<string, number>();

    allAuditLogs.forEach((log) => {
      // By admin
      if (log.performedBy) {
        const adminId = log.performedBy._id.toString();
        const adminName =
          (log.performedBy as any).fullName || "Unknown Admin";
        const adminRole = (log.performedBy as any).adminType || "admin";

        if (!adminActivityMap.has(adminId)) {
          adminActivityMap.set(adminId, {
            name: adminName,
            actions: 0,
            role: adminRole,
          });
        }
        adminActivityMap.get(adminId)!.actions += 1;
      }

      // By action type
      const actionKey = log.action;
      actionTypeMap.set(actionKey, (actionTypeMap.get(actionKey) || 0) + 1);
    });

    const adminActivityMetrics = {
      totalActions: allAuditLogs.length,
      byAdmin: Array.from(adminActivityMap.values())
        .sort((a, b) => b.actions - a.actions)
        .slice(0, 10),
      byActionType: Array.from(actionTypeMap.entries())
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
    };

    // ====================
    // TRENDS OVER TIME
    // ====================
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Helper to group by month
    const groupByMonth = (items: any[], dateField: string = "createdAt") => {
      const grouped = new Map<string, any[]>();
      items.forEach((item) => {
        const date = new Date(item[dateField]);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(item);
      });
      return grouped;
    };

    // Jobs by month
    const jobsByMonth = groupByMonth(allJobs);
    const jobsTrend = Array.from(jobsByMonth.entries())
      .map(([month, jobs]) => ({
        month,
        created: jobs.length,
        completed: jobs.filter((j) => j.status === "completed").length,
      }))
      .slice(-12); // Last 12 months

    // Quotes by month
    const quotesByMonth = groupByMonth(allQuotes);
    const quotesTrend = Array.from(quotesByMonth.entries())
      .map(([month, quotes]) => ({
        month,
        received: quotes.length,
        approved: quotes.filter((q) => q.status === "approved").length,
      }))
      .slice(-12);

    // Revenue by month
    const techQuotesByMonth = groupByMonth(approvedTechQuotes);
    const revenueTrend = Array.from(techQuotesByMonth.entries())
      .map(([month, tqs]) => ({
        month,
        revenue: Math.round(
          tqs.reduce((sum, tq) => sum + (tq.grandTotalINR || 0), 0)
        ),
      }))
      .slice(-12);


      console.log("Sample jobs:", jobsWithTechQuotes.slice(0, 3).map(j => ({
  company: j.company,
  hasTechQuote: !!j.technicalQuoteId,
  status: (j.technicalQuoteId as any)?.status,
  revenue: (j.technicalQuoteId as any)?.grandTotalINR
})));

    // ====================
    // FINAL RESPONSE
    // ====================
    return NextResponse.json({
      jobs: jobMetrics,
      quotes: quoteMetrics,
      technicalQuotes: techQuoteMetrics,
      revenue: revenueMetrics,
      clients: clientMetrics,
      adminActivity: adminActivityMetrics,
      trends: {
        jobsByMonth: jobsTrend,
        quotesByMonth: quotesTrend,
        revenueByMonth: revenueTrend,
      },
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}