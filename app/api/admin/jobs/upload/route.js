export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import cloudinary from "@/lib/cloudinary";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ restrict upload (recommended)
    const isAdmin = session.user.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const jobId = formData.get("jobId");
    const documentName = formData.get("documentName");
    const file = formData.get("file");

    if (!jobId || !documentName || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "onslogistics/documents",
            resource_type: "auto",
            access_mode: "public",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    // ✅ Update existing doc OR create it (match your DocumentSchema)
    const docName = String(documentName).trim();
    let doc = job.documents?.find((d) => d.name === docName);

    if (doc) {
      doc.fileUrl = fileUrl;
      doc.uploadedAt = new Date();

      // reset confirmation state when new file uploaded
      doc.confirmed = false;
      doc.confirmedAt = null;

      // optional if you still store uploadedFile
      doc.uploadedFile = fileUrl;
    } else {
      job.documents.push({
        name: docName,
        fileUrl,
        uploadedAt: new Date(),
        confirmed: false,
        confirmedAt: null,
        uploadedFile: fileUrl,
      });
    }

    await job.save();

    await logAudit({
      entityType: "job",
      entityId: job._id,
      action: "document_uploaded",
      description: `Document "${docName}" uploaded`,
      performedBy: session.user.id,
      meta: {
        jobId: job.jobId,
        documentName: docName,
        fileUrl,
        uploadedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, fileUrl, job }, { status: 200 });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
