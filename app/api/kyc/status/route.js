import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KycVerification from "@/models/KycVerification";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    let kyc = await KycVerification.findOne({ user: userId }).lean();

    // If not created yet, return default state (don’t force create)
    if (!kyc) {
      return NextResponse.json({
        status: "not_submitted",
        documents: [],
        rejectionReason: null,
      });
    }

    return NextResponse.json({
      status: kyc.status || "not_submitted",
      documents: Array.isArray(kyc.documents) ? kyc.documents : [],
      rejectionReason: kyc.rejectionReason || null,
      reviewedAt: kyc.reviewedAt || null,
    });
  } catch (err) {
    console.error("❌ KYC status error:", err);
    return NextResponse.json({ error: "Failed to fetch KYC status" }, { status: 500 });
  }
}
