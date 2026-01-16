import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import QuoteOtp from "@/models/QuoteOtp";

export async function POST(req) {
  await connectDB();
  const { quoteId, otp } = await req.json();

  const record = await QuoteOtp.findById(quoteId);

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  if (otpHash !== record.otpHash) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  record.verified = true;
  await record.save();

  // TODO: Save final quote / send admin email here

  return NextResponse.json({ success: true });
}
