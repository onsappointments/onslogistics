export async function GET(req) {
  await connectDB();

  const status = req.nextUrl.searchParams.get("status");

  const jobs = await Job.find({ status })
    .populate("quoteId")       // <-- THIS loads the quote
    .sort({ createdAt: -1 });

  return Response.json({ jobs });
}
