import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import Quote from "@/models/Quote";
import {
  IMPORT_HEADS,
  EXPORT_HEADS,
} from "@/constants/expenditureHeads";

export async function POST(req) {
  try {
    await connectDB();

    const { quoteId, shipmentType, lineItems = [] } = await req.json();

    if (!quoteId || !shipmentType) {
      return Response.json(
        { error: "quoteId and shipmentType are required" },
        { status: 400 }
      );
    }

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return Response.json({ error: "Quote not found" }, { status: 404 });
    }

    /* ---------------- VALIDATE HEADS ---------------- */

    const ALLOWED_HEADS =
      shipmentType === "import" ? IMPORT_HEADS : EXPORT_HEADS;

    const invalidHead = lineItems.find(
      (item) => !ALLOWED_HEADS.includes(item.head)
    );

    if (invalidHead) {
      return Response.json(
        {
          error: "Invalid expenditure head",
          invalidHead: invalidHead.head,
          allowed: ALLOWED_HEADS,
        },
        { status: 400 }
      );
    }

    /* ---------------- NORMALIZE LINE ITEMS ---------------- */

    const normalizedLineItems = lineItems.map((item) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const exchangeRate = Number(item.exchangeRate || 1);

      const baseAmount = rate * quantity * exchangeRate;

      const igstPercent = Number(item.igstPercent || 0);
      const cgstPercent = Number(item.cgstPercent || 0);
      const sgstPercent = Number(item.sgstPercent || 0);

      const igstAmount = baseAmount * (igstPercent / 100);
      const cgstAmount = baseAmount * (cgstPercent / 100);
      const sgstAmount = baseAmount * (sgstPercent / 100);

      const totalAmount =
        baseAmount + igstAmount + cgstAmount + sgstAmount;

      return {
        head: item.head, // ✅ GUARANTEED VALID
        quantity,
        rate,
        currency: item.currency || "INR",
        exchangeRate,
        baseAmount,
        igstPercent,
        igstAmount,
        cgstPercent,
        cgstAmount,
        sgstPercent,
        sgstAmount,
        totalAmount,
      };
    });

    /* ---------------- UPSERT TECH QUOTE ---------------- */

    const techQuote = await TechnicalQuote.findOneAndUpdate(
      { clientQuoteId: quoteId },
      {
        clientQuoteId: quoteId,
        shipmentType,
        lineItems: normalizedLineItems,
        status: "draft",
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return Response.json({
      success: true,
      technicalQuote: techQuote,
    });
  } catch (error) {
    console.error("TECH QUOTE SAVE ERROR:", error);
    return Response.json(
      { error: "Failed to save technical quote" },
      { status: 500 }
    );
  }
}
