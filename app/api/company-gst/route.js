import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import CompanyGST from "@/models/CompanyGST";

export async function GET() {
  try {
    await connectDB();

    const companies = await CompanyGST.find({
      isActive: true,
    })
      .sort({ name: 1 })
      .select("-_id name gstin state")
      .lean();

    return NextResponse.json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("CompanyGST API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch companies",
      },
      {
        status: 500,
      }
    );
  }
}