import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,   // 🔥 replacing userId completely
    },
    referenceId: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Documentation",
        "Customs",
        "Railout",
        "Sailout",
        "Delivered",
      ], // 🔥 add Documentation here
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Shipment ||
  mongoose.model("Shipment", ShipmentSchema);
