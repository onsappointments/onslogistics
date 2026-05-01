import User from "@/models/User";

async function upsertUserFromInvoice(data) {
    if (!data?.buyerGstin) return;

    await User.findOneAndUpdate(
        { gstin: data.buyerGstin },
        {
            fullName: data.buyerName || "Client",
            company: data.buyerName,
            gstin: data.buyerGstin,
            pan: data.buyerPan,
            address: data.buyerAddress,
            state: data.buyerState,
        },
        { upsert: true, new: true }
    );
}