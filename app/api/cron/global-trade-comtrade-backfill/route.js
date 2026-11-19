import { NextResponse } from "next/server";
import {
  ingestIndiaMonthlyTradeFlows,
} from "@/lib/trade-data/ingest-un-comtrade";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function getLastCompleteMonths(numberOfMonths = 60) {
  const periods = [];
  const now = new Date();

  // Begin with the previous complete month.
  const cursor = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
  );

  for (let index = 0; index < numberOfMonths; index++) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, "0");

    periods.push(`${year}${month}`);

    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  }

  return periods.reverse();
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        message: "Historical ingestion is not configured.",
      },
      { status: 503 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  try {
    const periods = getLastCompleteMonths(60);

    console.info("[UN Comtrade Backfill] Starting:", {
      firstPeriod: periods[0],
      latestPeriod: periods[periods.length - 1],
      totalPeriods: periods.length,
    });

    const result = await ingestIndiaMonthlyTradeFlows({
      periods,
    });

    console.info("[UN Comtrade Backfill] Completed:", result);

    return NextResponse.json({
      success: true,
      message: "Five-year UN Comtrade historical backfill completed.",
      ...result,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[UN Comtrade Backfill] Failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Historical trade data backfill failed.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}