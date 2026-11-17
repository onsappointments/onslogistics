
import { NextResponse } from "next/server";
import {
  ingestWorldBankCommodityPrices,
} from "@/lib/trade-data/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
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
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const result = await ingestWorldBankCommodityPrices();

    console.info("[World Bank Commodity Ingestion] Completed:", result);

    return NextResponse.json({
      success: true,
      message: "World Bank commodity prices and group indices ingested successfully.",
      ...result,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[World Bank Commodity Ingestion] Failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "World Bank commodity ingestion failed.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
