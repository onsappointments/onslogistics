import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KycVerification from "@/models/KycVerification";

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "pending").toLowerCase();

    // safety: allow only these
    const allowed = new Set(["pending", "approved", "rejected", "not_submitted"]);
    const normalizedStatus = allowed.has(status) ? status : "pending";

    const kycs = await KycVerification.find({ status: normalizedStatus })
      .sort({ updatedAt: -1 })
      .populate("user", "fullName email company role")
      .lean();

    return NextResponse.json({ success: true, kycs });
  } catch (err) {
    console.error("❌ Admin KYC list error:", err);
    return NextResponse.json({ error: "Failed to fetch KYC requests" }, { status: 500 });
  }
}
