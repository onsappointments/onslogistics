import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";

export async function GET(req, context) {
  const { params } = context;
  const { id } = await params; // ✅ THIS IS THE FIX

  await connectDB();

  const quote = await Quote.findById(id).lean();
  if (!quote) {
    return Response.json({ error: "Quote not found" }, { status: 404 });
  }

  const technicalQuote = await TechnicalQuote.findOne({
    clientQuoteId: id,
  }).lean();

  return Response.json({
    quote,
    technicalQuote: technicalQuote || null,
  });
}
