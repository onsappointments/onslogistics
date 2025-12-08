import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "new";

  const jobs = await Job.find({ status }).sort({ createdAt: -1 }).lean();

  return Response.json({ jobs });
}
