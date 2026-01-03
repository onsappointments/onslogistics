export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.countrystatecity.in/v1/${endpoint}`,
    {
      headers: {
        "X-CSCAPI-KEY": process.env.STATE_API_KEY, // 🔒 server-only
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
