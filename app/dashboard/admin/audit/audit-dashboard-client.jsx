"use client";

import { useState } from "react";
import AuditTimeline from "@/Components/AuditTimeline";

export default function AuditDashboardClient({ jobs, admins }) {
  const [mode, setMode] = useState("jobs"); // jobs | admins
  const [selectedId, setSelectedId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  async function loadJobAudit(jobId) {
    setLoading(true);
    const res = await fetch(`/api/admin/audit/job/${jobId}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setLoading(false);
  }

  async function loadAdminAudit(adminId) {
    setLoading(true);
  
    const params = new URLSearchParams();
    params.set("admin", adminId);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
  
    const res = await fetch(`/api/admin/audit/logs?${params.toString()}`);
    const data = await res.json();
  
    setLogs(data.logs || []);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT PANEL */}
      <div className="col-span-4 bg-white rounded-xl shadow p-4">
        {/* MODE SELECTOR */}
        <div className="mb-4">
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setSelectedId(null);
              setLogs([]);
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="jobs">Active Jobs</option>
            <option value="admins">Admins</option>
          </select>
        </div>
        
        <div className="space-y-2 mb-4">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          {mode === "admins" && selectedId && (
            <button
              onClick={() => loadAdminAudit(selectedId)}
              className="w-full bg-blue-600 text-white rounded px-3 py-2"
            >
              Apply Filter
            </button>
          )}
        </div>

        {/* LIST */}
        <div className="space-y-2 max-h-[70vh] overflow-auto">
          {mode === "jobs" &&
            jobs.map((job) => (
              <button
                key={job._id}
                onClick={() => {
                  setSelectedId(job._id);
                  loadJobAudit(job._id);
                }}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedId === job._id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">{job.jobId}</p>
                <p className="text-xs opacity-70">{job.company || "—"}</p>
              </button>
            ))}

          {mode === "admins" &&
            admins.map((admin) => (
              <button
                key={admin._id}
                onClick={() => {
                  setSelectedId(admin._id);
                  loadAdminAudit(admin._id);
                }}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedId === admin._id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">{admin.name || admin.email}</p>
                <p className="text-xs opacity-70">{admin.email}</p>
              </button>
            ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-8 bg-white rounded-xl shadow p-6">
        {loading && <p className="text-gray-500">Loading audit logs…</p>}

        {!loading && logs.length === 0 && (
          <p className="text-gray-500">
            Select a {mode === "jobs" ? "job" : "admin"} to view audit logs
          </p>
        )}

        {!loading && logs.length > 0 && <AuditTimeline logs={logs} />}
      </div>
    </div>
  );
}
