import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";



// Validate admin permissions...

export async function GET(req) {
    const session = await getServerSession(authOptions);

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const gstin = searchParams.get("gstin")?.trim().toUpperCase();
    const company = searchParams.get("company")?.trim();

    // Build query
    let query = {};

    if (gstin) {
      query.gstin = gstin;
    } else if (company) {
      query.company = company;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "GSTIN or Company is required.",
        },
        { status: 400 }
      );
    }

    const lastQuote = await Quote.findOne(query)
      .sort({ createdAt: -1 })
      .select(
        `
        quoteNo
        company
        gstin
        shipmentType
        modeOfTransport
        containerType
        item
        fromCountry
        toCountry
        fromCity
        toCity
        createdAt
      `
      )
      .lean();

    return NextResponse.json({
      success: true,
      quote: lastQuote,
    });
  } catch (error) {
    console.error("LAST QUOTE API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch last quote.",
      },
      {
        status: 500,
      }
    );
  }
}