import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const businessName = searchParams.get("businessName");

    console.log("📩 Fetching documents for:", businessName);

    if (!businessName) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    // ✅ Case-insensitive match and trims extra spaces
    const regex = new RegExp(`^${businessName.trim()}$`, "i");

    const documents = await Document.find({
      businessName: { $regex: regex },
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${documents.length} document(s)`);

    return NextResponse.json(documents);
  } catch (err) {
    console.error("❌ Error fetching documents:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
