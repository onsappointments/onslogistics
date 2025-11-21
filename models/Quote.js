import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    fromCity: String,
    toCity: String,
    fromLocationType: String,
    toLocationType: String,
    fromState: String,
    toState: String,
    fromPostal: String,
    toPostal: String,

    item: String,
    modeOfTransport: String,
    estimatedShippingDate: String,
    freightTerms: String,
    containerType: String,
    modeOfShipment: String,
    goodsPurpose: String,
    valueOfGoods: String,
    currency: String,
    dimensions: String,
    pieces: String,
    imoCode: String,
    natureOfGoods: String,
    temperature: String,
    totalWeight: String,
    weightMeasure: String,

    firstName: String,
    lastName: String,
    company: String,
    email: String,
    phoneCountryCode: String,
    phone: String,
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
    enum: ["pending", "approved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  },
  { timestamps: true }
);

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
