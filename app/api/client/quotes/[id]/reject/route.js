// app/api/client/quotes/[id]/reject/route.js

import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";

export async function POST(req, context) {
  console.log("=== REJECT ROUTE STARTED ===");
  
  try {
    // Handle params - try multiple approaches for compatibility
    let id;
    try {
      const params = await context.params;
      id = params.id;
    } catch (e) {
      id = context.params.id;
    }

    console.log("Quote ID:", id);

    if (!id) {
      console.log("ERROR: No ID provided");
      return Response.json({ error: "Quote ID is required" }, { status: 400 });
    }

    console.log("Connecting to DB...");
    await connectDB();
    console.log("DB connected");
    
    console.log("Finding quote by ID:", id);
    const quote = await TechnicalQuote.findById(id);
    
    if (!quote) {
      console.log("ERROR: Quote not found");
      return Response.json({ error: "Quote not found" }, { status: 404 });
    }

    console.log("Quote found:", {
      id: quote._id,
      status: quote.status,
      clientQuoteId: quote.clientQuoteId
    });

    // Check if already rejected
    if (quote.status === "client_rejected") {
      console.log("Quote already rejected");
      return Response.json({ 
        success: true, 
        message: "Quote was already rejected",
        clientQuoteId: quote.clientQuoteId.toString()
      });
    }

    //check if already approved 
    if (quote.status === "client_approved") {
      console.log("Quote already approved");
      return Response.json({ 
        success: true, 
        message: "Quote cannot be rejected because it was already approved",
        clientQuoteId: quote.clientQuoteId.toString()
      });
    }
    
    console.log("Updating quote status to rejected...");
    quote.status = "client_rejected";
    
    console.log("Saving quote...");
    await quote.save();
    console.log("Quote saved successfully");
    
    return Response.json({ 
      success: true, 
      message: "Quote rejected successfully",
      clientQuoteId: quote.clientQuoteId.toString()
    });
    
  } catch (error) {
    console.error("=== REJECT ROUTE ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return Response.json({ 
      error: "Failed to reject quote",
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
