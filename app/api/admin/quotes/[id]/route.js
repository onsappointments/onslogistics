// ============================================
// FIXED: Your API route with proper error handling
// app/api/admin/quotes/[id]/route.js
// ============================================

import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    const { params } = context;
    const { id } = params;

    console.log("🔍 API /admin/quotes/[id] - Received ID:", id);

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid ID format:", id);
      return Response.json(
        { error: "Invalid quote ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the quote
    const quote = await Quote.findById(id).lean();
    
    if (!quote) {
      console.log("❌ Quote not found:", id);
      return Response.json({ error: "Quote not found" }, { status: 404 });
    }

    console.log("✅ Quote found:", quote._id);

    // Find technical quote
    const technicalQuote = await TechnicalQuote.findOne({
      clientQuoteId: new mongoose.Types.ObjectId(id),
    }).lean();

    console.log("✅ Technical quote found:", !!technicalQuote);

    return Response.json({
      quote,
      technicalQuote: technicalQuote || null,
    });

  } catch (error) {
    console.error("❌ API Error in /admin/quotes/[id]:", error);
    return Response.json(
      { 
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}




