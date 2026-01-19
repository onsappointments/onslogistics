// app/api/client/quotes/[id]/reject/route.js

import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";

export async function POST(req, context) {
  console.log("=== REJECT ROUTE STARTED ===");

  try {
    // Extract ID safely
    let id;
    try {
      id = (await context.params).id;
    } catch {
      id = context.params.id;
    }

    console.log("Quote ID:", id);

    if (!id) {
      return Response.json({ error: "Quote ID is required" }, { status: 400 });
    }

    // Get remarks from client
    let remarks = "";
    try {
      const body = await req.json();
      remarks = body?.remarks || "";
    } catch (e) {
      // If no body, remarks remain empty
    }

    console.log("Client Remarks:", remarks);

    await connectDB();

    const quote = await TechnicalQuote.findById(id);

    if (!quote) {
      return Response.json({ error: "Quote not found" }, { status: 404 });
    }

    console.log("Quote found:", {
      id: quote._id,
      status: quote.status,
      clientQuoteId: quote.clientQuoteId,
    });

    // Already rejected
    if (quote.status === "client_rejected") {
      return Response.json({
        success: true,
        message: "Quote was already rejected",
        clientQuoteId: quote.clientQuoteId.toString(),
        previousRemarks: quote.clientRemarks || "",
      });
    }

    // Prevent rejecting after approval
    if (quote.status === "client_approved") {
      return Response.json({
        success: false,
        message: "Quote cannot be rejected because it was already approved",
        clientQuoteId: quote.clientQuoteId.toString(),
      });
    }

    // Update status + add remarks
    quote.status = "client_rejected";
    quote.clientRemarks = remarks;

    await quote.save();

    console.log("Quote rejection saved successfully");

    return Response.json({
      success: true,
      message: "Quote rejected successfully",
      clientQuoteId: quote.clientQuoteId.toString(),
      remarksSaved: remarks,
    });

  } catch (error) {
    console.error("=== REJECT ROUTE ERROR ===");
    console.error(error);

    return Response.json(
      {
        error: "Failed to reject quote",
        message: error.message,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
