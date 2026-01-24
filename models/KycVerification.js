import mongoose from "mongoose";

const KycDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["aadhaar_front", "aadhaar_back", "pan"],
    required: true,
  },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const KycVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one KYC per user
    },

    documents: {
      type: [KycDocumentSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.KycVerification ||
  mongoose.model("KycVerification", KycVerificationSchema);
