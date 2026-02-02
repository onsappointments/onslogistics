import { NextRequest, NextResponse } from "next/server";
import  connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search =  searchParams.get("search") || "";
    const skip = (page - 1) * limit || 0;

      let filters   = {};
      
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filters = {
        $or: [
          { jobNumber: searchRegex },
          { jobId: searchRegex },
          {status: searchRegex },
          {shipmentType: searchRegex},
          {dateFrom: searchRegex },
          {dateTo: searchRegex },
          { company: searchRegex },
          { customerName: searchRegex },
        ],
      };
    }

const [
  totalJobs,
  totalQuotes,
  totalAdmins,
  totalClients,
  totalAuditLogs,
] = await Promise.all([
  Job.countDocuments(),
  Quote.countDocuments(),
  User.countDocuments({ role: "admin" }),
  User.countDocuments({ role: "client" }),
  AuditLog.countDocuments(),
]);

const totalJobPage = Math.ceil(totalJobs / limit);
const totalQuotePage = Math.ceil(totalQuotes / limit);
const totalClientPage = Math.ceil(totalClients / limit);
const totalAdminPage = Math.ceil(totalAdmins / limit);
const totalAuditPage = Math.ceil(totalAuditLogs / limit);
 


    const pageCounts = {
      jobs: {
        total: totalJobs,
        totalPages: totalJobPage,
      },
      quotes: {
        total: totalQuotes,
        totalPages: totalQuotePage,
      },
      clients: {
        total: totalClients,
        totalPages: totalClientPage,
      },
      admins: {
        total: totalAdmins,
        totalPages: totalAdminPage,
      },
      audit: {
        total: totalAuditLogs,
        totalPages: totalAuditPage,
      },
    };


    const jobs = await Job.find(filters)
      .populate("technicalQuoteId")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const jobsList = jobs.map((job: any) => {
      const techQuote = job.technicalQuoteId;
      return {
        _id: job._id.toString(),
        jobNumber: job.jobNumber || "",
        jobId: job.jobId,
        company: job.company || job.customerName || "Unknown",
        status: job.status,
        source: job.source,
        shipmentType: techQuote?.shipmentType || "N/A",
        createdAt: job.createdAt,
        completedAt: job.status === "completed" ? job.updatedAt : null,
        revenue: techQuote?.grandTotalINR || 0,
      };
    });

    // ====================
    // QUOTES LIST
    // ====================
    const quotes = await Quote.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Check which quotes have linked jobs
    const quotesWithJobs = await Job.find({
      quoteId: { $in: quotes.map((q: any) => q._id) },
    }).select("quoteId").lean().skip(skip).limit(limit);
    
    const quoteIdsWithJobs = new Set(
      quotesWithJobs.map((j: any) => j.quoteId?.toString())
    );

    const quotesList = quotes.map((quote: any) => ({
      _id: quote._id.toString(),
      quoteNo: quote.quoteNo || "N/A",
      company: quote.company,
      email: quote.email,
      status: quote.status,
      shipmentType: quote.shipmentType || "Not set",
      fromCountry: quote.fromCountry,
      toCountry: quote.toCountry,
      createdAt: quote.createdAt,
      hasLinkedJob: quoteIdsWithJobs.has(quote._id.toString()),
    }));

    // ====================
    // CLIENT ACTIVITY
    // ====================
    const clients = await User.find({ role: "client" }).lean().skip(skip).limit(limit);

    const clientActivityPromises = clients.map(async (client: any) => {
      const clientJobs = await Job.find({
        clientUser: client._id,
      })
        .populate("technicalQuoteId")
        .lean().skip(skip).limit(limit);

      const clientQuotes = await Quote.find({
        clientUser: client._id,
      }).lean().skip(skip).limit(limit);

      const totalRevenue = clientJobs.reduce((sum, job: any) => {
        const techQuote = job.technicalQuoteId as any;
        return sum + (techQuote?.grandTotalINR || 0);
      }, 0);

      const completedJobs = clientJobs.filter(
        (j: any) => j.status === "completed"
      ).length;

      const approvedQuotes = clientQuotes.filter(
        (q: any) => q.status === "approved"
      ).length;

      // Get last activity date
      const lastJobDate = clientJobs.length
        ? new Date(Math.max(...clientJobs.map((j: any) => new Date(j.updatedAt).getTime())))
        : null;
      const lastQuoteDate = clientQuotes.length
        ? new Date(Math.max(...clientQuotes.map((q: any) => new Date(q.updatedAt).getTime())))
        : null;

      let lastActivity = client.createdAt;
      if (lastJobDate && lastQuoteDate) {
        lastActivity = lastJobDate > lastQuoteDate ? lastJobDate : lastQuoteDate;
      } else if (lastJobDate) {
        lastActivity = lastJobDate;
      } else if (lastQuoteDate) {
        lastActivity = lastQuoteDate;
      }

      return {
        clientName: client.fullName,
        company: client.company || "N/A",
        totalJobs: clientJobs.length,
        completedJobs,
        totalRevenue: Math.round(totalRevenue),
        quotesRequested: clientQuotes.length,
        quotesApproved: approvedQuotes,
        lastActivity: lastActivity,
      };
    });

    const clientActivity = await Promise.all(clientActivityPromises);

    // Sort by total revenue
    clientActivity.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // ====================
    // ADMIN PERFORMANCE
    // ====================
    const admins = await User.find({ role: "admin" }).lean().skip(skip).limit(limit);

    const adminPerformancePromises = admins.map(async (admin: any) => {
      const adminLogs = await AuditLog.find({
        performedBy: admin._id,
      }).lean();

      // Jobs where this admin did something
      const jobActions = adminLogs.filter(
        (log: any) => log.entityType === "job"
      );
      const uniqueJobs = new Set(
        jobActions.map((log: any) => log.entityId.toString())
      );

      // Quotes processed
      const quoteActions = adminLogs.filter(
        (log: any) =>
          log.entityType === "quote" || log.entityType === "technical_quote"
      );
      const uniqueQuotes = new Set(
        quoteActions.map((log: any) => log.entityId.toString())
      );

      // Calculate average response time (simplified - time between quote creation and first admin action)
      const quoteResponseTimes: number[] = [];
      for (const quoteAction of quoteActions.slice(0, 50)) {
        // Sample 50 for performance
        const quote = await Quote.findById(quoteAction.entityId).select(
          "createdAt"
        );
        if (quote) {
          const responseTime =
            (new Date(quoteAction.createdAt).getTime() -
              new Date(quote.createdAt).getTime()) /
            (1000 * 60 * 60); // hours
          if (responseTime > 0 && responseTime < 168) {
            // Less than a week
            quoteResponseTimes.push(responseTime);
          }
        }
      }

      const avgResponseTime =
        quoteResponseTimes.length > 0
          ? Math.round(
              quoteResponseTimes.reduce((a, b) => a + b, 0) /
                quoteResponseTimes.length
            )
          : 0;

      return {
        adminName: admin.fullName,
        role: admin.adminType || "admin",
        totalActions: adminLogs.length,
        jobsHandled: uniqueJobs.size,
        quotesProcessed: uniqueQuotes.size,
        avgResponseTime,
      };
    });

    const adminPerformance = await Promise.all(adminPerformancePromises);

    // Sort by total actions
    adminPerformance.sort((a, b) => b.totalActions - a.totalActions);

    // ====================
    // RECENT AUDIT LOGS
    // ====================
    const recentLogs = await AuditLog.find({})
      .populate("performedBy", "fullName adminType")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const recentAuditLogs = recentLogs.map((log: any) => ({
      _id: log._id.toString(),
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId.toString(),
      description: log.description,
      performedBy: log.performedBy?.fullName || "System",
      performedByRole: log.performedBy?.adminType || "",
      createdAt: log.createdAt,
    }));

    // ====================
    // RETURN DATA
    // ====================
    return NextResponse.json({
      jobsList,
      quotesList,
      clientActivity,
      adminPerformance,
      recentAuditLogs,
      pageCounts
    });
  } catch (error) {
    console.error("Detailed Analytics API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch detailed analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}