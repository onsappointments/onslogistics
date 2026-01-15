import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import getDocumentsForType from "@/lib/getDocumentsForType";
import { logAudit } from "@/lib/audit";


export async function POST(req) {
  await connectDB();

  const { id } = await req.json();

  const job = await Job.findById(id);
  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });

  // Fetch shipmentType from the linked Quote
  const quote = await Quote.findById(job.quoteId);
  if (!quote) return Response.json({ error: "Quote not found" }, { status: 404 });

  const shipmentType = quote.shipmentType;   // import / export / courier

  // Build stage list
  const stages = [
    { number: 1, name: "New Job", completed: true, completedAt: new Date() },
    { number: 2, name: "Documentation", completed: false },
  ];

  for (let i = 3; i <= 10; i++) {
    stages.push({
      number: i,
      name: `Stage ${i}`,
      completed: false,
    });
  }

  // Determine required documents based on shipmentType
  const docNames = getDocumentsForType(shipmentType);
  const documents = docNames.map((name) => ({
    name,
    fileUrl: null,
    confirmed: false,
    isCompleted: false,
    completedAt: null,
  }));

  // Update job
  job.status = "active";
  job.jobType = shipmentType;     // <-- important
  job.documents = documents;
  job.stages = stages;
  job.currentStage = 2;

  await job.save();
  
  /* ---------------- AUDIT LOG ---------------- */
  await logAudit({
    entityType: "job",
    entityId: job._id,
    action: "job_initiated",
    description: "Job initiated and moved to active status",
    performedBy: "admin", // later replace with req.user._id
    meta: {
      jobId: job.jobId,
      shipmentType,
      previousStatus: "new",
      newStatus: "active",
      currentStage: job.currentStage,
      documentsRequired: documents.map(d => d.name),
    },
  });

  return Response.json({ success: true, job });
}
