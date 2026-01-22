"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ClientJobDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id; // folder should be /dashboard/client/jobs/[id]/page.jsx

  const isClient = useMemo(() => session?.user?.role === "client", [session]);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview"); // overview | tracking | documents

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
      ? "bg-green-100 text-green-700"
      : s === "active"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-600";

  const docStatus = (d) => {
    if (d?.confirmed) return { label: "Confirmed", cls: "bg-green-100 text-green-700" };
    if (d?.uploadedFile || d?.fileUrl) return { label: "Uploaded", cls: "bg-yellow-100 text-yellow-700" };
    return { label: "Pending", cls: "bg-gray-100 text-gray-600" };
  };

  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/client/jobs")}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to Jobs
          </button>

          <h1 className="text-4xl font-semibold mt-2">
            Job Details {job?.jobId ? `• ${job.jobId}` : ""}
          </h1>

          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <span className="text-gray-600">
              Company: <span className="font-medium text-gray-900">{job?.company || session?.user?.company || "-"}</span>
            </span>

            <span className={`px-3 py-1 rounded-full text-sm ${badgeClass(job?.status)}`}>
              {job?.status || "new"}
            </span>

            {job?.shipmentType && (
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                {job.shipmentType}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2 rounded-full border transition ${
              activeTab === "overview"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`px-5 py-2 rounded-full border transition ${
              activeTab === "documents"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            Documents
          </button>
        </div>
      </section>

      {/* Body */}
      <section
        className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8
        shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/40"
      >
        {loading && <p className="text-gray-600">Fetching job details...</p>}

        {!loading && !job && (
          <p className="text-gray-600">Job not found or you don’t have access.</p>
        )}

        {!loading && job && (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="rounded-2xl bg-white p-5 border border-gray-200">
                    <p className="text-sm text-gray-600">BL Numbers</p>
                    <p className="text-sm text-gray-900 mt-2">
                      <span className="text-gray-600">MBL:</span>{" "}
                      <span className="font-medium">{job.mblNumber || "-"}</span>
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="text-gray-600">HBL:</span>{" "}
                      <span className="font-medium">{job.hblNumber || "-"}</span>
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-gray-200">
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="text-sm text-gray-900 mt-2">
                      <span className="text-gray-600">POL:</span>{" "}
                      <span className="font-medium">{job.portOfLoading || "-"}</span>
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="text-gray-600">POD:</span>{" "}
                      <span className="font-medium">{job.portOfDischarge || "-"}</span>
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="text-gray-600">Clearance:</span>{" "}
                      <span className="font-medium">{job.clearanceAt || "-"}</span>
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-white p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Shipment Info</h3>
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
                  </div>

                  <div className="rounded-2xl bg-white p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Customs & References</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="BE Number" value={job.beNumber} />
                      <Row
                        label="BE Date"
                        value={job.beDate ? new Date(job.beDate).toLocaleDateString() : "-"}
                      />
                      <Row label="Assessable Value" value={job.assessableValue} />
                      <Row label="Reference Number" value={job.referenceNumber} />
                      <Row label="GIGAM Number" value={job.gigamNumber} />
                      <Row
                        label="GIGAM Date"
                        value={job.gigamDate ? new Date(job.gigamDate).toLocaleDateString() : "-"}
                      />
                      <Row label="LIGN Number" value={job.lignNumber} />
                      <Row
                        label="LIGN Date"
                        value={job.lignDate ? new Date(job.lignDate).toLocaleDateString() : "-"}
                      />
                    </div>
                  </div>
                </div>

                {/* Stage Timeline */}
              <div className="rounded-2xl bg-white p-6 border border-gray-200">
  <h3 className="text-xl font-semibold mb-4">Tracking Timeline</h3>

  {/* Quote header like public tracking */}
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
    <div key={container.containerNumber} className="mb-6">
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
            <p className="font-medium">{event.status || "—"}</p>

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
</div>

              </div>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold">Documents</h3>
                  <p className="text-sm text-gray-600">
                    Documents are linked to this job.
                  </p>
                </div>

                {Array.isArray(job.documents) && job.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.documents.map((d, idx) => {
                      const s = docStatus(d);
                      const url = d.fileUrl || d.uploadedFile || null;

                      return (
                        <div
                          key={`${d.name}-${idx}`}
                          className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start justify-between gap-4"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{d.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {d.uploadedAt
                                ? `Uploaded: ${new Date(d.uploadedAt).toLocaleString()}`
                                : "Not uploaded yet"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {d.confirmedAt
                                ? `Confirmed: ${new Date(d.confirmedAt).toLocaleString()}`
                                : "Not confirmed yet"}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${s.cls}`}>
                              {s.label}
                            </span>

                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline font-medium text-sm"
                              >
                                View / Download →
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No file
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No documents set for this job.</p>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
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
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
