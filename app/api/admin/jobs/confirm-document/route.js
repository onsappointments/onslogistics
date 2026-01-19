import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import sendClientEmail from "@/lib/sendClientEmail.js";
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

    const performedBy = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      adminType: session.user.adminType,
    };


    const { jobId, documentName } = await req.json();

    if (!jobId || !documentName) {
      return NextResponse.json(
        { error: "jobId and documentName are required" },
        { status: 400 }
      );
    }

    // Populate the correct field: quoteId
    const job = await Job.findById(jobId).populate("quoteId");

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ensure documents list exists
    if (!Array.isArray(job.documents)) job.documents = [];

    // Update or create the document entry
    let doc = job.documents.find((d) => d.name === documentName);

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

    // -----------------------------
    // GET CLIENT EMAIL FROM QUOTE
    // -----------------------------
    let clientEmail = null;

    // job.quoteId has populated Quote now
    if (job.quoteId?.email) {
      clientEmail = job.quoteId.email;
    }

    // fallback: manual fetch if needed
    if (!clientEmail && job.quoteId) {
      const quote = await Quote.findById(job.quoteId);
      if (quote?.email) clientEmail = quote.email;
    }

    // Send email (if found)
    if (clientEmail) {
      await sendClientEmail({
        to: clientEmail,
        subject: `Document confirmed: ${documentName} for Job ${job.jobId}`,
        html: `
          <p>Hello,</p>
          <p>Your document <b>${documentName}</b> for Job <b>${job.jobId}</b> has been confirmed successfully.</p>
          <p>Thank you,<br>ONS Logistics</p>
        `,
      });
    }
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
        clientNotified: Boolean(clientEmail),
        clientEmail,
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
