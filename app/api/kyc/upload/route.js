import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KycVerification from "@/models/KycVerification";
import cloudinary from "@/lib/cloudinary";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

async function uploadToCloudinary(file, { folder, publicId }) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // PDFs should be raw (or auto), images are image
  const resourceType = file.type === "application/pdf" ? "raw" : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const formData = await req.formData();
    const aadhaarFront = formData.get("aadhaar_front");
    const aadhaarBack = formData.get("aadhaar_back");
    const pan = formData.get("pan");

    if (!aadhaarFront || !aadhaarBack || !pan) {
      return NextResponse.json(
        { error: "Missing required files: aadhaar_front, aadhaar_back, pan" },
        { status: 400 }
      );
    }

    const files = [
      { type: "aadhaar_front", file: aadhaarFront },
      { type: "aadhaar_back", file: aadhaarBack },
      { type: "pan", file: pan },
    ];

    // ✅ validate
    for (const f of files) {
      if (typeof f.file?.arrayBuffer !== "function") {
        return NextResponse.json({ error: `Invalid file: ${f.type}` }, { status: 400 });
      }

      const mime = f.file.type || "";
      if (!ALLOWED.has(mime)) {
        return NextResponse.json(
          { error: `Unsupported file type for ${f.type}: ${mime}` },
          { status: 400 }
        );
      }

      const size = Number(f.file.size || 0);
      if (size > MAX_BYTES) {
        return NextResponse.json(
          { error: `${f.type} is too large. Max ${MAX_MB}MB.` },
          { status: 400 }
        );
      }
    }

    // ✅ Upload
    const folder = `ons/kyc/${userId}`;
    const uploadedDocs = [];

    for (const f of files) {
      const publicId = `${f.type}_${Date.now()}`; // unique
      const result = await uploadToCloudinary(f.file, { folder, publicId });

      uploadedDocs.push({
        type: f.type,
        fileUrl: result.secure_url, // ✅ matches schema
        uploadedAt: new Date(),
      });
    }

    // ✅ upsert + replace documents
    const kyc = await KycVerification.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          status: "pending",
          rejectionReason: null,
          reviewedBy: null,
          reviewedAt: null,
          documents: uploadedDocs,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      status: kyc.status,
      documents: kyc.documents,
    });
  } catch (err) {
    console.error("❌ KYC Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
