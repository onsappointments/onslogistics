// app/api/register/route.js (or wherever your /api/register lives)
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Quote from "@/models/Quote";
import Job from "@/models/Job";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, company, email, country, password, verifiedToken } = body;

    if (!password) {
      return new Response(
        JSON.stringify({ success: false, message: "Password is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!fullName) {
      return new Response(
        JSON.stringify({ success: false, message: "Full name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ----------------------------------------------------
    // Lead flow (OTP verified): email+company come from token
    // ----------------------------------------------------
    if (verifiedToken) {
      if (!process.env.JWT_SECRET) {
        return new Response(
          JSON.stringify({ success: false, message: "JWT_SECRET missing in env" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      let payload;
      try {
        payload = jwt.verify(verifiedToken, process.env.JWT_SECRET);
      } catch {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Verification expired or invalid. Please verify OTP again.",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      if (payload?.t !== "lead_otp_verified") {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid verification token" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const tokenEmail = (payload.email || "").trim().toLowerCase();
      const tokenCompany = (payload.company || "").trim();

      if (!tokenEmail || !tokenCompany) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid token payload" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // user already exists?
      const existingUser = await User.findOne({ email: tokenEmail }).select("_id").lean();
      if (existingUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User already exists. Please login instead.",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      // quotes must exist for this lead
      const quotes = await Quote.find({ company: tokenCompany, email: tokenEmail })
        .select("_id clientUser")
        .lean();

      if (!quotes.length) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "No quote lead found for this company/email.",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // If already linked, block
      if (quotes.some((q) => q.clientUser)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "This lead is already registered. Please login.",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName: fullName.trim(),
        company: tokenCompany,
        email: tokenEmail,
        country: (country || "").trim(),
        password: hashedPassword,
        role: "client",
        verified: true,
      });

      const quoteIds = quotes.map((q) => q._id);

      // Link Quotes -> user
      await Quote.updateMany(
        { _id: { $in: quoteIds }, clientUser: null },
        { $set: { clientUser: newUser._id, leadStatus: "converted" } }
      );

      // Link Jobs -> user (requires Job.clientUser field)
      await Job.updateMany(
        { quoteId: { $in: quoteIds }, clientUser: null },
        { $set: { clientUser: newUser._id } }
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account created successfully!",
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            country: newUser.country,
            company: newUser.company,
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }

    // ----------------------------------------------------
    // Normal flow: use company + email from request body
    // ----------------------------------------------------
    const safeEmail = (email || "").trim().toLowerCase();
    const safeCompany = (company || "").trim();

    if (!safeEmail || !safeCompany) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and company are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingUser = await User.findOne({ email: safeEmail }).select("_id").lean();
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists. Please login instead.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      company: safeCompany,
      email: safeEmail,
      country: (country || "").trim(),
      password: hashedPassword,
      role: "client",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully!",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          country: newUser.country,
          company: newUser.company,
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
