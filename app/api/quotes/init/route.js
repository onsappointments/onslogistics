import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import QuoteOtp from "@/models/QuoteOtp";
import sendClientOTP from "@/lib/sendClientOTP";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const data = await req.json();
    console.log("GSTIN received:", data.gstin); // ← add this
    console.log("Company received:", data.company);
    console.log("INIT: Received data keys:", Object.keys(data));

    // ── REQUIRED FIELDS ──────────────────────────────────────────
    const requiredFields = [
      "fromCountry", "toCountry", "fromCity", "toCity",
      "item", "modeOfTransport", "company", "email",
    ];

    const missing = requiredFields.filter(
      (f) => !data[f] || data[f].toString().trim() === ""
    );

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // ── GSTIN RESOLUTION ─────────────────────────────────────────
    // If GSTIN provided: validate format, then check if it already
    // exists in DB. If it does, auto-correct the company name.
    // If the submitted name is wrong, return an error so the client
    // knows their company name doesn't match the GSTIN on record.
    const submittedGstin = data.gstin?.toUpperCase().trim();

    if (submittedGstin) {
      // 1. Format check
      if (!GSTIN_RE.test(submittedGstin)) {
        return NextResponse.json(
          { success: false, error: "Invalid GSTIN format. Please check and try again." },
          { status: 400 }
        );
      }

      // 2. Look up existing company by GSTIN
      const gstinMatch = await User.findOne({
        gstin: submittedGstin,
        role: "client",
      }).select("company").lean();

      if (gstinMatch) {
        // GSTIN already in DB — use the stored company name regardless
        // of what the user typed. This is the auto-fix.
        console.log(
          `INIT: GSTIN matched. Correcting company "${data.company}" → "${gstinMatch.company}"`
        );
        data.company = gstinMatch.company;
      }

      // Store normalized GSTIN back into data
      data.gstin = submittedGstin;
    } else {
      // No GSTIN submitted — remove the key entirely so it doesn't
      // save as an empty string (which would break the sparse unique index)
      delete data.gstin;
    }
    // ── END GSTIN RESOLUTION ──────────────────────────────────────

    // ── ADMIN FLOW ───────────────────────────────────────────────
    const isAuthorizedAdmin =
      session?.user?.role === "super_admin" ||
      (session?.user?.role === "admin" &&
        session?.user?.permissions?.includes("quote:request"));

    if (isAuthorizedAdmin) {
      console.log("INIT: Admin creating quote without OTP");

      try {
        const existingUser = await User.findOne({ email: data.email })
          .select("_id gstin company")
          .lean();

        if (existingUser?._id) {
          data.clientUser = existingUser._id;

          // If this user had no GSTIN before but now has one — save it
          if (!existingUser.gstin && data.gstin) {
            await User.updateOne(
              { _id: existingUser._id },
              { $set: { gstin: data.gstin } }
            );
            console.log("INIT: Saved GSTIN to existing user:", data.gstin);
          }
        }
      } catch (e) {
        console.log("INIT: client linking skipped:", e?.message);
      }

      const quote = await QuoteOtp.create({
        email: data.email,
        otpHash: null,
        quoteData: data,
        expiresAt: null,
        verified: true,
      });

      return NextResponse.json({ quoteId: quote._id, success: true }, { status: 200 });
    }

    // ── REGULAR CLIENT FLOW ──────────────────────────────────────
    console.log("INIT: Regular user flow - sending OTP");

    try {
      const existingUser = await User.findOne({ email: data.email })
        .select("_id gstin")
        .lean();

      if (existingUser?._id) {
        data.clientUser = existingUser._id;

        // Same — save GSTIN if not already on the user
        if (!existingUser.gstin && data.gstin) {
          await User.updateOne(
            { _id: existingUser._id },
            { $set: { gstin: data.gstin } }
          );
        }
      } else {
        console.log("INIT: No user found for email, keeping as lead");
      }
    } catch (e) {
      console.log("INIT: client linking skipped:", e?.message);
    }

    await QuoteOtp.deleteMany({ email: data.email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpRecord = await QuoteOtp.create({
      email: data.email,
      otpHash,
      quoteData: data,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });

    await sendClientOTP({ to: data.email, otp });

    console.log("INIT: OTP sent to:", data.email);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
      otpId: otpRecord._id,
    });

  } catch (error) {
    console.error("INIT: Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Server error during OTP init" },
      { status: 500 }
    );
  }
}