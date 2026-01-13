"use client";

import { useState } from "react";
import AuditTimeline from "./AuditTimeline";

export default function AuditTimelineWrapper({ logs }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        {open ? "Hide Activity Timeline" : "View Activity Timeline"}
      </button>

      {open && (
        <div className="mt-6">
          <AuditTimeline logs={logs} />
        </div>
      )}
    </section>
  );
}
