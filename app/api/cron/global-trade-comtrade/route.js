
import { NextResponse } from "next/server";
import {
  ingestIndiaMonthlyTradeFlows,
} from "@/lib/trade-data/ingest-un-comtrade";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("[UN Comtrade] CRON_SECRET is missing.");

    return NextResponse.json(
      {
        success: false,
        message: "Ingestion is not configured.",
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
    const result = await ingestIndiaMonthlyTradeFlows({
      numberOfMonths: 12,
    });

    console.info("[UN Comtrade] Ingestion completed:", result);

    return NextResponse.json({
      success: true,
      message: "UN Comtrade India monthly trade ingestion completed.",
      ...result,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[UN Comtrade] Ingestion failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "UN Comtrade ingestion failed.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
