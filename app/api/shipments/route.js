import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shipment from "@/models/Shipment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


// GET Shipments
export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions); // ✅ FIXED

    if (!session) {
      return NextResponse.json([], { status: 200 }); // return empty array, not error
    }

    const { searchParams } = new URL(req.url);
    const businessName = searchParams.get("businessName");

    // Admin searching for a client
    if (session.user.role === "admin" && businessName) {
      const shipments = await Shipment.find({ businessName }).sort({ date: -1 });
      return NextResponse.json(shipments, { status: 200 });
    }

    // Client fetching their own shipments
    if (session.user.role === "client") {
      const shipments = await Shipment.find({
        businessName: session.user.businessName,
      }).sort({ date: -1 });

      return NextResponse.json(shipments, { status: 200 });
    }

    return NextResponse.json([], { status: 200 }); // always return an array
  } catch (error) {
    console.error("❌ Error fetching shipments:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST Add shipment (Admin only)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions); // ❗ FIXED

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessName, referenceId, origin, destination, status } =
      await req.json();

    if (!businessName || !referenceId || !origin || !destination) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const newShipment = await Shipment.create({
      businessName,
      referenceId,
      origin,
      destination,
      status: status || "Pending",
      date: new Date(),
    });

    return NextResponse.json(
      { success: true, shipment: newShipment },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error creating shipment:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
