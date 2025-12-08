import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function POST(req) {
  await connectDB();

  const form = await req.formData();
  const id = form.get("id");

  const fields = {};

  form.forEach((value, key) => {
    if (key !== "id") fields[key] = value || null;
  });

  const updated = await Job.findByIdAndUpdate(id, fields, { new: true });

  if (!updated) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  return Response.json({
    success: true,
    message: "Job updated successfully",
    job: updated,
  });
}
