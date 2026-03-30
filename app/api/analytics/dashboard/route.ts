import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";

// ── FUZZY HELPERS ─────────────────────────────────────────────
function normalize(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/\b(pvt|ltd|private|limited|llp|inc|corp|co)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;

  const dp = Array.from({ length: na.length + 1 }, (_, i) =>
    Array.from({ length: nb.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );

  for (let i = 1; i <= na.length; i++)
    for (let j = 1; j <= nb.length; j++)
      dp[i][j] =
        na[i - 1] === nb[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);

  return 1 - dp[na.length][nb.length] / Math.max(na.length, nb.length);
}

/**
 * Resolves the canonical company key for a job.
 * Priority: gstin (most reliable) → fuzzy name match → raw name
 */
function resolveCompanyKey(
  job: any,
  gstinToCanonical: Map<string, string>,
  nameToCanonical: Map<string, string>
): string {
  // 1. GSTIN match — strongest identifier
  if (job.gstin && gstinToCanonical.has(job.gstin)) {
    return gstinToCanonical.get(job.gstin)!;
  }

  // 2. Fuzzy name match against already-seen canonical names
  for (const [canonical] of nameToCanonical) {
    if (similarity(job.company, canonical) >= 0.82) {
      return canonical;
    }
  }

  // 3. New company — use its name as canonical
  return job.company || job.customerName || "Unknown";
}
// ── END FUZZY HELPERS ─────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = searchParams.get("days") || "30";

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
    const quoteIds = allQuotes.map((q) => q._id);

    const linkedTechQuotes = await TechnicalQuote.find({
      clientQuoteId: { $in: quoteIds },
    });

    const approvedTechQuoteIds = linkedTechQuotes
      .filter((tq) => tq.status === "client_approved")
      .map((tq) => tq.clientQuoteId.toString());

    const quotesWithApprovedTechQuotes = new Set(approvedTechQuoteIds).size;

    const jobsFromQuotes = await Job.find({
      technicalQuoteId: { $in: linkedTechQuotes.map((tq) => tq._id) },
    });

    const techQuoteIdsWithJobs = new Set(
      jobsFromQuotes
        .map((job) => job.technicalQuoteId?.toString())
        .filter(Boolean)
    );

    const linkedTechQuotesWithJobs = linkedTechQuotes.filter((tq) =>
      techQuoteIdsWithJobs.has(tq._id.toString())
    );

    const quoteIdsWithJobs = new Set(
      linkedTechQuotesWithJobs.map((tq) => tq.clientQuoteId.toString())
    );

    const quotesToJobConversionRate =
      allQuotes.length > 0
        ? Math.round((quoteIdsWithJobs.size / allQuotes.length) * 100)
        : 0;

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
              (quotesWithApprovedTechQuotes / allQuotes.length) * 100
            )
          : 0,
      quotesToJobConversionRate,
      quotesConvertedToJobs: quoteIdsWithJobs.size,
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
      sentToClient: allTechQuotes.filter(
        (tq) => tq.status === "sent_to_client"
      ).length,
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
      const grandTotal = tq.grandTotalINR || 0;
      totalRevenue += grandTotal;

      if (tq.shipmentType === "import") {
        revenueByShipmentType.import += grandTotal;
      } else if (tq.shipmentType === "export") {
        revenueByShipmentType.export += grandTotal;
      } else if (tq.shipmentType === "courier") {
        revenueByShipmentType.courier += grandTotal;
      }

      tq.lineItems?.forEach((item: any) => {
        const itemTotal = item.totalAmount || 0;
        if (item.currency === "INR") revenueByCurrency.INR += itemTotal;
        else if (item.currency === "USD") revenueByCurrency.USD += itemTotal;
        else if (item.currency === "EUR") revenueByCurrency.EUR += itemTotal;
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
      converted: allClients.filter((c) => c.verified).length,
      topClients: [] as Array<{
        name: string;
        revenue: number;
        jobCount: number;
      }>,
    };

    // ── TOP CLIENTS — grouped by GSTIN first, fuzzy name fallback ──
    const jobsWithTechQuotes = await Job.find(dateFilter)
      .populate("technicalQuoteId")
      .lean();

    // Maps for resolution
    const gstinToCanonical = new Map<string, string>(); // gstin → canonical name
    const nameToCanonical = new Map<string, string>();   // canonical → canonical (for lookup)

    const clientRevenueMap = new Map<string, { name: string; revenue: number; jobCount: number }>();

    for (const job of jobsWithTechQuotes) {
      // Resolve canonical company key
      let canonical = resolveCompanyKey(job, gstinToCanonical, nameToCanonical);

      // Register GSTIN → canonical mapping if new
      if (job.gstin && !gstinToCanonical.has(job.gstin)) {
        gstinToCanonical.set(job.gstin, canonical);
      }

      // Register canonical name if new
      if (!nameToCanonical.has(canonical)) {
        nameToCanonical.set(canonical, canonical);
      }

      // Accumulate revenue and job count under canonical name
      if (!clientRevenueMap.has(canonical)) {
        clientRevenueMap.set(canonical, {
          name: canonical,
          revenue: 0,
          jobCount: 0,
        });
      }

      const clientData = clientRevenueMap.get(canonical)!;
      clientData.jobCount += 1;

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
    // ── END TOP CLIENTS ────────────────────────────────────────

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
      if (log.performedBy) {
        const adminId = log.performedBy._id.toString();
        const adminName = (log.performedBy as any).fullName || "Unknown Admin";
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
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const groupByMonth = (items: any[], dateField: string = "createdAt") => {
      const grouped = new Map<string, any[]>();
      items.forEach((item) => {
        const date = new Date(item[dateField]);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(item);
      });
      return grouped;
    };

    const jobsByMonth = groupByMonth(allJobs);
    const jobsTrend = Array.from(jobsByMonth.entries())
      .map(([month, jobs]) => ({
        month,
        created: jobs.length,
        completed: jobs.filter((j) => j.status === "completed").length,
      }))
      .slice(-12);

    const quotesByMonth = groupByMonth(allQuotes);
    const quotesTrend = Array.from(quotesByMonth.entries())
      .map(([month, quotes]) => ({
        month,
        received: quotes.length,
        approved: quotes.filter((q) => q.status === "approved").length,
      }))
      .slice(-12);

    const techQuotesByMonth = groupByMonth(approvedTechQuotes);
    const revenueTrend = Array.from(techQuotesByMonth.entries())
      .map(([month, tqs]) => ({
        month,
        revenue: Math.round(
          tqs.reduce((sum, tq) => sum + (tq.grandTotalINR || 0), 0)
        ),
      }))
      .slice(-12);

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