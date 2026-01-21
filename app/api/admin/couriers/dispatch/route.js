import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Courier from "@/models/Courier";
import { getNextCourierSerial } from "@/lib/getNextCourierSerial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logAudit } from "@/lib/audit";

/* ===================== POST (CREATE DISPATCH) ===================== */

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.address || !body.place || !body.courierService) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const serialNo = await getNextCourierSerial("dispatch");

  const entry = await Courier.create({
    entryType: "dispatch",
    serialNo,
    name: body.name,
    address: body.address,
    place: body.place,
    subject: body.subject,
    courierService: body.courierService,
    dockNo: body.dockNo,
    remarks: body.remarks,
    createdBy: session.user.id,
  });

  await logAudit({
    entityType: "Courier",
    entityId: entry._id,
    action: "COURIER_DISPATCHED",
    description: `Courier dispatched to ${body.name}`,
    performedBy: session.user,
    meta: {
      courierService: body.courierService,
      place: body.place,
    },
  });
  
}

/* ===================== GET (FETCH DISPATCH) ===================== */

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await Courier.find({ entryType: "dispatch" })
    .sort({ serialNo: -1 })
    .lean();

  return NextResponse.json(entries, { status: 200 });
}
