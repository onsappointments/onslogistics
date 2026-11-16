
import { NextResponse } from "next/server";
import { ingestGlobalTradeNews } from "@/lib/news/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 25;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;

  // Never allow ingestion if the secret is missing.
  if (!secret) {
    console.error("[Trade News] CRON_SECRET is missing.");

    return NextResponse.json(
      { success: false, message: "Ingestion is not configured." },
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
    const result = await ingestGlobalTradeNews();

    console.info("[Trade News] Ingestion completed:", result);

    return NextResponse.json({
      success: true,
      message: "Global Trade Intelligence ingestion completed.",
      ...result,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Trade News] Ingestion failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "News ingestion failed.",
      },
      { status: 500 }
    );
  }
}
