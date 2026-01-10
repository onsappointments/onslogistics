import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import { Resend } from "resend";
import { logAudit } from "@/lib/audit";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectDB();

    const { quoteId } = await req.json();

    if (!quoteId) {
      return Response.json({ error: "quoteId required" }, { status: 400 });
    }

    /* ---------------- FETCH CLIENT QUOTE ---------------- */

    const clientQuote = await Quote.findById(quoteId).lean();
    if (!clientQuote) {
      return Response.json({ error: "Client quote not found" }, { status: 404 });
    }

    /* ---------------- FETCH TECHNICAL QUOTE ---------------- */

    const technicalQuote = await TechnicalQuote.findOne({
      clientQuoteId: quoteId,
    });

    if (!technicalQuote) {
      return Response.json(
        { error: "Technical quote not found" },
        { status: 404 }
      );
    }

    /* ---------------- PREVENT RESEND ---------------- */
    if (technicalQuote.status === "sent_to_client") {
      return Response.json({
        message: "Quote already sent to client",
      });
    }

    /* ---------------- UPDATE STATUS ---------------- */

    technicalQuote.status = "sent_to_client";
    await technicalQuote.save();

    /* ---------------- BUILD LINKS ---------------- */

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // ✅ VIEW uses CLIENT QUOTE ID (page expects clientQuoteId)
    const viewQuoteUrl = `${baseUrl}/client/quotes/${quoteId}`;

    // ✅ ACTIONS use TECHNICAL QUOTE ID (API updates TechnicalQuote)
    const approveUrl = `${baseUrl}/api/client/quotes/${technicalQuote._id}/approve`;
    const rejectUrl  = `${baseUrl}/api/client/quotes/${technicalQuote._id}/reject`;

    /* ---------------- SEND EMAIL ---------------- */

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: clientQuote.email,
      subject: "Quotation from ONS Logistics",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Quotation from ONS Logistics</h2>

          <p>Hello ${clientQuote.firstName},</p>

          <p>Please review your quotation and choose an action below.</p>

          <div style="margin: 24px 0;">
            <a href="${viewQuoteUrl}"
              style="display:inline-block;
                     padding:12px 20px;
                     background:#2563eb;
                     color:#ffffff;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:600;
                     margin-right:10px;">
              View Quotation
            </a>

            <a href="${approveUrl}"
              style="display:inline-block;
                     padding:12px 20px;
                     background:#16a34a;
                     color:#ffffff;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:600;
                     margin-right:10px;">
              ✅ Approve Quote
            </a>

            <a href="${rejectUrl}"
              style="display:inline-block;
                     padding:12px 20px;
                     background:#dc2626;
                     color:#ffffff;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:600;">
              ❌ Reject Quote
            </a>
          </div>

          <p style="margin-top:20px">
            If you have any questions, feel free to reply to this email.
          </p>

          <p>
            Regards,<br/>
            <strong>ONS Logistics Team</strong>
          </p>
        </div>
      `,
    });
    
    /* ---------------- AUDIT LOG ---------------- */

    await logAudit({
      entityType: "technical_quote",
     entityId: technicalQuote._id,
     action: "sent_to_client",
     description: "Technical quote finalized and sent to client",
     performedBy: null, // or req.user._id when auth is wired
     meta: {
       clientQuoteId: quoteId,
       email: clientQuote.email,
       shipmentType: technicalQuote.shipmentType,
       grandTotal: technicalQuote.grandTotal,
      },
   });


    return Response.json({
      success: true,
      message: "Quotation sent to client",
    });
  } catch (error) {
    console.error("SEND TECH QUOTE ERROR:", error);
    return Response.json(
      { error: "Failed to send quotation" },
      { status: 500 }
    );
  }
}
