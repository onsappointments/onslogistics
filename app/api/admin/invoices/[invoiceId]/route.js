// src/app/api/admin/invoices/[invoiceId]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Invoice from "@/models/Invoice";
import PartyDirectory from "@/models/PartyDirectory";

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

export async function GET(request, { params }) {
    await dbConnect();
    const invoice = await Invoice.findById(params.invoiceId).lean();
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ invoice });
}

export async function PUT(request, { params }) {
    await dbConnect();
    const invoice = await Invoice.findById(params.invoiceId);
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (invoice.invoiceType === "tax")
        return NextResponse.json({ error: "Tax invoices are locked and cannot be edited." }, { status: 403 });

    const body = await request.json();
    const totals = computeTotals(body.lineItems);

    Object.assign(invoice, body, totals);
    await invoice.save();

    // Fire-and-forget party upsert — non-fatal
    upsertParties(body).catch((e) =>
        console.warn("[invoice PUT] PartyDirectory upsert failed:", e.message)
    );

    return NextResponse.json({ invoice });
}

export async function PATCH(request, { params }) {
    await dbConnect();
    const invoice = await Invoice.findById(params.invoiceId);
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (invoice.invoiceType === "tax")
        return NextResponse.json({ error: "Already a Tax Invoice" }, { status: 400 });

    invoice.invoiceType = "tax";
    invoice.lockedAt = new Date();
    await invoice.save();
    return NextResponse.json({ invoice });
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const invoice = await Invoice.findById(params.invoiceId);
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (invoice.invoiceType === "tax")
        return NextResponse.json({ error: "Tax invoices cannot be deleted." }, { status: 403 });
    await invoice.deleteOne();
    return NextResponse.json({ success: true });
}