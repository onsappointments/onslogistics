import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET() {
  await connectDB();

  const jobs = await Job.find({
     assignedTo: null,
      status: "new",
     }).sort({ createdAt: -1 });

  return Response.json(jobs);
}