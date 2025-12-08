import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import sendClientEmail from "@/lib/sendClientEmail";

const STAGE_LABELS = {
  1: "Documentation",
  2: "Stage 2",
  3: "Stage 3",
  4: "Stage 4",
  5: "Stage 5",
  6: "Stage 6",
  7: "Stage 7",
  8: "Stage 8",
  9: "Stage 9",
  10: "Stage 10",
};

export async function POST(req) {
  try {
    await connectDB();

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId).populate("createdFromQuote");

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ensure documents array exists
    if (!Array.isArray(job.documents) || job.documents.length === 0) {
      return NextResponse.json(
        { error: "No documents configured for this job" },
        { status: 400 }
      );
    }

   const allDocsDone = job.documents.every(
   (d) => d.isCompleted === true || d.confirmed === true
   );


    if (!allDocsDone) {
      return NextResponse.json(
        { error: "All documents must be completed before moving to next stage" },
        { status: 400 }
      );
    }

    if (job.stage >= 10) {
      // Already at final stage
      return NextResponse.json({
        success: true,
        message: "Job already at final stage",
        job,
      });
    }

    job.stage += 1;

    if (job.stage === 10) {
      job.status = "completed";
    }

    await job.save();

    const clientEmail =
      job.clientEmail ||
      job?.createdFromQuote?.email ||
      null;

    const stageName = STAGE_LABELS[job.stage] || `Stage ${job.stage}`;

    if (clientEmail) {
      await sendClientEmail({
        to: clientEmail,
        subject: `Job ${job.jobId} moved to ${stageName}`,
        text: `Dear customer,\n\nYour job ${job.jobId} has progressed to: ${stageName}.\n\nThank you,\nONS Logistics`,
      });
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (err) {
    console.error("❌ Error moving to next stage:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
