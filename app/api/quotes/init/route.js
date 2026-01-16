import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import QuoteOtp from "@/models/QuoteOtp";
import sendOtpEmail from "@/lib/brevo";

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  if (!data.email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const record = await QuoteOtp.create({
    email: data.email,
    otpHash,
    quoteData: data,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(data.email, otp);

  return NextResponse.json({ quoteId: record._id });
}
