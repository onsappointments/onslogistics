import connectDB from "@/lib/mongodb";
import PurchaseSheet from "@/models/PurchaseSheet";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const quoteId = searchParams.get("quoteId");

    if (!quoteId) {
        return Response.json({ lineItems: [] });
    }

    const sheet = await PurchaseSheet.findOne({ quoteId }).lean();
    return Response.json(sheet || { lineItems: [] });
}

export async function POST(req) {
    await connectDB();
    const { quoteId, lineItems } = await req.json();

    if (!quoteId) {
        return Response.json({ error: "quoteId required" }, { status: 400 });
    }

    let purchase = await PurchaseSheet.findOne({ quoteId });

    if (purchase) {
        purchase.lineItems = lineItems;
        await purchase.save();
    } else {
        purchase = await PurchaseSheet.create({ quoteId, lineItems });
    }

    return Response.json({ success: true });
}