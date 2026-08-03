"use client";

import RecipientRow from "./RecipientRow";
import EmailTimeline from "./EmailTimeline";
import { useState } from "react";
import EmailPreviewModal from "./EmailPreviewModal";

export default function EmailStatusPanel({ emailLog }) {

  const [showPreview, setShowPreview] = useState(false);

  const recipients =
    emailLog.recipients ??
    (emailLog.recipient
      ? [
          {
            email: emailLog.recipient,
            type: "to",
            status: emailLog.currentStatus,
          },
        ]
      : []);

  const rawEvents = emailLog.rawEvents ?? [];

  const sentAt = emailLog.sentAt
    ? new Date(emailLog.sentAt).toLocaleString()
    : "Unknown";

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b bg-gray-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Shipment Email
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              {emailLog.subject}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            View Email
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-gray-500">Email Type</p>
            <p className="font-medium text-gray-900 capitalize">
              {emailLog.emailType || "Shipment Update"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Sent At</p>
            <p className="font-medium text-gray-900">
              {sentAt}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-b px-5 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <SummaryCard
            title="Recipients"
            value={recipients.length}
          />

          <SummaryCard
            title="Delivered"
            value={
              recipients.filter(
                (r) =>
                  r.status === "delivered" ||
                  r.status === "opened" ||
                  r.status === "clicked"
              ).length
            }
          />

          <SummaryCard
            title="Opened"
            value={
              recipients.filter(
                (r) =>
                  r.status === "opened" ||
                  r.status === "clicked"
              ).length
            }
          />

          <SummaryCard
            title="Bounced"
            value={
              recipients.filter((r) =>
                ["soft_bounce", "hard_bounce"].includes(r.status)
              ).length
            }
          />
        </div>
      </div>

      {/* Recipients */}
      <div className="p-5">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Recipients
        </h4>

        <div className="space-y-3">
          {recipients.map((recipient) => (
            <RecipientRow
              key={`${recipient.type}-${recipient.email}`}
              recipient={recipient}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pb-5">
        <EmailTimeline events={rawEvents} />
      </div>

      <EmailPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        subject={emailLog.subject}
        html={emailLog.html}
      />
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}