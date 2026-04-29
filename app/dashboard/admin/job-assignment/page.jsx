"use client";

import { useEffect, useState } from "react";

export default function JobAssignmentPage() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState({});

  /* ---------------- FETCH DATA ---------------- */

  async function fetchData() {
    setLoading(true);

    const jobsRes = await fetch("/api/admin/jobs/unassigned");
    const jobsData = await jobsRes.json();

    const usersRes = await fetch("/api/admin/users/ops");
    const usersData = await usersRes.json();

    setJobs(jobsData);
    setUsers(usersData);

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- ASSIGN ---------------- */

  async function assignJob(jobId) {
    const userId = selectedUser[jobId];

    if (!userId) {
      alert("Please select a user");
      return;
    }

    const user = users.find((u) => u._id === userId);

    const res = await fetch("/api/admin/jobs/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        userId,
        userName: user.fullName || user.email,
      }),
    });

    if (res.ok) {
      alert("Job assigned");
      fetchData();
    } else {
      alert("Failed to assign");
    }
  }

  /* ---------------- UI ---------------- */

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-bold">Job Assignment</h1>

      {/* ---------------- UNASSIGNED JOBS ---------------- */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Unassigned Jobs ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <p>No unassigned jobs</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Job ID</th>
                  <th className="p-2">Company</th>
                  <th className="p-2">Shipment</th>
                  <th className="p-2">Assign To</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-t">
                    <td className="p-2 font-medium">{job.jobId}</td>

                    <td className="p-2">{job.company || "-"}</td>

                    <td className="p-2 capitalize">
                      {job.shipmentType || "-"}
                    </td>

                    {/* SELECT USER */}
                    <td className="p-2">
                      <select
                        value={selectedUser[job._id] || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            [job._id]: e.target.value,
                          })
                        }
                        className="border p-1 rounded"
                      >
                        <option value="">Select User</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.fullName || u.email}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* ASSIGN BUTTON */}
                    <td className="p-2">
                      <button
                        onClick={() => assignJob(job._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}