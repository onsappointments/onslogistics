"use client";

import RecipientRow from "./RecipientRow";
import EmailTimeline from "./EmailTimeline";

export default function EmailStatusPanel({ emailLog }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b bg-gray-50 px-5 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Shipment Email
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          {emailLog.subject}
        </p>

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
              {new Date(emailLog.sentAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-b px-5 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <SummaryCard
            title="Recipients"
            value={emailLog.recipients.length}
          />

          <SummaryCard
            title="Delivered"
            value={
              emailLog.recipients.filter(
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
              emailLog.recipients.filter(
                (r) =>
                  r.status === "opened" ||
                  r.status === "clicked"
              ).length
            }
          />

          <SummaryCard
            title="Bounced"
            value={
              emailLog.recipients.filter((r) =>
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
          {emailLog.recipients.map((recipient) => (
            <RecipientRow
              key={`${recipient.type}-${recipient.email}`}
              recipient={recipient}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pb-5">
        <EmailTimeline events={emailLog.rawEvents} />
      </div>
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