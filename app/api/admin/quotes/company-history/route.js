import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const isAuthorizedAdmin =
      session?.user?.adminType === "super_admin" ||
      (session?.user?.role === "admin" &&
        session?.user?.permissions?.includes("quote:request"));

    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const gstin = searchParams.get("gstin")?.trim().toUpperCase();
    const company = searchParams.get("company")?.trim();

    if (!gstin && !company) {
      return NextResponse.json(
        {
          success: false,
          error: "GSTIN or Company is required.",
        },
        { status: 400 }
      );
    }

    const query = gstin
      ? { gstin }
      : { company };

    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      count: quotes.length,
      quotes,
    });

  } catch (error) {
    console.error("COMPANY HISTORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch company history.",
      },
      {
        status: 500,
      }
    );
  }
}