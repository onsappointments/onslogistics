import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // 1️⃣ Get unique admin IDs from audit logs
    const adminIds = await AuditLog.distinct("performedBy", {
      performedBy: { $ne: null },
    });

    // 2️⃣ Fetch admin details
    const admins = await User.find({
      _id: { $in: adminIds },
    })
      .select("fullName email role adminType")
      .sort({ fullName: 1 });

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (err) {
    console.error("ADMIN LIST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
