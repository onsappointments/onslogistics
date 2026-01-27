import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import { initiateJob, deleteJob } from "../actions";
import JobDocumentsPanel from "../JobDocumentsPanel";
import EditJobButton from "@/Components/EditJobButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

export default async function JobDetails({ params }) {
  const id = params?.id;

  if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900">Invalid Job ID</h1>
          <p className="text-gray-600 mt-2">
            The job link is invalid. Please go back and open the job again.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/admin/jobs/active"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await connectDB();
  const job = await Job.findById(id).lean();

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
          <p className="text-gray-600 mt-2">
            This job may have been deleted or you don’t have access.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/admin/jobs/active"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const plainJob = JSON.parse(JSON.stringify(job));

  const session = await getServerSession(authOptions);
  const isSuperAdmin = session?.user?.adminType === "super_admin";

  const statusPill = (s) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize";
    if (s === "active") return `${base} bg-yellow-100 text-yellow-700 border-yellow-200`;
    if (s === "completed") return `${base} bg-green-100 text-green-700 border-green-200`;
    if (s === "new") return `${base} bg-blue-100 text-blue-700 border-blue-200`;
    return `${base} bg-gray-100 text-gray-700 border-gray-200`;
  };

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <Link
              href="/dashboard/admin/jobs/active"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Jobs
            </Link>

            <h1 className="text-4xl font-bold text-gray-900 mt-2">
              Job Details {plainJob?.jobId ? `• ${plainJob.jobId}` : ""}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={statusPill(plainJob.status)}>{plainJob.status || "—"}</span>

              {plainJob.company && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
                  {plainJob.company}
                </span>
              )}

              {plainJob.stage && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                  Stage: {plainJob.stage}
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-3">
              Review job data, update tracking, and manage required documents.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            {job.status === "new" ? (
              <EditJobButton id={plainJob._id} isNew={true} />
            ) : (
              <EditJobButton id={plainJob._id} isSuperAdmin={isSuperAdmin} />
            )}

            {plainJob.status === "new" && (
              <form action={initiateJob}>
                <input type="hidden" name="id" value={plainJob._id} />
                <button className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm">
                  <IconPlay />
                  Initiate Job
                </button>
              </form>
            )}

            {plainJob.status === "active" && (
              <Link
                href={`/dashboard/admin/jobs/${plainJob._id}/tracking`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
              >
                <IconTruck />
                Update Container Status
              </Link>
            )}

            {isSuperAdmin && (
              <form action={deleteJob}>
                <input type="hidden" name="id" value={plainJob._id} />
                <button className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-sm">
                  <IconTrash />
                  Delete Job
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/40">
          <h2 className="text-2xl font-semibold text-gray-900">Job Information</h2>
          <p className="text-sm text-gray-600 mt-1">Key shipment and customs fields for this job.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Group 1 */}
          <Group title="Basic">
            <Field label="Job ID" value={plainJob.jobId} />
            <Field label="Stage" value={plainJob.stage} />
            <Field label="Company" value={plainJob.company} />
            <Field label="Container No." value={plainJob.containerNumber} />
          </Group>

          {/* Group 2 */}
          <Group title="BL Numbers">
            <Field label="MBL Number" value={plainJob.mblNumber} />
            <Field label="MBL Date" value={formatDate(plainJob.mblDate)} />
            <Field label="HBL Number" value={plainJob.hblNumber} />
            <Field label="HBL Date" value={formatDate(plainJob.hblDate)} />
          </Group>

          {/* Group 3 */}
          <Group title="Route & Parties">
            <Field label="Port of Loading" value={plainJob.portOfLoading} />
            <Field label="Port of Discharge" value={plainJob.portOfDischarge} />
            <Field label="Consignee" value={plainJob.consignee} />
            <Field label="Shipper" value={plainJob.shipper} />
          </Group>

          {/* Group 4 */}
          <Group title="Cargo">
            <Field label="Packages" value={plainJob.pkgs} />
            <Field label="Gross Weight" value={plainJob.grossWeight} />
            <Field label="CBM" value={plainJob.cbm} />
          </Group>

          {/* Group 5 */}
          <Group title="Customs & References">
            <Field label="BE Number" value={plainJob.beNumber} />
            <Field label="BE Date" value={formatDate(plainJob.beDate)} />
            <Field label="Assessable Value" value={plainJob.assessableValue} />
            <Field label="Reference Number" value={plainJob.referenceNumber} />
          </Group>
        </div>
      </section>

      {/* Documents */}
      {plainJob.status === "active" && (
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900">Required Documents</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload, review, and confirm job-linked documents.
            </p>
          </div>

          <div className="p-8">
            <JobDocumentsPanel job={plainJob} />
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Group({ title, children }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  const v = value === undefined || value === null || value === "" ? "—" : value;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1 break-words">{v}</p>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString();
}

/* ---------- Icons (no deps) ---------- */

function IconPlay() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.759A1 1 0 007 8.277v7.446a1 1 0 001.234.97l6.518-1.88a1 1 0 00.0-1.645z" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 104 0M17 17a2 2 0 104 0M3 16V6a1 1 0 011-1h11a1 1 0 011 1v10M15 10h4l2 3v3h-6" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h6a1 1 0 011 1v2" />
    </svg>
  );
}
