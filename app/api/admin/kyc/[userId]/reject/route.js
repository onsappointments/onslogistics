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

    const body = await req.json().catch(() => ({}));
    const reason = (body?.reason || "").trim();

    if (!reason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }

    const kyc = await KycVerification.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          status: "rejected",
          rejectionReason: reason,
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
    console.error("❌ Admin reject error:", err);
    return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
  }
}
