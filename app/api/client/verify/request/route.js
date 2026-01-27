// app/api/client/verify/request/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import sendClientOTP from "@/lib/sendClientOTP";

const OTP_TTL_MINUTES = 10;

function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({}));
    const to = normalizeEmail(body.email);

    if (!to) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await User.findOne({ email: to, role: "client" });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (client.verified === true) {
      return NextResponse.json(
        { message: "Client already verified" },
        { status: 200 }
      );
    }

    // throttle 60s
    const now = new Date();
    if (client.clientOtpLastSentAt) {
      const diffMs =
        now.getTime() - new Date(client.clientOtpLastSentAt).getTime();
      if (diffMs < 60 * 1000) {
        return NextResponse.json(
          { error: "Please wait a minute before requesting a new OTP" },
          { status: 429 }
        );
      }
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    console.log("🔍 Generating OTP:", {
      email: to,
      otp,
      expiresAt: expiresAt.toISOString()
    });

    // ✅ Use native MongoDB collection to bypass Mongoose schema strictness
    const db = User.db;
    const result = await db.collection('users').updateOne(
      { email: to, role: "client" },
      {
        $set: {
          clientOtp: otp,
          clientOtpExpiresAt: expiresAt,
          clientOtpAttempts: 0,
          clientOtpLastSentAt: now
        }
      }
    );

    console.log("🔍 MongoDB update result:", {
      matched: result.matchedCount,
      modified: result.modifiedCount
    });

    // Verify by fetching again
    const verifyClient = await User.findOne({ email: to, role: "client" }).lean();
    console.log("✅ After update - Verification:", {
      email: to,
      clientOtp: verifyClient.clientOtp,
      clientOtpExpiresAt: verifyClient.clientOtpExpiresAt,
      clientOtpAttempts: verifyClient.clientOtpAttempts,
      hasOtp: !!verifyClient.clientOtp,
      hasExpiry: !!verifyClient.clientOtpExpiresAt
    });

    await sendClientOTP({ to, otp });

    return NextResponse.json(
      { message: "OTP sent successfully", expiresInMinutes: OTP_TTL_MINUTES },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ OTP request error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}