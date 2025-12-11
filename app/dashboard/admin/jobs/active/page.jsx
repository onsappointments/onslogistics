"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Quote } from "lucide-react";

export default function ActiveJobsPage() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const res = await fetch("/api/admin/jobs?status=active");
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  useEffect(() => {
    const load = async () => {
      await fetchJobs();
    };
    load();
  }, []);
  

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold mb-6">Active Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No active jobs at the moment.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow rounded-xl p-6 flex justify-between items-center hover:bg-gray-50 transition"
            >
              {/* LEFT SIDE – JOB SUMMARY */}
              <div>
                <p className="text-xl font-semibold">{job.jobId}</p>

                <p className="text-gray-600">
                {job.quoteId?.company || `${job.quoteId?.firstName || ""} ${job.quoteId?.lastName || ""}`.trim() || "No Company"}


                </p>

                <p className="text-gray-500 text-sm">
                  Stage:{" "}
                  {job.stages?.[job.currentStage - 1]?.name ||
                    `Stage ${job.currentStage}`}{" "}
                  ({job.currentStage}/10)
                </p>
              </div>

              {/* RIGHT SIDE – VIEW BUTTON */}
              <Link
                href={`/dashboard/admin/jobs/${job._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
