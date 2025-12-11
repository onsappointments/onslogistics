"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Quote from "@/models/Quote";

export default function NewJobsPage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const fetchJobs = async () => {
    const res = await fetch("/api/admin/jobs?status=new");
    const data = await res.json(); 
    setJobs(data.jobs);
  };
  useEffect(() => {
    const load = async () => {
      await fetchJobs();
    };
    load();
  }, []);
  

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold mb-6">New Jobs</h1>

      <div className="bg-white rounded-xl shadow">
        {jobs.length === 0 ? (
          <p className="p-6 text-gray-600">No new jobs.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => router.push(`/dashboard/admin/jobs/${job._id}`)}
              className="border-b px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{job.jobId}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(job.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-gray-700">Stage: {job.stage}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
