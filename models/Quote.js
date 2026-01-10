import * as mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    fromCountry: {
      type: String,
      required: true,
    },
    toCountry: {
      type: String,
      required: true,
    },
    fromCity: {
      type: String,
      required: true,
    },
    toCity: {
      type: String,
      required: true,
    },
    fromLocationType: String,
    toLocationType: String,
    fromState: String,
    toState: String,
    fromPostal: String,
    toPostal: String,
    
    // Shipment details - essential for quoting
    item: {
      type: String,
      required: true,
    },
    modeOfTransport: {
      type: String,
      required: true,
    },
    estimatedShippingDate: String,
    freightTerms: String,
    containerType: String,
    modeOfShipment: String,
    shipmentType: {
      type: String,
      enum: ["import", "export", "courier"],
      required: true,
    },

    // Goods information
    goodsPurpose: String,
    valueOfGoods: String,
    currency: String,
    dimensions: String,
    pieces: {
      type: String,
      required: true,
    },
    imoCode: String,
    natureOfGoods: {
      type: String,
      required: true,
    },
    temperature: String,
    totalWeight: {
      type: String,
    },
    weightMeasure: {
      type: String,
    },

    // Contact information - required to respond to quote
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    company: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneCountryCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    whatsappNumber: String,
    yourWebsite: String,
    customerType: String,
    howDidYouKnowUs: String,
    preferredContactMethod: String,
    bestTimeToCall: String,
    bestTimeToEmail: String,
    message: String,
    
    status: {
      type: String,
      enum: [
        "pending",          // submitted by client
        "reviewing",        // sales team reviewing
        "indicative_sent",  // indicative quote sent
        "approved",         // client approved indicative
        "rejected",
      ],
      default: "pending",
    },
    
    referenceNo: {
      type: String, // RFQ-2025-00123
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Quote ||
  mongoose.model("Quote", QuoteSchema);