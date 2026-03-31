import connectDB from "@/lib/mongodb";
import PurchaseSheet from "@/models/PurchaseSheet";

export async function POST(req) {
    await connectDB();

    const { quoteId, lineItems } = await req.json();

    let purchase = await PurchaseSheet.findOne({ quoteId });

    if (purchase) {
        purchase.lineItems = lineItems;
        await purchase.save();
    } else {
        purchase = await PurchaseSheet.create({
            quoteId,
            lineItems,
        });
        console.log("🚀 ~ file: route.js:17 ~ POST ~ purchase:", purchase)
    }

    return Response.json({ success: true });
}