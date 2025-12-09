export async function GET(req) {
  await connectDB();

  const status = req.nextUrl.searchParams.get("status");

  const jobs = await Job.find({ status })
    .select("_id jobId status stages quoteId")  // ← ensure _id is included
    .populate({
      path: "quoteId",
      select: "company firstName lastName",     // populate only needed fields
    })
    .sort({ createdAt: -1 });

  return Response.json({ jobs });
}
