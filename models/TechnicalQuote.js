import mongoose from "mongoose";
import {
  IMPORT_HEADS,
  EXPORT_HEADS,
} from "@/constants/expenditureHeads";

/* ---------------- LINE ITEM ---------------- */

const LineItemSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      required: true,
    },

    serviceRequired: {
      type: Boolean,
      default: false,
    },

    serviceDone: {
      type: Boolean,
      default: false,
    },

    rate: {
      type: Number,
      default: 0,
      min: 0,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

/* ---------------- TECHNICAL QUOTE ---------------- */

const TechnicalQuoteSchema = new mongoose.Schema(
  {
    /* 🔗 Link to client RFQ */
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

    /* 🧾 Job metadata */
    jobMeta: {
      jobNo: String,
      salesPerson: String,
      accountsPerson: String,
    },

    /* 🚢 Shipment info */
    shipmentDetails: {
      shipper: String,
      consignee: String,
      carrier: String,
      portOfLoading: String,
      portOfDischarge: String,
      modeOfShipment: String,
      fclLcl: String,
      volumeWeight: String,
      fxRate: Number,
    },

    /* 💰 Charges */
    lineItems: {
      type: [LineItemSchema],
      validate: {
        validator: function (items) {
          if (!items || items.length === 0) return true;

          if (this.shipmentType === "export") {
            return items.every((i) => EXPORT_HEADS.includes(i.head));
          }

          if (this.shipmentType === "import") {
            return items.every((i) => IMPORT_HEADS.includes(i.head));
          }

          return false;
        },
        message: "Invalid expenditure head for shipment type",
      },
    },

    /* 🧮 Totals */
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

/* ✅ AUTO-CALC TOTALS ON SAVE */
TechnicalQuoteSchema.pre("save", function (next) {
  this.grandTotal = (this.lineItems || []).reduce(
    (sum, i) => sum + Number(i.totalAmount || 0),
    0
  );
  next();
});

/* ✅ AUTO-CALC TOTALS ON UPDATE (CRITICAL) */
TechnicalQuoteSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update?.lineItems) {
    update.grandTotal = update.lineItems.reduce(
      (sum, i) => sum + Number(i.totalAmount || 0),
      0
    );
    this.setUpdate(update);
  }

  next();
});

export default mongoose.models.TechnicalQuote ||
  mongoose.model("TechnicalQuote", TechnicalQuoteSchema);
