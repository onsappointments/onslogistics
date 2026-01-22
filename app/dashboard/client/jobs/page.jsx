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

  // Redirect if not authenticated / not client
  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !isClient) router.push("/login");
  }, [status, isClient, router]);

  // Fetch ALL jobs (same fields as dashboard reminder table)
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    if (!userId) {
      console.warn("⚠️ session.user.id missing. Add it in NextAuth callbacks.");
      return;
    }

    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        // IMPORTANT: your API should return all jobs for this page.
        // If your API currently returns only ongoing, update it OR create /api/client/jobs/all
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

  if (status === "loading") {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold mb-1">My Jobs</h1>
          <p className="text-gray-600">Same view as dashboard — click a job to open details.</p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/client")}
          className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition"
        >
          ← Back
        </button>
      </section>

      {/* Jobs Table (exact same columns as dashboard) */}
      <section
        className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]
        border border-white/40 transition hover:shadow-[0_12px_50px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-semibold">All Jobs</h2>
        </div>

        {jobsLoading && <p className="text-gray-600">Fetching your jobs...</p>}

        {!jobsLoading && jobs?.length === 0 && (
          <p className="text-gray-600">You don’t have any jobs yet.</p>
        )}

        {!jobsLoading && jobs?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="px-4 py-2 font-medium">Job ID</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((j) => (
                  <tr
                    key={j._id}
                    className="bg-white hover:bg-gray-50 transition rounded-xl shadow-sm cursor-pointer"
                    onClick={() => router.push(`/dashboard/client/jobs/${j._id}`)}
                  >
                    <td className="px-4 py-3 text-gray-900 font-medium">{j.jobId}</td>

                    <td className="px-4 py-3 text-gray-700">
                      {j?.quoteId?.shipmentType || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          j.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : j.status === "active"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-500 mt-3">
              Tip: Click a job row to view full details and documents.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
