import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");

  let timeFilter = {};

  const now = Date.now();

  if (filter === "24h") {
    timeFilter.createdAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
  }

  if (filter === "48h") {
    timeFilter.createdAt = { $gte: new Date(now - 48 * 60 * 60 * 1000) };
  }

  if (filter === "7d") {
    timeFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
  }

const quotes = await Quote.find({
  ...timeFilter,                    
  status: "pending",      
}).sort({ createdAt: -1 });

  return Response.json(quotes);
}
