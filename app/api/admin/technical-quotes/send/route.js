import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import { generateTechnicalQuotePdf } from "@/lib/GenerateTechnicalQuotePdf";
import { logAudit } from "@/lib/audit";
import sendClientEmail from "@/lib/sendClientEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }


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

    /* ---------------- GENERATE PDF ---------------- */

    const pdfBuffer = await generateTechnicalQuotePdf({
      clientQuote,
      technicalQuote,
    });

    /* ---------------- UPDATE STATUS ---------------- */

    technicalQuote.status = "sent_to_client";
    await technicalQuote.save();

    /* ---------------- BUILD LINKS - CLEANED VERSION ---------------- */

    // Get base URL and clean it thoroughly
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    baseUrl = baseUrl.trim().replace(/[\n\r]/g, '').replace(/\/$/, '');

    // Convert IDs to clean strings
    const quoteIdStr = String(quoteId).trim();
    const techQuoteIdStr = String(technicalQuote._id).trim();

    // Build URLs using existing folder structure
    const viewQuoteUrl = `${baseUrl}/client/quotes/${quoteIdStr}`;
    const approveUrl = `${baseUrl}/client/quotes/${techQuoteIdStr}/approve`;
    const rejectUrl = `${baseUrl}/client/quotes/${techQuoteIdStr}/reject`;

    console.log('=== EMAIL URLS ===');
    console.log('Base:', baseUrl);
    console.log('View:', viewQuoteUrl);
    console.log('Approve:', approveUrl);
    console.log('Reject:', rejectUrl);
    console.log('==================');

    /* ---------------- BUILD EMAIL HTML ---------------- */

    const emailHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Quotation from ONS Logistics</h2><p>Hello ${clientQuote.firstName},</p><p>Please review your quotation and choose an action below.</p><div style="margin:24px 0"><a href="${viewQuoteUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin-right:10px">View Quotation</a><a href="${approveUrl}" style="display:inline-block;padding:12px 20px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin-right:10px">✅ Approve Quote</a><a href="${rejectUrl}" style="display:inline-block;padding:12px 20px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">❌ Reject Quote</a></div><p style="margin-top:20px">If you have any questions, feel free to reply to this email.</p><p>Regards,<br/><strong>ONS Logistics Team</strong></p></div>`;

    /* ---------------- SEND EMAIL ---------------- */

    await sendClientEmail({
      to: clientQuote.email,
      subject: "Quotation from ONS Logistics",
      html: emailHtml,
      attachments: [
        {
          name: `Quotation-${clientQuote.referenceNo || quoteId}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    /* ---------------- AUDIT LOG ---------------- */

    await logAudit({
      entityType: "technical_quote",
      entityId: technicalQuote._id,
      action: "sent_to_client",
      description: "Technical quote finalized and sent to client",
      performedBy: session.user.id,
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