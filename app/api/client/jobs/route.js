import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote"; 
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "client") {
      return NextResponse.json(
        { error: `Forbidden: role=${session.user.role}` },
        { status: 403 }
      );
    }

    await connectDB();

    const clientId = new mongoose.Types.ObjectId(session.user.id);

    // ✅ IMPORTANT: filter out broken quoteId values (string/empty etc.)
    const jobs = await Job.find({
      clientUser: clientId,
      status: { $in: ["new", "active"] },
      $or: [
        { quoteId: { $exists: false } },   // no quoteId field
        { quoteId: null },                 // quoteId is null
        { quoteId: { $type: "objectId" } } // valid objectId only
      ],
    })
      .select("_id jobId jobNumber mblNumber hblNumber stage status createdAt type quoteId")
      .populate({
        path: "quoteId",
        select: "company firstName lastName shipmentType createdAt status referenceNo",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/client/jobs error:", err);
    // ✅ return real error so you can see it in Network response
    return NextResponse.json(
      { error: err?.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
