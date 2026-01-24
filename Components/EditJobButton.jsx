"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditJobButton({ id, isSuperAdmin, isNew }) {
  const router = useRouter();

  const jobId = useMemo(() => {
    if (!id) return null;
    if (typeof id === "object") return id?._id?.toString?.() ?? null;
    if (typeof id === "string") return id;
    return String(id);
  }, [id]);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [permissionReason, setPermissionReason] = useState("");

  const [remarks, setRemarks] = useState("");

  const goToEdit = () => {
    if (!jobId || jobId === "undefined") return;
    router.push(`/dashboard/admin/jobs/${jobId}/edit`);
  };

  if (isSuperAdmin) {
    return (
      <button
        onClick={goToEdit}
        disabled={!jobId || jobId === "undefined"}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Edit Job
      </button>
    );
  }

  if (isNew) {
    return (
      <button
        onClick={goToEdit}
        disabled={!jobId || jobId === "undefined"}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Edit Job
      </button>
    );
  }

  useEffect(() => {
    if (!jobId || jobId === "undefined") return;

    async function checkPermission() {
      try {
        const res = await fetch(`/api/admin/jobs/${jobId}/check-permission`, {
          cache: "no-store",
        });

        const data = await res.json();
        setCanEdit(Boolean(data.canEdit));
        setPermissionReason(data.reason || "");
      } catch (err) {
        console.error("Job permission check failed:", err);
      }
    }

    checkPermission();
  }, [jobId]);

  const handleRequestEdit = async () => {
    if (!jobId || jobId === "undefined") return;

    if (!remarks.trim()) {
      alert("Please add remarks (why you want to edit).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/request-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: remarks.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Edit request sent to Super Admin successfully!");
        setShowModal(false);
        setRemarks("");
      } else {
        alert(data.error || "Failed to send edit request");
      }
    } catch (error) {
      console.error("Error requesting job edit:", error);
      alert("Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setRemarks("");
  };

  return (
    <>
      <button
        onClick={() => {
          if (!jobId || jobId === "undefined") return;
          if (canEdit) return goToEdit();
          setShowModal(true);
        }}
        disabled={!jobId || jobId === "undefined"}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {canEdit ? "Edit Job" : "Request Edit"}
      </button>

      {/* Modal for regular admins */}
      {!canEdit && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-2">Request Edit Access</h3>

            <p className="text-gray-600 mb-4">
              {permissionReason === "pending_approval"
                ? "Your edit request is pending approval."
                : "You need Super Admin approval to edit this job."}
            </p>

            {/* remarks input (only when not pending) */}
            {permissionReason !== "pending_approval" && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g., Need to correct consignee details / update freight charges..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Please mention why you want to edit (helps Super Admin approve
                  faster).
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isLoading}
              >
                Close
              </button>

              {permissionReason !== "pending_approval" && (
                <button
                  onClick={handleRequestEdit}
                  disabled={isLoading || !remarks.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
