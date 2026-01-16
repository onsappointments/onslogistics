import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import Job from "@/models/Job";
import generateJobId from "@/lib/generateJobId";

export async function GET(req, { params }) {
  await connectDB();

  const id = params.id; // <-- URL PARAM, NOT JSON BODY

  // Documents for Import/Export
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

  // 1. Approve quote
  const quote = await Quote.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true }
  );

  if (!quote) {
    return Response.json({ error: "Quote not found" }, { status: 404 });
  }

  // 2. Create job ID
  const jobId = await generateJobId(quote);

  // 3. Determine required documents
  let documentList = [];
  if (quote.shipmentType === "import") documentList = IM_DOCUMENTS;
  else if (quote.shipmentType === "export") documentList = EX_DOCUMENTS;

  const formattedDocs = documentList.map((doc) => ({
    name: doc,
    fileUrl: null,
    confirmed: false,
  }));

  // 4. Build stages array
  const stages = [
    { number: 1, name: "New Job", completed: true, completedAt: new Date() },
    { number: 2, name: "Documentation", completed: false },
  ];

  for (let i = 3; i <= 10; i++) {
    stages.push({ number: i, name: `Stage ${i}`, completed: false });
  }

  // 5. Create the Job
  const job = await Job.create({
    jobId,
    quoteId: quote._id,
    company: quote.company || "",
    containerType: quote.containerType || null,
    commodity: quote.natureOfGoods || null,
    status: "new",
    stage: "Documentation",
    stages,
    documents: formattedDocs,
    currentStage: 2,
  });

  return Response.json({
    success: true,
    message: "Quote approved → Job created",
    quote,
    job,
  });
}
