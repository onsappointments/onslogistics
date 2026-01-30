import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

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

    // ✅ Required fields
    const requiredFields = [
      "fromCountry",
      "toCountry",
      "fromCity",
      "toCity",
      "item",
      "modeOfTransport",
      "firstName",
      "company",
      "email",
      "phoneCountryCode",
      "phone",
      "containerType",
    ];

    const missing = requiredFields.filter(
      (f) => !data[f] || data[f].toString().trim() === ""
    );

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ✅ Try linking to existing user
    let clientUser = null;

    try {
      const existingUser = await User.findOne({ email: data.email })
        .select("_id")
        .lean();

      if (existingUser?._id) {
        clientUser = existingUser._id;
        console.log("ADMIN CREATE: linked clientUser:", clientUser.toString());
      }
    } catch (e) {
      console.log("ADMIN CREATE: user lookup skipped:", e?.message);
    }

    // ✅ Create Quote directly
    const quote = await Quote.create({
      ...data,
      ...(clientUser ? { clientUser } : {}),
      status: "pending",
      verifiedEmail: true,
      createdByAdmin: true,
      createdAt: new Date(),
    });

    console.log("ADMIN CREATE: Quote created:", quote._id);

    return NextResponse.json(
      {
        success: true,
        quoteId: quote._id,
        message: "Quote created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN CREATE QUOTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
