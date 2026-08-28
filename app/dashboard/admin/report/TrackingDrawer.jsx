"use client";

import { useEffect, useState } from "react";
import TrackingAdminClient from "../jobs/[id]/tracking/tracking-admin-client";

export default function TrackingDrawer({
  jobNumber,
  onClose,
}) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobNumber) return;

    let cancelled = false;

    async function loadJob() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/report/tracking?jobNumber=${encodeURIComponent(
            jobNumber
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load tracking information"
          );
        }

        if (!cancelled) {
          setJob(data.job);
        }
      } catch (err) {
        console.error(
          "Tracking drawer error:",
          err
        );

        if (!cancelled) {
          setError(
            err?.message ||
              "Failed to load tracking information"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJob();

    return () => {
      cancelled = true;
    };
  }, [jobNumber]);

  return (
    <>
      {/* No blur / no backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={[
          "fixed top-0 right-0 bottom-0 z-[110]",
          "w-full sm:w-[620px] lg:w-[700px]",
          "bg-[#f5f7fa]",
          "border-l border-gray-200",
          "shadow-2xl",
          "flex flex-col",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                Shipment Tracking
              </p>

              <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
                {jobNumber || "Tracking"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={[
                "w-9 h-9",
                "rounded-lg",
                "border border-gray-200",
                "bg-white",
                "text-gray-500",
                "hover:bg-gray-50",
                "hover:text-gray-800",
                "transition-colors",
                "flex items-center justify-center",
              ].join(" ")}
              aria-label="Close tracking panel"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 6 6 18"
                  strokeLinecap="round"
                />
                <path
                  d="m6 6 12 12"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="space-y-4">
              <div className="h-24 rounded-xl bg-white border border-gray-200 animate-pulse" />

              <div className="h-40 rounded-xl bg-white border border-gray-200 animate-pulse" />

              <div className="h-40 rounded-xl bg-white border border-gray-200 animate-pulse" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-white border border-red-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-red-700">
                Unable to load tracking
              </p>

              <p className="text-xs text-red-500 mt-1">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && job && (
            <TrackingAdminClient
              job={job}
              defaultEmail={
                job?.quoteId?.email || ""
              }
            />
          )}
        </div>
      </aside>
    </>
  );
}