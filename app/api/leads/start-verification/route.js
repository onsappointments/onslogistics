// app/api/leads/start-verification/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import sendClientOTP from "@/lib/sendClientOTP";
import crypto from "crypto";
import jwt from "jsonwebtoken";

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}
function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

export async function POST(req) {
  try {
    await connectDB();

    const { company, email } = await req.json();
    const safeCompany = (company || "").trim();
    const safeEmail = (email || "").trim().toLowerCase();

    if (!safeCompany || !safeEmail) {
      return NextResponse.json(
        { error: "company and email are required" },
        { status: 400 }
      );
    }

    // must exist in Quote collection (pre-lead)
    const existingLead = await Quote.findOne({
      company: safeCompany,
      email: safeEmail,
    })
      .select("_id clientUser")
      .lean();

    if (!existingLead) {
      return NextResponse.json(
        { error: "No quote found for this company/email" },
        { status: 404 }
      );
    }

    // if already linked to a user, don't allow re-register via lead flow
    if (existingLead.clientUser) {
      return NextResponse.json(
        { error: "This email is already registered. Please login." },
        { status: 409 }
      );
    }

    const otp = genOtp();
    const otpHash = hashOtp(otp);

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET missing in env" },
        { status: 500 }
      );
    }

    // Stateless challenge token (10 min)
    const challengeToken = jwt.sign(
      {
        t: "lead_otp_challenge",
        company: safeCompany,
        email: safeEmail,
        otpHash,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // send OTP email (your helper)
    await sendClientOTP({ to: safeEmail, otp });

    return NextResponse.json({ challengeToken }, { status: 200 });
  } catch (error) {
    console.error("POST /api/leads/start-verification error:", error);
    return NextResponse.json(
      { error: "Failed to start verification" },
      { status: 500 }
    );
  }
}
