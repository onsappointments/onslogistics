import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit";


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
  /* ---------------- AUDIT LOG ---------------- */
  await logAudit({
    entityType: "technical_quote",
    entityId: technicalQuote._id,
    action: "client_rejected",
    description: "Client rejected the technical quotation",
    performedBy: "client",
    meta: {
      clientQuoteId: technicalQuote.clientQuoteId,
      shipmentType: technicalQuote.shipmentType,
      grandTotal: technicalQuote.grandTotal,
    },
  });
  // ✅ REDIRECT CLIENT
  redirect("/client/quote-rejected");
}
