// app/api/leads/verify-otp/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import crypto from "crypto";
import jwt from "jsonwebtoken";

function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

export async function POST(req) {
  try {
    await connectDB();

    const { challengeToken, otp } = await req.json();

    if (!challengeToken || !otp) {
      return NextResponse.json(
        { error: "challengeToken and otp are required" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET missing in env" },
        { status: 500 }
      );
    }

    let payload;
    try {
      payload = jwt.verify(challengeToken, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "OTP session expired or invalid" },
        { status: 401 }
      );
    }

    if (payload?.t !== "lead_otp_challenge") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const ok = hashOtp(otp) === payload.otpHash;
    if (!ok) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 401 });
    }

    // Prefill from latest quote
    const latestQuote = await Quote.findOne({
      company: payload.company,
      email: payload.email,
    })
      .sort({ createdAt: -1 }) // uses timestamps
      .lean();

    if (!latestQuote) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const prefill = {
      fullName: `${latestQuote.firstName || ""} ${latestQuote.lastName || ""}`.trim(),
      company: latestQuote.company,
      email: latestQuote.email,
      phoneCountryCode: latestQuote.phoneCountryCode,
      phone: latestQuote.phone,
      whatsappNumber: latestQuote.whatsappNumber || "",
      fromCountry: latestQuote.fromCountry,
      toCountry: latestQuote.toCountry,
      fromCity: latestQuote.fromCity,
      toCity: latestQuote.toCity,
    };

    // Verified token for final registration (15 min)
    const verifiedToken = jwt.sign(
      {
        t: "lead_otp_verified",
        company: payload.company,
        email: payload.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return NextResponse.json(
      { verified: true, verifiedToken, prefill },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/leads/verify-otp error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
