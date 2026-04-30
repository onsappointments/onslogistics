// src/app/api/admin/invoices/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Invoice from "@/models/Invoice";
import Job from "@/models/Job";
import TechnicalQuote from "@/models/TechnicalQuote";
import PartyDirectory from "@/models/PartyDirectory";
import { mapJobToInvoiceDefaults } from "@/lib/invoiceFieldMap";

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
}

function computeTotals(lineItems = []) {
    let subtotal = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0;
    lineItems.forEach((item) => {
        const amt = parseFloat(item.amount) || 0;
        const gst = parseFloat(item.gstRate) || 0;
        subtotal += amt;
        if (item.taxType === "igst") {
            totalIgst += +(amt * gst / 100).toFixed(2);
        } else {
            const half = gst / 2;
            totalCgst += +(amt * half / 100).toFixed(2);
            totalSgst += +(amt * half / 100).toFixed(2);
        }
    });
    return {
        subtotal: +subtotal.toFixed(2),
        totalCgst: +totalCgst.toFixed(2),
        totalSgst: +totalSgst.toFixed(2),
        totalIgst: +totalIgst.toFixed(2),
        grandTotal: +(subtotal + totalCgst + totalSgst + totalIgst).toFixed(2),
    };
}

/**
 * Map a TechnicalQuote line item → Invoice line item.
 *
 * TQ field        Invoice field   Notes
 * ─────────────── ─────────────── ────────────────────────────────────────
 * head            description
 * remarks         subNote         shown in italic under description on PDF
 * "HSN/SAC"       hsnSac
 * baseAmount      amount          pre-tax base in INR
 * igstPercent > 0 → taxType "igst",      gstRate = igstPercent
 * cgstPercent > 0 → taxType "cgst_sgst", gstRate = cgstPercent × 2
 * both = 0        → taxType "cgst_sgst", gstRate = 0  (still included)
 *
 * Filter: only drop items where baseAmount is missing or zero — we keep
 * 0% GST items (e.g. exempt services) because the accountant still needs
 * them on the invoice.
 */
function mapTQLines(tqItems = []) {
    return tqItems
        .filter((it) => parseFloat(it.baseAmount) > 0)   // must have a base amount
        .map((it) => {
            const igstPct = parseFloat(it.igstPercent) || 0;
            const cgstPct = parseFloat(it.cgstPercent) || 0;

            let taxType = "cgst_sgst";
            let gstRate = 0;

            if (igstPct > 0) {
                taxType = "igst";
                gstRate = igstPct;
            } else if (cgstPct > 0) {
                taxType = "cgst_sgst";
                gstRate = cgstPct * 2; // full GST = CGST + SGST
            }

            return {
                description: it.head || "",
                subNote: it.remarks || "",   // ← remarks → subNote
                hsnSac: it["HSN/SAC"] || "",
                amount: parseFloat(it.baseAmount),
                taxType,
                gstRate,
            };
        });
}

async function upsertParties(body) {
    const parties = [
        { gstin: body.consigneeGstin, name: body.consigneeName, address: body.consigneeAddress, pan: body.consigneePan, state: body.consigneeState },
        { gstin: body.buyerGstin, name: body.buyerName, address: body.buyerAddress, pan: body.buyerPan, state: body.buyerState },
    ].filter((p) => p.gstin && p.gstin.length === 15);

    if (!parties.length) return;

    await Promise.allSettled(
        parties.map((p) =>
            PartyDirectory.findOneAndUpdate(
                { gstin: p.gstin.toUpperCase() },
                { $set: { gstin: p.gstin.toUpperCase(), name: p.name || "", address: p.address || "", pan: (p.pan || "").toUpperCase(), state: p.state || "", lastSeenAt: new Date() } },
                { upsert: true, new: true }
            )
        )
    );
}

// ── GET /api/admin/invoices?jobId=xxx  → prefill defaults + TQ line items
// ── GET /api/admin/invoices            → list all invoices
export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (jobId) {
        const job = await Job.findById(jobId).populate("quoteId").lean();
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        const defaults = mapJobToInvoiceDefaults(job);

        // Pull line items from TechnicalQuote and bake into defaults
        const quoteObjectId = job.quoteId?._id ?? job.quoteId;
        if (quoteObjectId) {
            try {
                const tq = await TechnicalQuote.findOne({ clientQuoteId: quoteObjectId }).lean();
                if (tq?.lineItems?.length) {
                    defaults.lineItems = mapTQLines(tq.lineItems);
                    // Pre-compute totals so the mini-summary is correct on first render
                    Object.assign(defaults, computeTotals(defaults.lineItems));
                }
            } catch (e) {
                console.warn("[invoices GET] TechnicalQuote lookup failed:", e.message);
            }
        }

        const existing = await Invoice.findOne({ jobId }).lean();

        return NextResponse.json({
            defaults,
            existing: existing || null,
            job: { _id: job._id, jobId: job.jobId, company: job.company, status: job.status },
        });
    }

    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ invoices });
}

// ── POST /api/admin/invoices  → create new invoice
export async function POST(request) {
    await dbConnect();
    const body = await request.json();
    const totals = computeTotals(body.lineItems);

    const invoice = await Invoice.create({
        ...body,
        ...totals,
        lockedAt: body.invoiceType === "tax" ? new Date() : null,
    });

    // Save party details for future auto-fill (fire-and-forget)
    upsertParties(body).catch((e) =>
        console.warn("[invoice POST] PartyDirectory upsert failed:", e.message)
    );

    return NextResponse.json({ invoice }, { status: 201 });
}