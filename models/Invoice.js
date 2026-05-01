import mongoose from "mongoose";

const LineItemSchema = new mongoose.Schema(
  {
    slNo:        { type: Number },
    description: { type: String, default: "" },
    subNote:     { type: String, default: "" },
    hsnSac:      { type: String, default: "" },

    taxType: {
      type: String,
      enum: ["cgst_sgst", "igst"],
      default: "cgst_sgst",
    },

    gstRate: { type: Number, default: 18 }, // % total GST
    amount:  { type: Number, default: 0 },  // base amount pre-tax
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────
    invoiceNumber: { type: String, default: "" },
    invoiceType: {
      type: String,
      enum: ["proforma", "tax"],
      default: "proforma",
    },
    jobId:  { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
    technicalQuoteId: { type: mongoose.Schema.Types.ObjectId, ref: "TechnicalQuote", default: null },
    jobRef: { type: String, default: "" },

    // ── Invoice Meta ──────────────────────────────────────────────
    date:               { type: Date,   default: Date.now },
    sbBeNumber:         { type: String, default: "" },
    destination:        { type: String, default: "" },
    numberOfPackages:   { type: String, default: "" },
    grossWeight:        { type: String, default: "" },
    partyInvoiceNumber: { type: String, default: "" },
    blNumber:           { type: String, default: "" },
    description:        { type: String, default: "" },
    containerNumber:    { type: String, default: "" },
    trackingNumber:     { type: String, default: "" },
    dimensions:         { type: String, default: "" },
    shipmentType:       { type: String, default: "" },
    exRate:             { type: String, default: "" },

    // ── Consignee ─────────────────────────────────────────────────
    consigneeName:    { type: String, default: "" },
    consigneeAddress: { type: String, default: "" },
    consigneeGstin:   { type: String, default: "" },
    consigneePan:     { type: String, default: "" },
    consigneeState:   { type: String, default: "" },

    // ── Buyer ─────────────────────────────────────────────────────
    buyerName:      { type: String, default: "" },
    buyerAddress:   { type: String, default: "" },
    buyerGstin:     { type: String, default: "" },
    buyerPan:       { type: String, default: "" },
    buyerState:     { type: String, default: "" },
    placeOfSupply:  { type: String, default: "" },

    // ── Line Items ────────────────────────────────────────────────
    lineItems: { type: [LineItemSchema], default: [] },

    // ── Computed Totals ───────────────────────────────────────────
    subtotal:   { type: Number, default: 0 },
    totalCgst:  { type: Number, default: 0 },
    totalSgst:  { type: Number, default: 0 },
    totalIgst:  { type: Number, default: 0 }, // NEW — interstate
    grandTotal: { type: Number, default: 0 },

    // ── Bank Details ──────────────────────────────────────────────
    bankAccountHolder: { type: String, default: "ONS Logistics India Pvt. Ltd" },
    bankName:          { type: String, default: "State Bank of India" },
    bankAccountNumber: { type: String, default: "36207405735" },
    bankIfsc:          { type: String, default: "Chd. Road, Mundian Kalan & SBIN0004633" },
    bankSwift:         { type: String, default: "" },
    companyPan:        { type: String, default: "AABCO1633R" },

    // ── Remarks / Declaration ─────────────────────────────────────
    remarks:     { type: String, default: "" },
    declaration: {
      type: String,
      default:
        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    },

    // ── Lifecycle ─────────────────────────────────────────────────
    lockedAt:  { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models?.Invoice || mongoose.model("Invoice", InvoiceSchema);