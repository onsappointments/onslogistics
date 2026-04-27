import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

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

  const blockedTechQuotes = await TechnicalQuote.find({
    status: { $in: ["sent_to_client", "client_approved"] },
  }).select("clientQuoteId");

  const blockedQuoteIds = blockedTechQuotes.map(tq => tq.clientQuoteId);

  // 🧑‍💼 Admin override
  if ( session.user.adminType === "super_admin") {
    const quotes = await Quote.find({
      ...timeFilter,
      status: "pending",
      _id: { $nin: blockedQuoteIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(quotes);
  }

  // 🔐 Salesperson view
  const quotes = await Quote.find({
    ...timeFilter,
    status: "pending",
    _id: { $nin: blockedQuoteIds },
    $or: [
      { assignedTo: userId },
      { source: "CLIENT", assignedTo: null }
    ]
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json(quotes);
}