import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import { initiateJob, deleteJob } from "../actions";
import JobDocumentsPanel from "../JobDocumentsPanel"; // FIXED PATH
import AuditTimeline from "@/Components/AuditTimeline";
import AuditTimelineWrapper from "@/Components/AuditTimelineWrapper";


export default async function JobDetails({ params }) {
  const { id } = await params;

  await connectDB();
  const job = await Job.findById(id).lean();

  if (!job) return <div className="p-10">Job not found.</div>;

  // Convert ObjectId → string & dates → string
  const plainJob = JSON.parse(JSON.stringify(job));

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Job Details</h1>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-6">
        <Link
          href={`/dashboard/admin/jobs/${plainJob._id}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Edit Job
        </Link>

        {/* Only NEW jobs show Initiate button */}
        {plainJob.status === "new" && (
          <form action={initiateJob}>
            <input type="hidden" name="id" value={plainJob._id} />
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
              Initiate Job
            </button>
          </form>
        )}

        <form action={deleteJob}>
          <input type="hidden" name="id" value={plainJob._id} />
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Delete Job
          </button>
        </form>

        {plainJob.status === "active" && (
       <Link
        href={`/dashboard/admin/jobs/${plainJob._id}/tracking`}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
       >
        Update Container Status
       </Link>
       )}
      </div>
      {/* QUOTE ACTIONS */}
<div className="flex gap-4 mb-6">
  {plainJob.quoteId && (
    <Link
      href={`/dashboard/admin/quotes/${plainJob.quoteId}`}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      View Finalized Quote
    </Link>
  )}

  {/*{plainJob.quoteId && !plainJob.technicalQuoteId && (
    <Link
      href={`/dashboard/admin/technical-quotes/new?quoteId=${plainJob.quoteId}`}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Add Technical Quote
    </Link>
  )}

  /*{plainJob.technicalQuoteId && (
    <Link
      href={`/dashboard/admin/technical-quotes/${plainJob.technicalQuoteId}`}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg"
    >
      View Technical Quote
    </Link>
  )}*/}
</div>
  
      {/* JOB FIELDS */}
      <div className="bg-white shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Job ID" value={plainJob.jobId} />
        <Field label="Stage" value={plainJob.stage} />

        <Field label="MBL Number" value={plainJob.mblNumber} />
        <Field label="MBL Date" value={formatDate(plainJob.mblDate)} />

        <Field label="HBL Number" value={plainJob.hblNumber} />
        <Field label="HBL Date" value={formatDate(plainJob.hblDate)} />

        <Field label="Port of Loading" value={plainJob.portOfLoading} />
        <Field label="Port of Discharge" value={plainJob.portOfDischarge} />

        <Field label="Consignee" value={plainJob.consignee} />
        <Field label="Shipper" value={plainJob.shipper} />

        <Field label="Packages" value={plainJob.pkgs} />
        <Field label="Gross Weight" value={plainJob.grossWeight} />
        <Field label="CBM" value={plainJob.cbm} />

        <Field label="BE Number" value={plainJob.beNumber} />
        <Field label="BE Date" value={formatDate(plainJob.beDate)} />

        <Field label="Assessable Value" value={plainJob.assessableValue} />
        <Field label="Reference Number" value={plainJob.referenceNumber} />
      </div>

      {/* DOCUMENTS & STAGES — ONLY WHEN ACTIVE */}
      {plainJob.status === "active" && (
        <section className="bg-white p-6 shadow rounded-xl mt-6">
          <h2 className="text-xl font-semibold mb-4">Required Documents</h2>

          <JobDocumentsPanel job={plainJob} />
        </section>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <p className="text-gray-700">
      <span className="font-medium">{label}: </span>
      {value ?? "—"}
    </p>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}
