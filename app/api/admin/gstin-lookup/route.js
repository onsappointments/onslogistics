

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import PartyDirectory from "@/models/PartyDirectory";

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const gstin = searchParams.get("gstin")?.trim().toUpperCase();

  if (!gstin || gstin.length < 15) {
    return NextResponse.json({ found: false, error: "Invalid GSTIN" }, { status: 400 });
  }

  await dbConnect();

  const party = await PartyDirectory.findOne({ gstin })
    .select("name address pan state gstin")
    .lean();

  if (!party) return NextResponse.json({ found: false });

  return NextResponse.json({
    found: true,
    name: party.name || "",
    address: party.address || "",
    gstin: party.gstin || "",
    pan: party.pan || "",
    state: party.state || "",
  });
}

// ── POST ──────────────────────────────────────────────────────────────────────
// Accepts an array of party objects or a single one.
// Called automatically on every proforma draft save.
export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const parties = Array.isArray(body) ? body : [body];

  const ops = parties.filter((p) => p?.gstin && p.gstin.length === 15);

  await Promise.allSettled(
    ops.map((p) =>
      PartyDirectory.findOneAndUpdate(
        { gstin: p.gstin.toUpperCase() },
        {
          $set: {
            gstin: p.gstin.toUpperCase(),
            name: p.name || "",
            address: p.address || "",
            pan: (p.pan || "").toUpperCase(),
            state: p.state || "",
            lastSeenAt: new Date(),
          },
        },
        { upsert: true, new: true }
      )
    )
  );

  return NextResponse.json({ ok: true, saved: ops.length });
}