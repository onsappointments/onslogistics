"use client";

import { X } from "lucide-react";

export default function EmailPreviewModal({
  open,
  onClose,
  html,
  subject,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Email Preview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {subject}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow">

            <div
              dangerouslySetInnerHTML={{
                __html: html || "<p>No email HTML stored.</p>",
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
}