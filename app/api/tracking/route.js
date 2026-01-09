import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

/* ---------------- DETECT REF TYPE ---------------- */

function detectType(ref) {
  if (/^[A-Z]{4}\d{7}$/i.test(ref)) return "container"; // MRKU8365035
  if (/^BL/i.test(ref)) return "bl";                   // BLxxxx
  if (/^BKG/i.test(ref)) return "booking";             // BKGxxxx
  return "invoice";                                    // fallback
}

/* ---------------- GET TRACKING ---------------- */

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      return NextResponse.json(
        { error: "Missing tracking reference" },
        { status: 400 }
      );
    }

    const type = detectType(ref);

    let jobQuery = {};

    switch (type) {
      case "container":
        jobQuery = { "containers.containerNumber": ref };
        break;

      case "bl":
        jobQuery = { $or: [{ mblNumber: ref }, { hblNumber: ref }] };
        break;

      case "booking":
        jobQuery = { bookingNumber: ref };
        break;

      case "invoice":
        jobQuery = { referenceNumber: ref };
        break;
    }

    const job = await Job.findOne(jobQuery)
      .populate("quoteId")
      .lean();

    if (!job) {
      return NextResponse.json(
        { error: "No shipment found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ref,
      type,
      job: {
        jobId: job.jobId,
        status: job.status,
        ports: {
          loading: job.portOfLoading,
          discharge: job.portOfDischarge,
        },
        quote: job.quoteId
          ? {
              shipmentType: job.quoteId.shipmentType,
              fromCity: job.quoteId.fromCity,
              toCity: job.quoteId.toCity,
              modeOfShipment: job.quoteId.modeOfShipment,
            }
          : null,
        containers: job.containers || [],
      },
    });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
