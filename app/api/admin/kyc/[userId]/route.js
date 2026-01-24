import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KycVerification from "@/models/KycVerification";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = params;

    const kyc = await KycVerification.findOne({ user: userId })
      .populate("user", "fullName email company")
      .lean();

    if (!kyc) {
      return NextResponse.json({ error: "KYC not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, kyc });
  } catch (err) {
    console.error("❌ Admin KYC detail error:", err);
    return NextResponse.json({ error: "Failed to fetch KYC" }, { status: 500 });
  }
}
