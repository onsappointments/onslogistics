import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit";


export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params; 
  const technicalQuote = await TechnicalQuote.findById(id);

  if (!technicalQuote) {
    return new Response("Quotation not found", { status: 404 });
  }

  // ✅ UPDATE STATUS
  technicalQuote.status = "client_approved";
  await technicalQuote.save();
  
  /* ---------------- AUDIT LOG ---------------- */
  await logAudit({
    entityType: "technical_quote",
    entityId: technicalQuote._id,
    action: "client_approved",
    description: "Client approved the technical quotation",
    performedBy: "client",
    meta: {
      clientQuoteId: technicalQuote.clientQuoteId,
      shipmentType: technicalQuote.shipmentType,
      grandTotal: technicalQuote.grandTotal,
    },
  });


  // ✅ REDIRECT CLIENT
  redirect(`/client/quotes/${technicalQuote.clientQuoteId}/approved`);
}