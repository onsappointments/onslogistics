"use client";

import { useState } from "react";

/* ---------------- STATUS FLOW ---------------- */

const STATUS_OPTIONS = [
  "Empty Picked Up",
  "Gate In",
  "Loaded on Vessel",
  "Vessel Departed",
  "Arrived at Transshipment Port",
  "Vessel Arrived",
  "Discharged",
  "Gate Out",
  "Delivered",
];

/* ---------------- MAIN COMPONENT ---------------- */

export default function TrackingAdminClient({ job }) {
  const [containers, setContainers] = useState(job.containers || []);
  const [saving, setSaving] = useState(false);

  async function saveEvent(containerNumber, sizeType, event) {
    try {
      setSaving(true);

      const res = await fetch("/api/admin/jobs/container-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          containerNumber,
          sizeType,
          event,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update container");
        return;
      }

      setContainers(data.job.containers);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* EXISTING CONTAINERS */}
      {containers.map((container) => (
        <div
          key={container.containerNumber}
          className="bg-white p-6 rounded-xl shadow border"
        >
          <h2 className="text-lg font-semibold mb-4">
            Container: {container.containerNumber}{" "}
            {container.sizeType && `(${container.sizeType})`}
          </h2>

          {/* TIMELINE */}
          <div className="space-y-2 mb-6">
            {(container.events || []).map((event, index) => (
              <div
                key={index}
                className="text-sm border-l-2 pl-4 border-green-600"
              >
                <div className="font-medium">{event.status}</div>
                <div className="text-gray-600">
                  {event.location || "—"} •{" "}
                  {new Date(event.eventDate).toLocaleString()}
                </div>
                {event.remarks && (
                  <div className="text-xs text-gray-500">
                    {event.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ADD EVENT */}
          <AddEventForm
            loading={saving}
            onSubmit={(event) =>
              saveEvent(
                container.containerNumber,
                container.sizeType,
                event
              )
            }
          />
        </div>
      ))}

      {/* ADD NEW CONTAINER */}
      <AddContainerForm loading={saving} onSubmit={saveEvent} />
    </div>
  );
}

/* ---------------- ADD CONTAINER ---------------- */

function AddContainerForm({ onSubmit, loading }) {
  const [containerNumber, setContainerNumber] = useState("");
  const [sizeType, setSizeType] = useState("");

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h3 className="font-semibold mb-4">Add New Container</h3>

      <input
        className="input mb-2"
        placeholder="Container Number (e.g. CAAU9272307)"
        value={containerNumber}
        onChange={(e) => setContainerNumber(e.target.value.toUpperCase())}
      />

      <input
        className="input mb-4"
        placeholder="Size Type (e.g. 40HC)"
        value={sizeType}
        onChange={(e) => setSizeType(e.target.value)}
      />

      <button
        disabled={loading || !containerNumber}
        onClick={() =>
          onSubmit(containerNumber, sizeType, {
            status: "Empty Picked Up",
            eventDate: new Date(),
          })
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Container
      </button>
    </div>
  );
}

/* ---------------- ADD EVENT FORM ---------------- */

function AddEventForm({ onSubmit, loading }) {
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  return (
    <div className="border-t pt-4 space-y-2">
      {/* STATUS */}
      <select
        className="input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Select Status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* DATE & TIME */}
      <input
        type="datetime-local"
        className="input"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />

      {/* LOCATION */}
      <input
        className="input"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* REMARKS */}
      <input
        className="input"
        placeholder="Remarks (optional)"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      <button
        disabled={loading || !status}
        onClick={() =>
          onSubmit({
            status,
            location,
            remarks,
            eventDate: eventDate ? new Date(eventDate) : new Date(),
          })
        }
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Add Status
      </button>
    </div>
  );
}
