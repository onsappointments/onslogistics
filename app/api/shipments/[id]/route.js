import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Shipment from "@/models/Shipment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(request, context) {
  console.log("📦 PATCH request received");

  const params = await context.params;  // ⬅️ THIS is the fix
  const id = params.id;

  console.log("🆔 Shipment ID:", id);

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await request.json();
  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  await connectDB();

  const updatedShipment = await Shipment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedShipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    shipment: updatedShipment,
  });
}
