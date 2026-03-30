import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getNextQuoteNumber } from "@/lib/getNextQuoteNumber";

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    // 🔐 Admin check
    const isAuthorizedAdmin =
      session?.user?.adminType === "super_admin" ||
      (session?.user?.role === "admin" &&
        session?.user?.permissions?.includes("quote:request"));

    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const data = await req.json();
    console.log("ADMIN CREATE QUOTE: received keys:", Object.keys(data));

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
        { success: false, error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // ── GSTIN RESOLUTION ─────────────────────────────────────────
    const submittedGstin = data.gstin?.toUpperCase().trim();

    if (submittedGstin) {
      // 1. Format check
      if (!GSTIN_RE.test(submittedGstin)) {
        return NextResponse.json(
          { success: false, error: "Invalid GSTIN format." },
          { status: 400 }
        );
      }

      // 2. Check Job collection first — this is where company names live
      const existingJob = await Job.findOne({ gstin: submittedGstin })
        .select("company").lean();

      if (existingJob) {
        // GSTIN found in Jobs — auto-correct company name
        console.log(`ADMIN CREATE: GSTIN matched in Jobs. Correcting "${data.company}" → "${existingJob.company}"`);
        data.company = existingJob.company;
      } else {
        // 3. Fallback — check User collection
        const existingUser = await User.findOne({ gstin: submittedGstin, role: "client" })
          .select("company").lean();

        if (existingUser) {
          console.log(`ADMIN CREATE: GSTIN matched in Users. Correcting "${data.company}" → "${existingUser.company}"`);
          data.company = existingUser.company;
        }
        // else: brand new GSTIN — use whatever company name was submitted
      }

      data.gstin = submittedGstin;
    } else {
      delete data.gstin;
    }
    // ── END GSTIN RESOLUTION ──────────────────────────────────────

    // ── LINK TO EXISTING USER ─────────────────────────────────────
    let clientUser = null;

    try {
      const existingUser = await User.findOne({ email: data.email })
        .select("_id gstin company").lean();

      if (existingUser?._id) {
        clientUser = existingUser._id;
        console.log("ADMIN CREATE: linked clientUser:", clientUser.toString());

        // Save GSTIN to User if they don't have one yet
        if (submittedGstin && !existingUser.gstin) {
          await User.updateOne(
            { _id: existingUser._id },
            { $set: { gstin: submittedGstin, company: data.company } }
          );
          console.log("ADMIN CREATE: GSTIN saved to user:", submittedGstin);
        }
      }
    } catch (e) {
      console.log("ADMIN CREATE: user lookup skipped:", e?.message);
    }
    // ── END USER LINK ─────────────────────────────────────────────

    // ── QUOTE NUMBER ──────────────────────────────────────────────
    const { modeOfTransport, shipmentType } = data;

    if (!modeOfTransport || !shipmentType || shipmentType === "Not set") {
      return NextResponse.json(
        {
          success: false,
          error: "modeOfTransport and shipmentType are required",
        },
        { status: 400 }
      );
    }

    const quoteNo = await getNextQuoteNumber({
      mode: modeOfTransport,
      trade: shipmentType,
    });

    // ── CREATE QUOTE ──────────────────────────────────────────────
    const quote = await Quote.create({
      quoteNo,
      ...data,
      ...(clientUser ? { clientUser } : {}),
      status: "pending",
      verifiedEmail: true,
      createdByAdmin: true,
      createdAt: new Date(),
    });

    console.log("ADMIN CREATE: Quote created:", quote._id);

    return NextResponse.json(
      { success: true, quoteId: quote._id, message: "Quote created successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("ADMIN CREATE QUOTE ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}