import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import Job from "@/models/Job";
import generateJobId from "@/lib/generateJobId";
import { logAudit } from "@/lib/audit";


export async function POST(req) {
  await connectDB();

  const { technicalQuoteId } = await req.json();

  const technicalQuote = await TechnicalQuote.findById(technicalQuoteId)
    .populate("clientQuoteId");

  if (!technicalQuote) {
    return Response.json({ error: "Technical quote not found" }, { status: 404 });
  }

  if (technicalQuote.status !== "client_approved") {
    return Response.json(
      { error: "Quote must be client approved before creating job" },
      { status: 400 }
    );
  }

  const quote = technicalQuote.clientQuoteId;

  // 🔐 Prevent duplicate jobs
  const existingJob = await Job.findOne({ quoteId: quote._id });
  if (existingJob) {
    return Response.json(
      { error: "Job already exists for this quote" },
      { status: 400 }
    );
  }

  /* ---------------- DOCUMENTS ---------------- */

  const IM_DOCUMENTS = [
    "MBL Copy",
    "HBL Copy",
    "Invoice",
    "Packing List",
    "Insurance Copy",
    "KYC",
  ];

  const EX_DOCUMENTS = [
    "Shipping Bill",
    "Invoice",
    "Packing List",
    "Insurance",
    "DRC / Duty DrawBack Docs",
    "Certificate of Origin",
  ];

  const documentList =
    quote.shipmentType === "import" ? IM_DOCUMENTS : EX_DOCUMENTS;

  const documents = documentList.map((doc) => ({
    name: doc,
    fileUrl: null,
    confirmed: false,
  }));

  /* ---------------- STAGES ---------------- */

  const stages = [
    { number: 1, name: "New Job", completed: true, completedAt: new Date() },
    { number: 2, name: "Documentation", completed: false },
  ];

  for (let i = 3; i <= 10; i++) {
    stages.push({ number: i, name: `Stage ${i}`, completed: false });
  }

  /* ---------------- JOB ID ---------------- */

  const jobId = await generateJobId(quote);

  /* ---------------- CREATE JOB ---------------- */

  const job = await Job.create({
    jobId,
    quoteId: quote._id,

    company: quote.company || "",
    shipmentType: quote.shipmentType,

    containerType: quote.containerType || null,
    commodity: quote.natureOfGoods || null,

    status: "new",
    stage: "Documentation",
    stages,
    documents,
    currentStage: 2,
  });
  
  /* ---------------- AUDIT LOG ---------------- */
  await logAudit({
    entityType: "job",
    entityId: job._id,
    action: "job_created_from_quote",
    description: "Job created from client-approved technical quote",
    performedBy: "system", // or admin user later
    meta: {
      jobId: job.jobId,
      quoteId: quote._id,
      technicalQuoteId: technicalQuote._id,
      shipmentType: quote.shipmentType,
      company: quote.company,
    },
  });

  return Response.json({
    success: true,
    message: "Job created from approved quote",
    job,
  });
}
