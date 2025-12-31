import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import generateJobId from "@/lib/generateJobId";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      company,
      shipmentType,
      modeOfShipment,
      containerType,
      fromCity,
      toCity,
      commodity,
    } = body;

    if (!company || !shipmentType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate Job ID using existing pipeline
    const jobId = await generateJobId({
      shipmentType,
      company,
    });

    const job = await Job.create({
      jobId,

      company,
      shipmentType,
      modeOfShipment,
      containerType,
      fromCity,
      toCity,
      commodity,

      status: "new",
      source: "manual",

      stages: [
        { number: 1, name: "New Job", completed: true },
        { number: 2, name: "Documentation", completed: false },
        { number: 3, name: "Operations", completed: false },
        { number: 4, name: "Billing", completed: false },
      ],

      currentStage: 1,
    });

    return Response.json({ success: true, job });
  } catch (error) {
    console.error("MANUAL JOB CREATE ERROR:", error);
    return Response.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
