import mongoose from "mongoose";

const QuoteOtpSchema = new mongoose.Schema({
  email: String,
  otpHash: String,
  quoteData: Object,
  expiresAt: Date,
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.QuoteOtp ||
  mongoose.model("QuoteOtp", QuoteOtpSchema);
