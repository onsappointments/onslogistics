"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditJobButton({ jobId, isSuperAdmin }) {
  const router = useRouter();

  const id = typeof jobId === "object" ? jobId._id : jobId;

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [permissionReason, setPermissionReason] = useState("");

  // ✅ NEW: remarks/message state
  const [remarks, setRemarks] = useState("");

  // ✅ SUPER ADMIN OVERRIDE
  if (isSuperAdmin) {
    return (
      <button
        onClick={() => router.push(`/dashboard/admin/jobs/${id}/edit`)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        Edit Job (Super Admin)
      </button>
    );
  }

  useEffect(() => {
    async function checkPermission() {
      try {
        const res = await fetch(`/api/admin/jobs/${id}/check-permission`, {
          cache: "no-store",
        });

        const data = await res.json();
        setCanEdit(Boolean(data.canEdit));
        setPermissionReason(data.reason || "");
      } catch (err) {
        console.error("Job permission check failed:", err);
      }
    }

    if (id) checkPermission();
  }, [id]);

  const handleEdit = () => {
    router.push(`/dashboard/admin/jobs/${id}/edit`);
  };

  const handleRequestEdit = async () => {
    if (!remarks.trim()) {
      alert("Please add remarks (why you want to edit).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/jobs/${id}/request-edit`, {
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
          if (canEdit) return handleEdit();
          setShowModal(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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

            {/* ✅ NEW: remarks input (only when not pending) */}
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
                  Please mention why you want to edit (helps Super Admin approve faster).
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
