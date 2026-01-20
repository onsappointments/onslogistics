import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const admin = searchParams.get("admin");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!admin || !mongoose.Types.ObjectId.isValid(admin)) {
      return NextResponse.json(
        { error: "Valid admin id required" },
        { status: 400 }
      );
    }

    const query = {
      performedBy: new mongoose.Types.ObjectId(admin),
    };

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const logs = await AuditLog.find(query)
      .populate("performedBy", "fullName email")
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("ADMIN AUDIT LOGS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
