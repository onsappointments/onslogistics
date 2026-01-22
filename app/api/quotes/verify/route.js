import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import QuoteOtp from "@/models/QuoteOtp";
import User from "@/models/User"; // ✅ ADD

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("VERIFY: Received body:", body);

    const { quoteId, otp } = body;

    if (!quoteId || !otp) {
      console.log("VERIFY: Missing quoteId or OTP");
      return NextResponse.json(
        { error: "quoteId and OTP required" },
        { status: 400 }
      );
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    console.log("VERIFY: Looking for OTP record with ID:", quoteId);

    const otpRecord = await QuoteOtp.findOne({
      _id: quoteId,
      otpHash,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      console.log("VERIFY: OTP record not found or invalid");
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    console.log("VERIFY: OTP Record found!");
    console.log("VERIFY: quoteData exists?", !!otpRecord.quoteData);
    console.log(
      "VERIFY: quoteData keys:",
      otpRecord.quoteData ? Object.keys(otpRecord.quoteData) : "NULL"
    );

    // Mark OTP used
    otpRecord.verified = true;
    await otpRecord.save();
    console.log("VERIFY: OTP marked as verified");

    // ✅ ADD: Link quote to client if email belongs to a registered user
    // (only if clientUser not already present from init)
    let linkedClientUser = otpRecord.quoteData?.clientUser;

    if (!linkedClientUser && otpRecord.quoteData?.email) {
      try {
        const existingUser = await User.findOne({ email: otpRecord.quoteData.email })
          .select("_id")
          .lean();

        if (existingUser?._id) {
          linkedClientUser = existingUser._id;
          console.log("VERIFY: Linked clientUser:", existingUser._id.toString());
        } else {
          console.log("VERIFY: No user found for email, keeping as lead");
        }
      } catch (e) {
        console.log("VERIFY: client linking skipped due to error:", e?.message);
      }
    }

    // Use the quoteData directly from the OTP record
    const quoteDataToSave = {
      ...otpRecord.quoteData,
      ...(linkedClientUser ? { clientUser: linkedClientUser } : {}), // ✅ ADD
      status: "pending",
      verifiedEmail: true,
      createdAt: new Date(),
    };

    console.log(
      "VERIFY: Creating Quote with fields:",
      Object.keys(quoteDataToSave)
    );

    // Create final Quote
    const finalQuote = await Quote.create(quoteDataToSave);

    console.log("VERIFY: Quote created successfully with ID:", finalQuote._id);

    // Remove OTP record
    await QuoteOtp.deleteOne({ _id: quoteId });
    console.log("VERIFY: OTP record deleted");

    return NextResponse.json({
      success: true,
      message: "OTP verified. Quote created successfully.",
      quoteId: finalQuote._id,
    });
  } catch (error) {
    console.error("VERIFY: OTP verification error:", error);
    console.error("VERIFY: Error details:", error.message);
    if (error.errors) {
      console.error(
        "VERIFY: Validation errors:",
        JSON.stringify(error.errors, null, 2)
      );
    }

    return NextResponse.json(
      { error: "Server error during OTP verification", details: error.message },
      { status: 500 }
    );
  }
}
