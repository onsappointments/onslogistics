import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    // Basic validation for required fields
    const requiredFields = [
      "fromCountry",
      "toCountry", 
      "fromCity",
      "toCity",
      "item",
      "modeOfTransport",
      "containerType",
      "modeOfShipment",
      "firstName",
      "company",
      "email",
      "phoneCountryCode",
      "phone",
    ];

    const missing = requiredFields.filter(
      (f) => !data[f] || data[f].toString().trim() === ""
    );

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Save the quote directly
    const createdQuote = await Quote.create({
      ...data,
      status: "pending",
      verifiedEmail: false, // No email verification in this flow
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quote submitted successfully",
        quoteId: createdQuote._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 }
    );
  }
}