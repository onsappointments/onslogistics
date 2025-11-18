import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file");
    const businessName = formData.get("businessName"); // ✅ using businessName
    const shipmentId = formData.get("shipmentId") || null;

    if (!file || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields (file or businessName)" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Save file to /public/uploads
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    // Save document record in MongoDB
    const newDoc = await Document.create({
      businessName, // ✅ store business name instead of userId
      shipmentId,
      fileName: file.name,
      fileUrl: `/uploads/${file.name}`,
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
