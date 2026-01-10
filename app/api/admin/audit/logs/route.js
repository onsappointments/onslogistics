import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

/*
  GET /api/admin/audit/logs
  ?admin=<adminId or email>
  &from=2026-01-01
  &to=2026-01-31
*/

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const admin = searchParams.get("admin");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!admin) {
      return NextResponse.json(
        { error: "admin parameter is required" },
        { status: 400 }
      );
    }

    const query = {
      performedBy: admin, // must match how you store it in AuditLog
    };

    /* -------- DATE FILTER (optional) -------- */
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const logs = await AuditLog.find(query)
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
