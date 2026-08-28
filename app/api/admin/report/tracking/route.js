import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const jobNumber =
      searchParams.get("jobNumber")?.trim();

    if (!jobNumber) {
      return NextResponse.json(
        {
          error: "Job number is required",
        },
        {
          status: 400,
        }
      );
    }

    const job = await Job.findOne({
  $or: [
    { jobNumber },
    { jobId: jobNumber },
  ],
})
  .populate({
    path: "quoteId",
    model: Quote,
  })
  .populate({
    path: "technicalQuoteId",
    model: TechnicalQuote,
  })
  .lean();

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(
      "Report tracking lookup error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load tracking information",
      },
      {
        status: 500,
      }
    );
  }
}