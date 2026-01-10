import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  const { jobId } = params;

  const logs = await AuditLog.find({
    $or: [
      { "references.jobId": jobId },
      { entityId: jobId },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ logs });
}
