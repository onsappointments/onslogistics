"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobsPage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/admin/jobs?status=active");
      const data = await res.json();
      setJobs(data.jobs || []);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-semibold mb-6">Active Jobs</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4">Route</th>
              <th className="p-4">Job ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No new jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className="border-t">
                  <td className="p-4 font-medium">
                    {job.company || "—"}
                  </td>

                  <td className="p-4">
                    {job.clientQuoteId?.fromCity &&
                    job.clientQuoteId?.toCity
                      ? `${job.clientQuoteId.fromCity} → ${job.clientQuoteId.toCity}`
                      : "—"}
                  </td>

                  <td className="p-4 font-semibold">{job.jobId}</td>

                  <td className="p-4">
                    <StatusBadge status={job.status} />
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/admin/jobs/${job._id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STATUS BADGE ---------- */

function StatusBadge({ status }) {
  const map = {
    new: "bg-yellow-100 text-yellow-700",
    documentation: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
