import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import QuoteOtp from "@/models/QuoteOtp";
import sendClientOTP from "@/lib/sendClientOTP";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

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
      "company",
      "email",
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

    // Check if user is admin with quote:request permission or super_admin
    const isAuthorizedAdmin =
      session?.user?.role === "super_admin" ||
      (session?.user?.role === "admin" &&
        session?.user?.permissions?.includes("quote:request"));

    if (isAuthorizedAdmin) {
      console.log("INIT: Admin/Super Admin creating quote without OTP");

      // Link to registered client if exists
      try {
        const existingUser = await User.findOne({
          email: data.email,
        })
          .select("_id")
          .lean();

        if (existingUser?._id) {
          data.clientUser = existingUser._id;
          console.log("INIT: Linked clientUser:", existingUser._id.toString());
        }
      } catch (e) {
        console.log("INIT: client linking skipped due to error:", e?.message);
      }

      // Create quote directly without OTP
      const quote = await QuoteOtp.create({
        email: data.email,
        otpHash: null,
        quoteData: data,
        expiresAt: null,
        verified: true,
      });

      console.log("INIT: Quote created by admin, ID:", quote._id);

      return NextResponse.json(
        { quoteId: quote._id, success: true },
        { status: 200 }
      );
    }

    // Regular user flow - require OTP verification
    console.log("INIT: Regular user flow - sending OTP");

    // Auto-link to registered client (minimal change)
    try {
      const existingUser = await User.findOne({
        email: data.email,
      })
        .select("_id")
        .lean();

      if (existingUser?._id) {
        data.clientUser = existingUser._id;
        console.log("INIT: Linked clientUser:", existingUser._id.toString());
      } else {
        console.log("INIT: No user found for email, keeping as lead");
      }
    } catch (e) {
      console.log("INIT: client linking skipped due to error:", e?.message);
    }

    // Delete older OTP attempts for this email
    await QuoteOtp.deleteMany({ email: data.email });
    console.log("INIT: Deleted old OTP records for:", data.email);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("INIT: Generated OTP:", otp);

    // Hash OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Save OTP + FULL FORM DATA
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
      clientUser: otpRecord.quoteData?.clientUser || null,
      hasAllData: !!otpRecord.quoteData,
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