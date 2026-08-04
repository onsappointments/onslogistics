import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "@/lib/mongodb";
import CompanyGST from "@/models/CompanyGST";
import { authOptions } from "@/lib/authOptions";

const GSTIN_RE =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export async function POST(req) {
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
        {
          status: 403,
        }
      );
    }

    const body = await req.json();

    const name = body.name?.trim().replace(/\s+/g, " ");
    const gstin = body.gstin?.trim().toUpperCase();
    const state = body.state?.trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Company name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate GSTIN only if provided
    if (gstin && !GSTIN_RE.test(gstin)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid GSTIN format.",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate GST
    if (gstin) {
      const existingGST = await CompanyGST.findOne({ gstin });

      if (existingGST) {
        return NextResponse.json(
          {
            success: false,
            error: "GSTIN already exists.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // Check duplicate company name
    const existingCompany = await CompanyGST.findOne({
  name: {
    $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    $options: "i",
  },
});

    if (existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: "Company already exists.",
        },
        {
          status: 400,
        }
      );
    }

    const company = await CompanyGST.create({
      name,
      gstin: gstin || undefined,
      state: state || "",
    });

    return NextResponse.json({
      success: true,
      company,
    });

  } catch (error) {
    console.error("CREATE COMPANY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}