import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import "@/models/Quote"; // ✅ ensures Quote is registered for populate
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Job id is required" }, { status: 400 });
    }

    const job = await Job.findById(id)
      .select(
        [
          "_id",
          "jobId",
          "quoteId",
          "jobNumber",
          "mblNumber",
          "mblDate",
          "hblNumber",
          "hblDate",
          "portOfLoading",
          "portOfDischarge",
          "clearanceAt",
          "consignee",
          "shipper",
          "company",
          "customerName",
          "pkgs",
          "grossWeight",
          "cbm",
          "beNumber",
          "beDate",
          "assessableValue",
          "referenceNumber",
          "gigamNumber",
          "gigamDate",
          "lignNumber",
          "lignDate",
          "containerNumber",
          "containerType",
          "containers",
          "status",
          "source",
          "technicalQuoteId",
          "clientUser",
          "stage",
          "stages",
          "currentStage",
          "documents",
          "createdAt",
          "updatedAt",
        ].join(" ")
      )
      .populate({
        path: "quoteId",
        select:
          "shipmentType fromCity toCity modeOfShipment company firstName lastName referenceNo status createdAt",
        strictPopulate: false,
      })
      .lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.clientUser || String(job.clientUser) !== String(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, job }, { status: 200 });
  } catch (error) {
    console.error("GET /api/client/jobs/[id] error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
