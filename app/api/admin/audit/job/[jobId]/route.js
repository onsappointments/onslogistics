import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import Job from "@/models/Job";
import TechnicalQuote from "@/models/TechnicalQuote";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // ✅ FIX: await params
    const { jobId } = await params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId).lean();
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const entityFilters = [];

    // Job logs
    entityFilters.push({
      entityType: "job",
      entityId: job._id,
    });

    // Quote + Technical Quote logs
    if (job.quoteId) {
      entityFilters.push({
        entityType: "quote",
        entityId: job.quoteId,
      });

      const techQuote = await TechnicalQuote.findOne({
        clientQuoteId: job.quoteId,
      }).lean();

      if (techQuote) {
        entityFilters.push({
          entityType: "technical_quote",
          entityId: techQuote._id,
        });
      }
    }

    const logs = await AuditLog.find({
      $or: entityFilters,
    })
      .populate("performedBy", "name email")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (err) {
    console.error("JOB AUDIT FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
