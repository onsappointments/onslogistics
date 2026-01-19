import mongoose from "mongoose";

/* ---------------- LINE ITEM ---------------- */

const LineItemSchema = new mongoose.Schema(
  {
    head: { type: String, required: true },
    quantity: { type: Number, default: 0, min: 0 },
    rate: { type: Number, default: 0, min: 0 },

    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      default: "INR",
    },

    exchangeRate: { type: Number, default: 1, min: 0 },

    baseAmount: { type: Number, default: 0, min: 0 },

    igstPercent: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },

    cgstPercent: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },

    sgstPercent: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },

    totalAmount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

/* ---------------- TECHNICAL QUOTE ---------------- */

const TechnicalQuoteSchema = new mongoose.Schema(
  {
    clientQuoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      unique: true,
      index: true,
    },

    shipmentType: {
      type: String,
      enum: ["import", "export" , "courier"],
      required: true,
      immutable: true,
    },

    jobMeta: {
      jobNo: String,
      salesPerson: String,
      accountsPerson: String,
    },

    shipmentDetails: {
      shipper: String,
      consignee: String,
      carrier: String,
      portOfLoading: String,
      portOfDischarge: String,
      modeOfShipment: String,
      fclLcl: String,
      volumeWeight: String,
    },

    /* 💰 Charges */
    lineItems: {
      type: [LineItemSchema],
      default: [],
    },

    /* 🌍 Currency Summary (DISPLAY & REPORTING) */
    currencySummary: {
      type: Object, // plain object → safest
      default: {},
    },

    /* ✅ Base currency total */
    grandTotalINR: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "internal_review",
        "sent_to_client",
        "client_approved",
        "client_rejected",
      ],
      default: "draft",
    },

    clientRemarks: {
    type: String,
    default: "",
},


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.TechnicalQuote ||
  mongoose.model("TechnicalQuote", TechnicalQuoteSchema);
