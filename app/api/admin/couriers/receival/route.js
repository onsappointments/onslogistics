import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Courier from "@/models/Courier";
import { getNextCourierSerial } from "@/lib/getNextCourierSerial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logAudit } from "@/lib/audit";

/* ===================== POST (CREATE RECEIVAL) ===================== */

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.fromWho || !body.courierService || !body.receiver) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const serialNo = await getNextCourierSerial("receival");

    const entry = await Courier.create({
      entryType: "receival",
      serialNo,
      letterNo: body.letterNo,
      fromWho: body.fromWho,
      subject: body.subject,
      courierService: body.courierService,
      receiver: body.receiver,
      remarks: body.remarks,
      createdBy: session.user.id,
    });

    await logAudit({
      entityType: "Courier",
      entityId: entry._id,
      action: "COURIER_RECEIVED",
      description: `Courier received from ${body.fromWho}`,
      performedBy: session.user,
      meta: {
        courierService: body.courierService,
        receiver: body.receiver,
      },
    });

    // ✅ THIS WAS MISSING
    return NextResponse.json(entry, { status: 201 });

  } catch (err) {
    console.error("RECEIVAL API ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ===================== GET (FETCH RECEIVAL) ===================== */

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await Courier.find({ entryType: "receival" })
    .sort({ serialNo: -1 })
    .lean();

  return NextResponse.json(entries, { status: 200 });
}
