import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import { generateTechnicalQuotePdf } from "@/lib/generateTechnicalQuotePdf";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { quoteId } = params;

    const clientQuote = await Quote.findById(quoteId).lean();
    if (!clientQuote) {
      return new Response("Quote not found", { status: 404 });
    }

    const technicalQuote = await TechnicalQuote.findOne({
      clientQuoteId: quoteId,
    });

    if (!technicalQuote) {
      return new Response("Technical quote not found", { status: 404 });
    }

    const pdfBuffer = await generateTechnicalQuotePdf({
      clientQuote,
      technicalQuote,
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Quotation-${quoteId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("DOWNLOAD PDF ERROR:", err);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
