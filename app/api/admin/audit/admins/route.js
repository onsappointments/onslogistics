import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export async function GET() {
  try {
    await connectDB();

    const admins = await AuditLog.distinct("performedBy", {
      performedBy: { $ne: null },
    });

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
