import connectDb from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(req, context) {
    const { id } = context.params;

    await connectDb();

    const quote = await Quote.findById(id);
    if (!quote) {
        return Response.json({ error: "Quote not found" }, { status: 404 });
    }

    const { shipmentType } = await req.json();

    quote.shipmentType = shipmentType;
    await quote.save();

    return Response.json(quote);
}
