import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import { initiateJob, deleteJob, completeJob } from "../actions";
import JobDocumentsPanel from "../JobDocumentsPanel";
import EditJobButton from "@/Components/EditJobButton";
import CompleteJobButton from "@/Components/CompleteJobButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

export default async function JobDetails({ params }) {
  const { id } = await params;

  if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900">Invalid Job ID</h1>
          <p className="text-gray-600 mt-2">
            The job link is invalid. Please go back and open the job again.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/admin/jobs/active" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
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
          <p className="text-gray-600 mt-2">This job may have been deleted or you don't have access.</p>
          <div className="mt-6">
            <Link href="/dashboard/admin/jobs/active" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
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
  const isCompleted = plainJob.status === "completed";

  const statusPill = (s) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize";
    if (s === "active") return `${base} bg-yellow-100 text-yellow-700 border-yellow-200`;
    if (s === "completed") return `${base} bg-green-100 text-green-700 border-green-200`;
    if (s === "new") return `${base} bg-blue-100 text-blue-700 border-blue-200`;
    return `${base} bg-gray-100 text-gray-700 border-gray-200`;
  };

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">
      {/* Completed Banner */}
      {isCompleted && (
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <IconCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-green-800 font-semibold text-sm">Job Completed</p>
            <p className="text-green-700 text-xs mt-0.5">
              This job has been marked as completed. No further edits or status changes are allowed.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <section className={`bg-white rounded-2xl shadow-sm border p-8 ${isCompleted ? "border-green-100" : "border-blue-100"}`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <Link href="/dashboard/admin/jobs/active" className="text-blue-600 hover:text-blue-700 font-semibold">
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
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
                  <IconCheckCircle className="w-3 h-3" /> Read-only
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-3">
              {isCompleted
                ? "This job is completed. All data is read-only."
                : "Review job data, update tracking, and manage required documents."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">

            {/* ── GENERATE INVOICE BUTTON — always visible ── */}
            <Link
              href={`/dashboard/admin/jobs/${plainJob._id}/invoice`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-700 text-white font-semibold hover:bg-rose-800 transition shadow-sm"
            >
              <IconInvoice />
              Generate Invoice
            </Link>

            {/* Rest of actions — hidden when completed */}
            {!isCompleted && (
              <>
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
                  <>
                    <Link
                      href={`/dashboard/admin/jobs/${plainJob._id}/tracking`}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
                    >
                      <IconTruck />
                      Update Container Status
                    </Link>
                    <CompleteJobButton jobId={plainJob._id} jobIdLabel={plainJob.jobId} />
                  </>
                )}

                {isSuperAdmin && plainJob.status !== "completed" && (
                  <form action={deleteJob}>
                    <input type="hidden" name="id" value={plainJob._id} />
                    <button className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-sm">
                      <IconTrash />
                      Delete Job
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className={`backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border overflow-hidden ${isCompleted ? "bg-green-50/30 border-green-100/60" : "bg-white/70 border-white/40"}`}>
        <div className={`px-8 py-6 border-b ${isCompleted ? "border-green-100/60" : "border-white/40"}`}>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-900">Job Information</h2>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                <IconLock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">Key shipment and customs fields for this job.</p>
        </div>

        <div className="p-8 space-y-8">
          <Group title="Basic">
            <Field label="Job ID" value={plainJob.jobId} />
            <Field label="Stage" value={plainJob.stage} />
            <Field label="Company" value={plainJob.company} />
            <Field label="Container No." value={plainJob.containerNumber} />
          </Group>
          <Group title="BL Numbers">
            <Field label="MBL Number" value={plainJob.mblNumber} />
            <Field label="MBL Date" value={formatDate(plainJob.mblDate)} />
            <Field label="HBL Number" value={plainJob.hblNumber} />
            <Field label="HBL Date" value={formatDate(plainJob.hblDate)} />
          </Group>
          <Group title="AWB Numbers">
            <Field label="AWB Number" value={plainJob.awbNumber} />
            <Field label="AWB Date" value={formatDate(plainJob.awbDate)} />
          </Group>
          <Group title="Route & Parties">
            <Field label="Port of Loading" value={plainJob.portOfLoading} />
            <Field label="Port of Discharge" value={plainJob.portOfDischarge} />
            <Field label="Consignee" value={plainJob.consignee} />
            <Field label="Shipper" value={plainJob.shipper} />
          </Group>
          <Group title="Cargo">
            <Field label="Packages" value={plainJob.pkgs} />
            <Field label="Gross Weight" value={plainJob.grossWeight} />
            <Field label="CBM" value={plainJob.cbm} />
          </Group>
          <Group title="Customs & References">
            <Field label="BE Number" value={plainJob.beNumber} />
            <Field label="BE Date" value={formatDate(plainJob.beDate)} />
            <Field label="SB Number" value={plainJob.sbNumber} />
            <Field label="SB Date" value={formatDate(plainJob.sbDate)} />
            <Field label="Assessable Value" value={plainJob.assessableValue} />
            <Field label="Reference Number" value={plainJob.referenceNumber} />
          </Group>
        </div>
      </section>

      {/* Documents — active jobs */}
      {plainJob.status === "active" && (
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900">Required Documents</h2>
            <p className="text-sm text-gray-600 mt-1">Upload, review, and confirm job-linked documents.</p>
          </div>
          <div className="p-8">
            <JobDocumentsPanel job={plainJob} />
          </div>
        </section>
      )}

      {/* Documents — completed read-only */}
      {isCompleted && plainJob.documents?.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                <IconLock className="w-3 h-3" /> Read-only
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Documents submitted for this completed job.</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plainJob.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <IconDocument className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.name || "Untitled"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.confirmed ? "Confirmed" : doc.fileUrl ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 underline">
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
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

/* ---------- Icons ---------- */
function IconInvoice() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
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
function IconCheckCircle({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconLock({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
function IconDocument({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}