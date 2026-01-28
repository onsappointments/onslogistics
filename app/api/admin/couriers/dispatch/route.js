import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Courier from "@/models/Courier";
import { getNextCourierSerial } from "@/lib/getNextCourierSerial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logAudit } from "@/lib/audit";

/* ===================== POST (CREATE DISPATCH) ===================== */

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
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

    return NextResponse.json(entry, { status: 201 });

  } catch (err) {
    console.error("DISPATCH POST ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ===================== GET (FETCH DISPATCH) ===================== */

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await Courier.find({ entryType: "dispatch" })
    .sort({ serialNo: 1 }) // ascending for register view
    .lean();

  return NextResponse.json(entries, { status: 200 });
}

/* ===================== PUT (EDIT DISPATCH) ===================== */

export async function PUT(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body._id) {
      return NextResponse.json(
        { error: "Courier ID is required" },
        { status: 400 }
      );
    }

    const updated = await Courier.findByIdAndUpdate(
      body._id,
      {
        name: body.name,
        address: body.address,
        place: body.place,
        subject: body.subject,
        courierService: body.courierService,
        dockNo: body.dockNo,
        remarks: body.remarks,
      },
      { new: true }
    );

    await logAudit({
      entityType: "Courier",
      entityId: body._id,
      action: "COURIER_DISPATCH_UPDATED",
      description: `Courier dispatch updated for ${body.name}`,
      performedBy: session.user,
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    console.error("DISPATCH PUT ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ===================== DELETE (DELETE DISPATCH) ===================== */

export async function DELETE(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Courier ID is required" },
        { status: 400 }
      );
    }

    await Courier.findByIdAndDelete(id);

    await logAudit({
      entityType: "Courier",
      entityId: id,
      action: "COURIER_DISPATCH_DELETED",
      description: "Courier dispatch record deleted",
      performedBy: session.user,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("DISPATCH DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
