import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import QuoteOtp from "@/models/QuoteOtp";
import sendClientOTP from "@/lib/sendClientOTP";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    console.log("INIT: Received data keys:", Object.keys(data));

    // REQUIRED FIELDS
    const requiredFields = [
      "fromCountry",
      "toCountry",
      "fromCity",
      "toCity",
      "item",
      "modeOfTransport",
      "shipmentType",
      "firstName",
      "company",
      "email",
      "phoneCountryCode",
      "phone",
      "containerType", // ADD THIS - it's required!
    ];

    const missing = requiredFields.filter(
      (f) => !data[f] || data[f].toString().trim() === ""
    );

    if (missing.length > 0) {
      console.log("INIT: Missing fields:", missing);
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Delete older OTP attempts for this email
    await QuoteOtp.deleteMany({ email: data.email });
    console.log("INIT: Deleted old OTP records for:", data.email);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("INIT: Generated OTP:", otp);

    // Hash OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Save OTP + FULL FORM DATA!
    const otpRecord = await QuoteOtp.create({
      email: data.email,
      otpHash,
      quoteData: data,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });

    console.log("INIT: OTP Record created with ID:", otpRecord._id);
    console.log("INIT: quoteData saved (sample):", {
      email: otpRecord.quoteData?.email,
      phone: otpRecord.quoteData?.phone,
      fromCity: otpRecord.quoteData?.fromCity,
      hasAllData: !!otpRecord.quoteData
    });

    // Send OTP email
    await sendClientOTP({
      to: data.email,
      otp,
    });

    console.log("INIT: OTP email sent to:", data.email);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
      otpId: otpRecord._id,
    });

  } catch (error) {
    console.error("INIT: Error:", error);
    console.error("INIT: Error message:", error.message);
    return NextResponse.json(
      { success: false, error: "Server error during OTP init" },
      { status: 500 }
    );
  }
}