import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import Quote from "@/models/Quote";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import {
  IMPORT_HEADS,
  EXPORT_HEADS,
} from "@/constants/expenditureHeads";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quoteId, shipmentType, lineItems = [] } = await req.json();

    /* ---------------- BASIC VALIDATION ---------------- */

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

    /* ---------------- VALIDATE EXPENDITURE HEADS ---------------- */

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
      const currency = item.currency || "INR";

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
        head: item.head,
        quantity,
        rate,
        currency,
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

    /* ---------------- CURRENCY SUMMARY ---------------- */
const currencySummary = normalizedLineItems.reduce((acc, item) => {
  const curr = item.currency;

  if (!acc[curr]) {
    acc[curr] = {
      currency: curr,
      services: [],
      subtotal: 0,
      exchangeRate: item.exchangeRate || 1,
      inrEquivalent: 0,
    };
  }

  acc[curr].services.push({
    head: item.head,
    quantity: item.quantity,
    amount: item.rate * item.quantity,
    inrAmount: item.totalAmount, 
  });

  acc[curr].subtotal += item.rate * item.quantity;
  acc[curr].inrEquivalent += item.totalAmount;


  return acc;
}, {});


    /* ---------------- GRAND TOTAL (INR) ---------------- */

    const grandTotalINR = Object.values(currencySummary).reduce(
      (sum, curr) => sum + curr.inrEquivalent,
      0
    );
    const existingTechQuote = await TechnicalQuote.findOne({
      clientQuoteId: quoteId,
    });
    
    /* ---------------- UPSERT (🔥 MUST USE $set) ---------------- */

    const techQuote = await TechnicalQuote.findOneAndUpdate(
      { clientQuoteId: quoteId },
      {
        $set: {
          clientQuoteId: quoteId,
          shipmentType,
          lineItems: normalizedLineItems,
          currencySummary,
          grandTotalINR,
          status: "draft",
        },
      },
      { upsert: true, new: true }
    );

    /* ---------------- AUDIT LOG ---------------- */

    if (!existingTechQuote) {
       // ✅ FIRST TIME CREATION
       await logAudit({
        entityType: "technical_quote",
        entityId: techQuote._id,
        action: "created",
        description: "Technical quote created",
        performedBy: session.user.id,
        meta: {
         quoteId,
         shipmentType,
        },
      });
    } else {
  // ✅ SAVED AS DRAFT
      await logAudit({
       entityType: "technical_quote",
       entityId: techQuote._id,
       action: "saved_draft",
       description: "Technical quote saved as draft",
       performedBy: session.user.id,
       meta: {
         quoteId,
          updatedLineItems: normalizedLineItems.length,
       },
     });
   }


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
