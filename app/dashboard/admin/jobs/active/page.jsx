"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ActiveJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const fetchJobs = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/jobs?status=active", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || "Failed to fetch active jobs");
        setJobs([]);
        return;
      }

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (e) {
      console.error(e);
      setErr("Failed to fetch active jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-8">
      {/* Header Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Active Jobs</h1>
            <p className="text-gray-600 mt-2">
              All jobs currently in progress. Click any row to view full details.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              Total Active: {jobs.length}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchJobs}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Refreshing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 8a8 8 0 00-14.828-2M4 16a8 8 0 0014.828 2" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-700 text-sm font-medium">{err}</p>
          </div>
        )}
      </section>

      {/* Table Card */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/40 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Jobs</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tip: Click a job row to open job details.
            </p>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-semibold">Loading…</span>
            </div>
          )}
        </div>

        {/* Empty */}
        {!loading && jobs.length === 0 && !err && (
          <div className="p-14 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">No active jobs found</p>
            <p className="text-sm text-gray-600 mt-1">Looks like everything is completed or not started yet.</p>
          </div>
        )}

        {/* Table */}
        {jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-700">
                  <th className="px-8 py-4 font-semibold">Company</th>
                  <th className="px-8 py-4 font-semibold">Route</th>
                  <th className="px-8 py-4 font-semibold">Job ID</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => {
                  const from = job?.clientQuoteId?.fromCity;
                  const to = job?.clientQuoteId?.toCity;

                  return (
                    <tr
                      key={job._id}
                      className="hover:bg-blue-50/30 transition cursor-pointer"
                      onClick={() => router.push(`/dashboard/admin/jobs/${job._id}`)}
                    >
                      <td className="px-8 py-5 font-semibold text-gray-900">
                        {job.company || "—"}
                      </td>

                      <td className="px-8 py-5 text-gray-700">
                        {from && to ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="font-medium">{from}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium">{to}</span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-8 py-5 font-bold text-gray-900">
                        {job.jobId || "—"}
                      </td>

                      <td className="px-8 py-5">
                        <StatusBadge status={job.status} />
                      </td>

                      <td className="px-8 py-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/admin/jobs/${job._id}`);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-8 py-4 border-t border-gray-100 text-xs text-gray-500">
              💡 Tip: Click anywhere on a row to open job details.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- STATUS BADGE ---------- */

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize";

  const map = {
    active: `${base} bg-yellow-100 text-yellow-700 border-yellow-200`,
    new: `${base} bg-yellow-100 text-yellow-700 border-yellow-200`,
    documentation: `${base} bg-blue-100 text-blue-700 border-blue-200`,
    in_progress: `${base} bg-purple-100 text-purple-700 border-purple-200`,
    completed: `${base} bg-green-100 text-green-700 border-green-200`,
  };

  return (
    <span className={map[s] || `${base} bg-gray-100 text-gray-700 border-gray-200`}>
      {s.replaceAll("_", " ")}
    </span>
  );
}
