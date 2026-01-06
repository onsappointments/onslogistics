import mongoose from "mongoose";

/* ---------------- LINE ITEM ---------------- */

const LineItemSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    rate: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      default: "INR",
    },

    exchangeRate: {
      type: Number,
      default: 1, // FX → INR
      min: 0,
    },

    baseAmount: {
      type: Number,
      default: 0, // rate * qty * exchangeRate
      min: 0,
    },

    igstPercent: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },

    cgstPercent: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },

    sgstPercent: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },

    totalAmount: {
      type: Number,
      default: 0, // base + all taxes
      min: 0,
    },
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
      enum: ["import", "export"],
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

    /* 🧮 Totals */
    subtotal: { type: Number, default: 0 },
    igstTotal: { type: Number, default: 0 },
    cgstTotal: { type: Number, default: 0 },
    sgstTotal: { type: Number, default: 0 },

    grandTotal: {
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ---------------- AUTO TOTAL CALC ---------------- */

function calculateTotals(doc) {
  let subtotal = 0;
  let igst = 0;
  let cgst = 0;
  let sgst = 0;

  (doc.lineItems || []).forEach((i) => {
    subtotal += Number(i.baseAmount || 0);
    igst += Number(i.igstAmount || 0);
    cgst += Number(i.cgstAmount || 0);
    sgst += Number(i.sgstAmount || 0);
  });

  doc.subtotal = subtotal;
  doc.igstTotal = igst;
  doc.cgstTotal = cgst;
  doc.sgstTotal = sgst;
  doc.grandTotal = subtotal + igst + cgst + sgst;
}

/* SAVE */
TechnicalQuoteSchema.pre("save", function (next) {
  calculateTotals(this);
  next();
});

/* UPDATE */
TechnicalQuoteSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update?.lineItems) {
    calculateTotals(update);
    this.setUpdate(update);
  }
  next();
});

export default mongoose.models.TechnicalQuote ||
  mongoose.model("TechnicalQuote", TechnicalQuoteSchema);
