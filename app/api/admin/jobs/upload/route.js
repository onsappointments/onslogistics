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
    console.log("=== UPLOAD START ===");

    await connectDB();
    console.log("✅ DB connected");

    const session = await getServerSession(authOptions);
    console.log("✅ Session:", JSON.stringify(session?.user));

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let formData;
    try {
      formData = await req.formData();
      console.log("✅ FormData parsed");
    } catch (formErr) {
      console.error("❌ FormData parse failed:", formErr.message);
      return NextResponse.json({ error: "Failed to parse form data: " + formErr.message }, { status: 400 });
    }

    const jobId = formData.get("jobId");
    const documentName = formData.get("documentName");
    const file = formData.get("file");

    console.log("Fields:", { jobId, documentName, fileName: file?.name, fileSize: file?.size, fileType: file?.type });

    if (!jobId || !documentName || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    console.log("✅ Job found:", job?._id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // ✅ Use base64 instead of upload_stream (more reliable in serverless)
    let buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
      console.log("✅ Buffer created, size:", buffer.length);
    } catch (bufErr) {
      console.error("❌ Buffer failed:", bufErr.message);
      return NextResponse.json({ error: "Failed to read file: " + bufErr.message }, { status: 500 });
    }

    let uploadResult;
    try {
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;
      console.log("⬆️ Uploading to Cloudinary...");

      uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "onslogistics/documents",
        resource_type: "auto",
        access_mode: "public",
      });
      console.log("✅ Cloudinary upload done:", uploadResult?.secure_url);
    } catch (cloudErr) {
      console.error("❌ Cloudinary upload failed:", cloudErr.message, cloudErr);
      return NextResponse.json({ error: "Cloudinary upload failed: " + cloudErr.message }, { status: 500 });
    }

    const fileUrl = uploadResult.secure_url;
    const docName = String(documentName).trim();
    let doc = job.documents?.find((d) => d.name === docName);

    if (doc) {
      doc.fileUrl = fileUrl;
      doc.uploadedAt = new Date();
      doc.confirmed = false;
      doc.confirmedAt = null;
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
    console.log("✅ Job saved");

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

    console.log("=== UPLOAD SUCCESS ===");
    return NextResponse.json({ success: true, fileUrl, job }, { status: 200 });

  } catch (err) {
    console.error("❌ UPLOAD ERROR:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json({
      error: err.message || "Internal server error",
      type: err.name,
    }, { status: 500 });
  }
}