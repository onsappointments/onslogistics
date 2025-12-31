import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import Quote from "@/models/Quote";

export async function POST(req) {
  await connectDB();

  const { quoteId, shipmentType, lineItems } = await req.json();

  const quote = await Quote.findById(quoteId);
  if (!quote) {
    return Response.json({ error: "Quote not found" }, { status: 404 });
  }

  const techQuote = await TechnicalQuote.findOneAndUpdate(
    { clientQuoteId: quoteId },
    {
      clientQuoteId: quoteId,
      shipmentType,
      lineItems,
      status: "draft",
    },
    { upsert: true, new: true }
  );

  return Response.json({ success: true, technicalQuote: techQuote });
}
