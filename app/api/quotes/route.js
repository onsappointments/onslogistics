import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    if (!data.firstName || !data.email || !data.item) {
      return NextResponse.json(
        { success: false, error: "firstName, email & item are required." },
        { status: 400 }
      );
    }

    const created = await Quote.create(data);

    return NextResponse.json({ success: true, quote: created }, { status: 201 });
  } catch (error) {
    console.error("Quote POST error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
