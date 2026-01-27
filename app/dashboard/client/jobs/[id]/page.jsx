"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ClientJobDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id; // /dashboard/client/jobs/[id]/page.jsx

  const isClient = useMemo(() => session?.user?.role === "client", [session]);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview"); // overview | documents

  // auth guard
  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !isClient) router.push("/login");
  }, [status, isClient, router]);

  // fetch job
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/client/jobs/${jobId}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("❌ Job details API error:", data);
          setJob(null);
          return;
        }

        setJob(data.job || null);
      } catch (e) {
        console.error("❌ Failed to fetch job details:", e);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [status, isClient, jobId]);

  const badgeClass = (s) =>
    s === "completed"
      ? "bg-green-100 text-green-700 border border-green-200"
      : s === "active"
      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
      : "bg-gray-100 text-gray-600 border border-gray-200";

  const docStatus = (d) => {
    if (d?.confirmed) return { label: "Confirmed", cls: "bg-green-100 text-green-700 border border-green-200" };
    if (d?.uploadedFile || d?.fileUrl)
      return { label: "Uploaded", cls: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
    return { label: "Pending", cls: "bg-gray-100 text-gray-600 border border-gray-200" };
  };

  const Segmented = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-1 flex gap-1">
      <button
        type="button"
        onClick={() => setActiveTab("overview")}
        className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
          activeTab === "overview" ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        Overview
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("documents")}
        className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
          activeTab === "documents" ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        Documents
      </button>
    </div>
  );

  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push("/dashboard/client/jobs")}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>←</span> Back to Jobs
            </button>

            <h1 className="text-4xl font-bold text-gray-900 mt-3 truncate">
              Job Details {job?.jobId ? <span className="text-gray-400">•</span> : ""}{" "}
              {job?.jobId ? <span className="text-gray-900">{job.jobId}</span> : ""}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Company: {job?.company || session?.user?.company || "-"}
              </span>

              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badgeClass(job?.status)}`}>
                {job?.status || "new"}
              </span>

              {job?.shipmentType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {job.shipmentType}
                </span>
              )}

              {job?.createdAt && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                  Created: {new Date(job.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Segmented />
          </div>
        </div>
      </section>

      {/* Body shell */}
      <section
        className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8
        shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/40"
      >
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-14">
            <div className="flex items-center gap-3 text-blue-600">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="font-semibold">Fetching job details...</span>
            </div>
          </div>
        )}

        {/* Not found */}
        {!loading && !job && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Job not found</h3>
            <p className="text-gray-600 mt-1">Either it doesn’t exist or you don’t have access.</p>
            <button
              onClick={() => router.push("/dashboard/client/jobs")}
              className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Back to Jobs
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && job && (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="BL Numbers" icon="doc">
                    <KV label="MBL" value={job.mblNumber} />
                    <KV label="HBL" value={job.hblNumber} />
                  </Card>

                  <Card title="Route" icon="pin">
                    <KV label="POL" value={job.portOfLoading} />
                    <KV label="POD" value={job.portOfDischarge} />
                    <KV label="Clearance" value={job.clearanceAt} />
                  </Card>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card title="Shipment Info" icon="ship">
                    <div className="space-y-2 text-sm">
                      <Row label="Job ID" value={job.jobId} />
                      <Row label="Job Number" value={job.jobNumber} />
                      <Row label="Shipment Type" value={job.shipmentType} />
                      <Row label="Container Type" value={job.containerType} />
                      <Row label="Packages" value={job.pkgs} />
                      <Row label="Gross Weight" value={job.grossWeight} />
                      <Row label="CBM" value={job.cbm} />
                      <Row label="Container No." value={job.containerNumber} />
                    </div>
                  </Card>

                  <Card title="Customs & References" icon="tag">
                    <div className="space-y-2 text-sm">
                      <Row label="BE Number" value={job.beNumber} />
                      <Row label="BE Date" value={job.beDate ? new Date(job.beDate).toLocaleDateString() : "-"} />
                      <Row label="Assessable Value" value={job.assessableValue} />
                      <Row label="Reference Number" value={job.referenceNumber} />
                      <Row label="GIGAM Number" value={job.gigamNumber} />
                      <Row label="GIGAM Date" value={job.gigamDate ? new Date(job.gigamDate).toLocaleDateString() : "-"} />
                      <Row label="LIGN Number" value={job.lignNumber} />
                      <Row label="LIGN Date" value={job.lignDate ? new Date(job.lignDate).toLocaleDateString() : "-"} />
                    </div>
                  </Card>
                </div>

                {/* Tracking */}
                <Card title="Tracking Timeline" icon="track">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <Field label="Shipment Type" value={job.quoteId?.shipmentType} />
                    <Field label="From" value={job.quoteId?.fromCity} />
                    <Field label="To" value={job.quoteId?.toCity} />
                    <Field label="Mode" value={job.quoteId?.modeOfShipment} />
                  </div>

                  {(job?.containers || []).length === 0 && (
                    <p className="text-sm text-gray-600">No container tracking available yet.</p>
                  )}

                  {(job?.containers || []).map((container) => (
                    <div key={container.containerNumber} className="mb-8">
                      <h4 className="text-base font-semibold mb-3">
                        Container {container.containerNumber || "—"}
                      </h4>

                      <ol className="relative border-l border-gray-300 space-y-6 pl-6">
                        {(container.events || []).length === 0 && (
                          <li className="text-sm text-gray-600">No events yet.</li>
                        )}

                        {(container.events || []).map((event, idx) => (
                          <li key={idx} className="relative">
                            <span className="absolute -left-[9px] top-1.5 w-3 h-3 bg-blue-600 rounded-full" />
                            <p className="font-semibold text-gray-900">{event.status || "—"}</p>

                            <p className="text-sm text-gray-500">
                              {event.location || "—"}
                              {event.eventDate && !isNaN(new Date(event.eventDate)) && (
                                <> • {new Date(event.eventDate).toLocaleDateString()}</>
                              )}
                            </p>

                            {event.remarks && (
                              <p className="mt-1 text-sm text-gray-600 italic">{event.remarks}</p>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Documents</h3>
                    <p className="text-sm text-gray-600 mt-1">Documents linked to this job.</p>
                  </div>
                </div>

                {Array.isArray(job.documents) && job.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {job.documents.map((d, idx) => {
                      const s = docStatus(d);
                      const url = d.fileUrl || d.uploadedFile || null;

                      return (
                        <div
                          key={`${d.name}-${idx}`}
                          className="rounded-[1.5rem] border border-gray-200 bg-white p-6 flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-7 4h8a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{d.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {d.uploadedAt ? `Uploaded: ${new Date(d.uploadedAt).toLocaleString()}` : "Not uploaded yet"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {d.confirmedAt ? `Confirmed: ${new Date(d.confirmedAt).toLocaleString()}` : "Not confirmed yet"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${s.cls}`}>
                              {s.label}
                            </span>

                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm"
                              >
                                Open
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">No file</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-14 bg-white rounded-2xl border border-gray-200">
                    <p className="font-semibold text-gray-900">No documents set</p>
                    <p className="text-sm text-gray-600 mt-1">This job doesn’t have document requirements yet.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* ---------------- UI Helpers ---------------- */

function Card({ title, children, icon = "doc" }) {
  const Icon = () => {
    if (icon === "ship") {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20h18M4 18l2-9h12l2 9M7 9V6a2 2 0 012-2h6a2 2 0 012 2v3" />
        </svg>
      );
    }
    if (icon === "pin") {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11c0 7-7 11-7 11S5 18 5 11a7 7 0 0114 0z" />
        </svg>
      );
    }
    if (icon === "track") {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (icon === "tag") {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M3 11l8.586 8.586a2 2 0 002.828 0L21 13V3H11L3 11z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-7 4h8a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="rounded-[1.5rem] bg-white p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function KV({ label, value }) {
  return (
    <p className="text-sm text-gray-900 mt-2">
      <span className="text-gray-600">{label}:</span>{" "}
      <span className="font-semibold">{value || "-"}</span>
    </p>
  );
}

function Row({ label, value }) {
  const v = value === undefined || value === null || value === "" ? "-" : value;
  return (
    <div className="flex items-center justify-between gap-6">
      <p className="text-gray-600">{label}</p>
      <p className="text-gray-900 font-medium text-right">{v}</p>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900 mt-1">{value || "—"}</p>
    </div>
  );
}
