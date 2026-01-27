"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ClientJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isClient = useMemo(() => session?.user?.role === "client", [session]);
  const userId = session?.user?.id;

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // UI filters
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | active | completed | new

  // Redirect if not authenticated / not client
  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !isClient) router.push("/login");
  }, [status, isClient, router]);

  // Fetch ALL jobs
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    if (!userId) {
      console.warn("⚠️ session.user.id missing. Add it in NextAuth callbacks.");
      return;
    }

    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await fetch("/api/client/jobs?scope=all", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("❌ Jobs API error:", data);
          setJobs([]);
          return;
        }

        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        console.error("❌ Failed to fetch jobs:", err);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [status, isClient, userId]);

  const badge = (s) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";
    if (s === "completed") return `${base} bg-green-100 text-green-700 border-green-200`;
    if (s === "active") return `${base} bg-yellow-100 text-yellow-700 border-yellow-200`;
    return `${base} bg-gray-100 text-gray-700 border-gray-200`;
  };

  const filteredJobs = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (jobs || [])
      .filter((j) => {
        if (filterStatus === "all") return true;
        return (j?.status || "new") === filterStatus;
      })
      .filter((j) => {
        if (!query) return true;
        const hay = [
          j?.jobId,
          j?.quoteId?.shipmentType,
          j?.status,
          j?.company,
          j?._id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
  }, [jobs, q, filterStatus]);

  if (status === "loading") {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-600 mt-2">
              Track all your shipments. Click any job to open full details and documents.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Total: {jobs?.length || 0}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold">
                Showing: {filteredJobs.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/client")}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-semibold"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-3">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by Job ID, type, status..."
                className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl px-4 py-3 pl-11 outline-none transition"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-1 flex gap-1">
              {["all", "active", "completed"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(s)}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    filterStatus === s ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section
        className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]
        border border-white/40"
      >
        {/* Loading */}
        {jobsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-blue-600">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="font-semibold">Fetching your jobs...</span>
            </div>
          </div>
        )}

        {/* Empty */}
        {!jobsLoading && filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
            <p className="text-gray-600 mt-1">
              Try changing the filter or search query.
            </p>
          </div>
        )}

        {/* Cards */}
        {!jobsLoading && filteredJobs.length > 0 && (
          <div className="space-y-3">
            {filteredJobs.map((j) => (
              <div
                key={j._id}
                onClick={() => router.push(`/dashboard/client/jobs/${j._id}`)}
                className="group bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-blue-100/50
                  border border-gray-200 hover:border-blue-300 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Job ID
                    </p>
                    <p className="text-lg font-bold text-gray-900 truncate">{j.jobId || "-"}</p>

                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                        {j?.quoteId?.shipmentType || "—"}
                      </span>
                      <span className={badge(j.status)}>{j.status || "new"}</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/70 text-gray-700 border border-gray-200">
                        {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </div>
                  </div>

                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}

            <p className="text-xs text-center text-gray-500 mt-4 pt-4 border-t border-gray-200">
              💡 Tip: Click a job card to view full details and documents
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
