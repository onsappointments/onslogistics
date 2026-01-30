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
    fromLocationType: {
      type: String,
      enum : ["Port" , "Door" , "ICD"],
      required: true,
    },
    toLocationType: {
      type: String,
      enum : ["Port" , "Door" , "ICD"],
      required: true,
    },
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
    containerType : {
      type: String,
      enum : ["20 FT", "40 FT Gen", "40 FT HC", "LCL" , "Not set"],
      required: true,
    },
    modeOfShipment: String,

    shipmentType: {
      type: String,
      enum: ["import", "export", "courier" , "Not set"],
    },

        clientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

leadStatus: {
  type: String,
  enum: ["lead", "otp_sent", "verified", "converted"],
  default: "lead",
},

leadVerifiedAt: { type: Date, default: null },


    // Goods information
    goodsPurpose: String,
    valueOfGoods: String,
    currency: String,
    dimensions: String,
    pieces: {
      type: String,
    },
    imoCode: String,
    natureOfGoods: {
      type: String,
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