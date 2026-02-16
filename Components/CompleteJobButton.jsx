"use client";

import { useState, useTransition } from "react";
import { completeJob } from "@/app/dashboard/admin/jobs/actions";

export default function CompleteJobButton({ jobId, jobIdLabel }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", jobId);
      await completeJob(formData);
      setOpen(false);
    });
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 active:bg-green-800 transition shadow-sm"
      >
        <IconCheckCircle className="w-4 h-4" />
        Complete Job
      </button>

      {/* Modal Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="complete-job-title"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-green-400 to-emerald-500" />

            <div className="p-8">
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 border border-green-100 mx-auto mb-5">
                <IconCheckCircle className="w-7 h-7 text-green-600" />
              </div>

              {/* Title */}
              <h2
                id="complete-job-title"
                className="text-xl font-bold text-gray-900 text-center"
              >
                Complete this Job?
              </h2>

              {/* Body */}
              <div className="mt-3 text-center space-y-2">
                <p className="text-gray-600 text-sm">
                  You are about to mark{" "}
                  {jobIdLabel ? (
                    <span className="font-semibold text-gray-900">
                      Job {jobIdLabel}
                    </span>
                  ) : (
                    "this job"
                  )}{" "}
                  as <span className="font-semibold text-green-700">Completed</span>.
                </p>
                <p className="text-gray-500 text-sm">
                  This action is <span className="font-semibold text-gray-700">irreversible</span>. Once completed, the job
                  cannot be edited, and container status updates will be disabled.
                </p>
              </div>

              {/* Warning box */}
              <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <IconWarning className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium">
                  Make sure all documents are uploaded and confirmed before completing
                  this job.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 active:bg-green-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <IconSpinner className="w-4 h-4 animate-spin" />
                      Completing…
                    </>
                  ) : (
                    <>
                      <IconCheckCircle className="w-4 h-4" />
                      Yes, Complete Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fade-in animation (Tailwind v3 plugin or inline keyframes) */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px); }
        }
        .animate-in {
          animation: modal-in 0.18s ease-out both;
        }
      `}</style>
    </>
  );
}

/* ---------- Icons ---------- */

function IconCheckCircle({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconWarning({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function IconSpinner({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}