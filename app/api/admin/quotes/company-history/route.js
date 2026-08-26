import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { authOptions } from "@/lib/authOptions";
import TechnicalQuote from "@/models/TechnicalQuote";

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const isAuthorizedAdmin =
      session?.user?.adminType === "super_admin" ||
      (session?.user?.role === "admin" &&
        session?.user?.permissions?.includes("quote:request"));

    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const gstin = searchParams.get("gstin")?.trim().toUpperCase();
    const company = searchParams.get("company")?.trim();

    if (!gstin && !company) {
      return NextResponse.json(
        {
          success: false,
          error: "GSTIN or Company is required.",
        },
        { status: 400 }
      );
    }

    const query = gstin
      ? { gstin }
      : { company };

    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // --------------------------------------------------
// LOAD TECHNICAL QUOTES FOR THESE QUOTATIONS
// --------------------------------------------------

const quoteIds = quotes.map((quote) => quote._id);

const technicalQuotes = quoteIds.length
  ? await TechnicalQuote.find({
      clientQuoteId: { $in: quoteIds },
    }).lean()
  : [];

// Create a quick lookup:
// Quote ID → Technical Quote
const technicalQuoteMap = new Map(
  technicalQuotes.map((technicalQuote) => [
    technicalQuote.clientQuoteId.toString(),
    technicalQuote,
  ])
);

// Attach the matching technical quote to each quotation
const quotesWithTechnical = quotes.map((quote) => ({
  ...quote,
  technicalQuote:
    technicalQuoteMap.get(quote._id.toString()) || null,
}));

    return NextResponse.json({
      success: true,
      count: quotesWithTechnical.length,
      quotes: quotesWithTechnical,
    });

  } catch (error) {
    console.error("COMPANY HISTORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch company history.",
      },
      {
        status: 500,
      }
    );
  }
}