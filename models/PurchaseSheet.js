import mongoose from "mongoose";

const PurchaseSheetSchema = new mongoose.Schema({
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
        required: true,
    },

    lineItems: [
        {
            head: String,
            remarks: String,
            vendor: String,

            quantity: { type: Number, default: 0 },
            rate: { type: Number, default: 0 },
            currency: { type: String, default: "INR" },
            exchangeRate: { type: Number, default: 1 },

            baseAmount: { type: Number, default: 0 },

            igstPercent: { type: Number, default: 0 },
            igstAmount: { type: Number, default: 0 },
            cgstPercent: { type: Number, default: 0 },
            cgstAmount: { type: Number, default: 0 },
            sgstPercent: { type: Number, default: 0 },
            sgstAmount: { type: Number, default: 0 },

            totalAmount: { type: Number, default: 0 },
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.PurchaseSheet ||
    mongoose.model("PurchaseSheet", PurchaseSheetSchema);