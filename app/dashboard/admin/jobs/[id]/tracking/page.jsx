import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import TrackingAdminClient from "./tracking-admin-client";
import { notFound } from "next/navigation";

export default async function JobTrackingAdminPage({ params }) {
  const { id } = await params;

  await connectDB();

  const job = await Job.findById(id)
    .populate("quoteId")
    .lean();

  if (!job) notFound();

  // Resolve client email — quoteId is already populated, no extra query needed
  const populatedQuote = job.quoteId;
  const emailIdForShipmentUpdates =
    populatedQuote?.email || populatedQuote?.clientEmail || null;

  if (!emailIdForShipmentUpdates) {
    console.warn(`No client email found for job ${id}.`);
  }

  const plainJob = JSON.parse(JSON.stringify(job));
  const quote    = plainJob.quoteId;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <RouteHeader job={plainJob} quote={quote} />
      <TrackingAdminClient
        job={plainJob}
        defaultEmail={emailIdForShipmentUpdates}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Route header
───────────────────────────────────────────── */

function RouteHeader({ job, quote }) {
  const shipmentType = job.shipmentType || quote?.shipmentType;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Shipment & Container Tracking</h1>
          <p className="text-sm text-gray-500 mt-1 mb-4">Job {job.jobId}</p>
        </div>

        {shipmentType && (
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide ${
              shipmentType === "export"
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {shipmentType}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Shipment Type</p>
          <p className="font-medium capitalize">{shipmentType || "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">From</p>
          <p className="font-medium">{quote?.fromCity || "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">To</p>
          <p className="font-medium">{quote?.toCity || "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">Mode</p>
          <p className="font-medium">{quote?.modeOfShipment || "—"}</p>
        </div>
      </div>
    </div>
  );
}