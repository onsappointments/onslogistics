import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KycVerification from "@/models/KycVerification";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = params;

    const kyc = await KycVerification.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          status: "approved",
          rejectionReason: null,
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!kyc) {
      return NextResponse.json({ error: "KYC not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: kyc.status });
  } catch (err) {
    console.error("❌ Admin approve error:", err);
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }
}
