import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function POST(req) {
  await connectDB();

  const { jobId, userId, userName } = await req.json();

  const job = await Job.findByIdAndUpdate(
    jobId,
    {
      assignedTo: userId,
      assignedToName: userName,
      assignedAt: new Date(),
    },
    { new: true }
  );

  return Response.json(job);
}