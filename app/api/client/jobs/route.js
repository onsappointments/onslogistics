import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

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

    const jobs = await Job.find({
      clientUser: session.user.id,
      status: { $in: ["new", "active"] },
    })
      .select("_id jobId jobNumber mblNumber hblNumber stage status createdAt type")
      .populate({ path: "quoteId", select: "company firstName lastName shipmentType createdAt" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/client/jobs error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
