import mongoose from "mongoose";

const QuoteOtpSchema = new mongoose.Schema({
  email: { type: String, required: true },

  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },

  // Store full quote form here without validation
  quoteData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

export default mongoose.models.QuoteOtp ||
  mongoose.model("QuoteOtp", QuoteOtpSchema);
