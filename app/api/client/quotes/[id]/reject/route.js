import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import { redirect } from "next/navigation";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params; // 🔥 MUST await

  const technicalQuote = await TechnicalQuote.findById(id);

  if (!technicalQuote) {
    return new Response("Quotation not found", { status: 404 });
  }

  // ✅ UPDATE STATUS
  technicalQuote.status = "client_rejected";
  await technicalQuote.save();

  // ✅ REDIRECT CLIENT
  redirect(`/client/quotes/${technicalQuote.clientQuoteId}/rejected`);
}
