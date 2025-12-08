import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const jobId = formData.get("jobId");
    const documentName = formData.get("documentName");
    const file = formData.get("file");

    if (!jobId || !documentName || !file) {
      return NextResponse.json(
        { error: "jobId, documentName and file are required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ensure /uploads/jobId directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", jobId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique file name
    const originalName = file.name;
    const ext = path.extname(originalName);
    const newFileName = `${documentName.replace(/\s/g, "_")}${ext}`;
    const filePath = path.join(uploadDir, newFileName);

    // Save the file to /public/uploads/jobId
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    // File URL (public)
    const fileUrl = `/uploads/${jobId}/${newFileName}`;

    // Update job document list
    const existing = job.documents.find((d) => d.name === documentName);

    if (existing) {
      existing.uploadedFile = fileUrl;
      existing.uploadedAt = new Date();
    } else {
      job.documents.push({
        name: documentName,
        uploadedFile: fileUrl,
        uploadedAt: new Date(),
        isCompleted: false,
      });
    }

    await job.save();

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
      job,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { error: "Internal server error during file upload" },
      { status: 500 }
    );
  }
}
