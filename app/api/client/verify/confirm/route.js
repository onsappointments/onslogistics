// app/api/client/verify/confirm/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({}));
    const e = normalizeEmail(body.email);
    const code = String(body.otp || "").trim();

    console.log("🔍 Confirm request received:", { email: e, otp: code });

    if (!e || !code) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // ✅ Use .lean() to get raw MongoDB document
    const client = await User.findOne({ email: e, role: "client" }).lean();
    
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    console.log("🔍 Client found (lean):", {
      email: e,
      verified: client.verified,
      clientOtp: client.clientOtp,
      clientOtpExpiresAt: client.clientOtpExpiresAt,
      hasOtp: !!client.clientOtp,
      hasExpiry: !!client.clientOtpExpiresAt
    });

    if (client.verified === true) {
      return NextResponse.json(
        { message: "Client already verified" },
        { status: 200 }
      );
    }

    // ✅ if OTP not set
    if (!client.clientOtp || !client.clientOtpExpiresAt) {
      console.log("❌ OTP fields missing:", {
        clientOtp: client.clientOtp,
        clientOtpExpiresAt: client.clientOtpExpiresAt
      });
      return NextResponse.json(
        { error: "OTP not requested or expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // ✅ expired check
    const expTime = new Date(client.clientOtpExpiresAt).getTime();
    const nowTime = Date.now();
    
    console.log("🔍 Expiry check:", {
      expiresAt: new Date(expTime).toISOString(),
      now: new Date(nowTime).toISOString(),
      isExpired: expTime < nowTime,
      timeLeftMs: expTime - nowTime
    });

    if (!Number.isFinite(expTime) || expTime < nowTime) {
      // ✅ Use native MongoDB to clear OTP
      const db = User.db;
      await db.collection(User.collection.name).updateOne(
        { email: e, role: "client" },
        {
          $set: {
            clientOtp: null,
            clientOtpExpiresAt: null,
            clientOtpAttempts: 0
          }
        }
      );

      console.log("❌ OTP expired");
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // ✅ attempt limit
    if ((client.clientOtpAttempts || 0) >= 5) {
      console.log("❌ Too many attempts:", client.clientOtpAttempts);
      return NextResponse.json(
        { error: "Too many attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // ✅ compare
    console.log("🔍 OTP comparison:", {
      submitted: code,
      stored: client.clientOtp,
      match: code === String(client.clientOtp)
    });

    if (code !== String(client.clientOtp)) {
      // ✅ Increment attempts using native MongoDB
      const db = User.db;
      await db.collection(User.collection.name).updateOne(
        { email: e, role: "client" },
        {
          $inc: { clientOtpAttempts: 1 }
        }
      );
      
      console.log("❌ Invalid OTP. Attempts:", (client.clientOtpAttempts || 0) + 1);
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // ✅ success - use native MongoDB
    const db = User.db;
    await db.collection(User.collection.name).updateOne(
      { email: e, role: "client" },
      {
        $set: {
          verified: true,
          clientOtp: null,
          clientOtpExpiresAt: null,
          clientOtpAttempts: 0
        }
      }
    );

    console.log("✅ Client verified successfully:", e);

    return NextResponse.json(
      { message: "Client verified successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ OTP confirm error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}