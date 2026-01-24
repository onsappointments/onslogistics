import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import KycVerification from "@/models/KycVerification";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const count = await KycVerification.countDocuments({ status: "pending" });
    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error("❌ pending-count error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
