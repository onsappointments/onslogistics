import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const jobId = formData.get("jobId");
    const documentName = formData.get("documentName");
    const fileUrl = formData.get("fileUrl"); // Sent from UploadThing

    if (!jobId || !documentName || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    let doc = job.documents.find((d) => d.name === documentName);

    if (doc) {
      doc.uploadedFile = fileUrl;
      doc.uploadedAt = new Date();
    } else {
      job.documents.push({
        name: documentName,
        uploadedFile: fileUrl,
        uploadedAt: new Date(),
      });
    }

    await job.save();

    return NextResponse.json({ success: true, fileUrl, job });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
