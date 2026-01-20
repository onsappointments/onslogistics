export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import cloudinary from "@/lib/cloudinary";
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


    const formData = await req.formData();
    const jobId = formData.get("jobId");
    const documentName = formData.get("documentName");
    const file = formData.get("file");

    if (!jobId || !documentName || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "onslogistics/documents",
          resource_type: "auto",
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    let doc = job.documents.find((d) => d.name === documentName);

    if (doc) {
      doc.fileUrl = fileUrl;          // ✅ FIX
      doc.uploadedAt = new Date();
      doc.isCompleted = false;
    } else {
      job.documents.push({
        name: documentName,
        fileUrl: fileUrl,             // ✅ FIX
        uploadedAt: new Date(),
        isCompleted: false,
      });
    }

    await job.save();
    /* ---------------- AUDIT LOG ---------------- */
    await logAudit({
      entityType: "job",
      entityId: job._id,
     action: "document_uploaded",
     description: `Document "${documentName}" uploaded`,
     performedBy: session.user.id,
     meta: {
       jobId: job.jobId,
       documentName,
       fileUrl,
       uploadedAt: new Date(),
     },
   });

    return NextResponse.json({
      success: true,
      fileUrl,
      job,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
