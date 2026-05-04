// app/api/admin/technical-quotes/preview-pdf/route.js

import { NextResponse } from "next/server";
import { generateTechnicalQuotePdf } from "@/lib/GenerateTechnicalQuotePdf";

export async function POST(req) {
    try {
        const { quoteId } = await req.json();

        if (!quoteId) {
            return NextResponse.json({ error: "quoteId required" }, { status: 400 });
        }

        // ── Reuse the same endpoint your frontend already calls ──
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const quoteRes = await fetch(`${baseUrl}/api/admin/quotes/${quoteId}`, {
            headers: {
                cookie: req.headers.get("cookie") || "",
            },
        });

        if (!quoteRes.ok) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        const data = await quoteRes.json();

        // Mirror the same destructuring your frontend uses
        const clientQuote =
            data?.quote || data?.clientQuote || data?.data?.quote || null;
        const technicalQuote = data?.technicalQuote || null;

        if (!clientQuote) {
            return NextResponse.json(
                { error: "Client quote missing in response" },
                { status: 404 }
            );
        }

        if (!technicalQuote) {
            return NextResponse.json(
                { error: "Technical quote not saved yet — please save a draft first." },
                { status: 400 }
            );
        }

        const pdfBuffer = await generateTechnicalQuotePdf({
            clientQuote,
            technicalQuote,
        });

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="quote-${quoteId}.pdf"`,
                "Content-Length": pdfBuffer.length.toString(),
            },
        });
    } catch (err) {
        console.error("PDF preview error:", err);
        return NextResponse.json(
            { error: err.message || "PDF generation failed" },
            { status: 500 }
        );
    }
}