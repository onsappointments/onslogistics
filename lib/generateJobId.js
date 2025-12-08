import Job from "@/models/Job";

export default async function generateJobId(quote) {
  // Transport mode → SEA / AIR / COU
  const modeMap = {
    Sea: "SEA",
    Air: "AIR",
    Road: "ROAD",
    Courier: "COU",
  };

  // Shipment type decides IM / EX
  const typeMap = {
    import: "IM",
    export: "EX",
    courier: "IM", // Courier usually behaves like import unless specified
  };

  // Mode (transport)
  let mode = modeMap[quote.modeOfTransport] || "SEA";

  // For courier jobs, force mode to COU
  if (quote.shipmentType === "courier") {
    mode = "COU";
  }

  // Type (import/export)
  const type = typeMap[quote.shipmentType] || "IM";

  // Year
  const year = new Date().getFullYear().toString().slice(-2);

  // Find last job for same MODE-TYPE-YEAR
  const prefix = `${mode}-${type}-${year}`;

  const lastJob = await Job.findOne({
    jobId: { $regex: `^${prefix}-` }
  }).sort({ jobId: -1 });  // sort by jobId instead of createdAt

  let serial = 1;

  if (lastJob) {
    serial = parseInt(lastJob.jobId.split("-")[3]) + 1;
  }

  const padded = String(serial).padStart(5, "0");

  return `${mode}-${type}-${year}-${padded}`;
}
