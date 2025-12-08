import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function DELETE(req) {
  await connectDB();

  const { id } = await req.json();

  const deleted = await Job.findByIdAndDelete(id);

  if (!deleted) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  return Response.json({
    success: true,
    message: "Job deleted permanently",
  });
}
