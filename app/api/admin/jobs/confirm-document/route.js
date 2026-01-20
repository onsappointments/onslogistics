import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, documentName } = await req.json();

    if (!jobId || !documentName) {
      return NextResponse.json(
        { error: "jobId and documentName are required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ensure documents array exists
    if (!Array.isArray(job.documents)) {
      job.documents = [];
    }

    // Find or create document
    let doc = job.documents.find(d => d.name === documentName);

    if (!doc) {
      doc = {
        name: documentName,
        confirmed: true,
        confirmedAt: new Date(),
      };
      job.documents.push(doc);
    } else {
      doc.confirmed = true;
      doc.confirmedAt = new Date();
    }

    await job.save();

    /* ---------------- AUDIT LOG ---------------- */
    await logAudit({
      entityType: "job",
      entityId: job._id,
      action: "document_confirmed",
      description: `Document "${documentName}" confirmed`,
      performedBy: session.user.id,
      meta: {
        jobId: job.jobId,
        documentName,
        confirmedAt: doc.confirmedAt,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error("❌ Error confirming document:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
