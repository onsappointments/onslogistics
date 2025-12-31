import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";

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

  /* 🔴 STEP 1: find quotes that MUST be hidden */
  const blockedTechQuotes = await TechnicalQuote.find({
    status: { $in: ["sent_to_client", "client_approved"] },
  }).select("clientQuoteId");

  const blockedQuoteIds = blockedTechQuotes.map(
    (tq) => tq.clientQuoteId.toString()
  );

  /* 🟢 STEP 2: fetch ONLY actionable client quotes */
  const quotes = await Quote.find({
    ...timeFilter,
    status: "pending",             // your existing logic
    _id: { $nin: blockedQuoteIds } // 🔑 core fix
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json(quotes);
}
