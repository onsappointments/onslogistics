// app/api/leads/companies/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { escapeRegex } from "@/lib/escapeRegex";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    // If empty search, return nothing (prevents dumping all companies)
    if (!q) return NextResponse.json({ companies: [] }, { status: 200 });

    // Case-insensitive partial match on company
    const companies = await Quote.aggregate([
      { $match: { company: { $regex: q , $options: "i" } } },
      { $group: { _id: "$company" } },
      { $sort: { _id: 1 } },
      { $limit: 15 },
      { $project: { _id: 0, company: "$_id" } },
    ]);

    return NextResponse.json(
      { companies: companies.map((c) => c.company) },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/leads/companies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
