"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditQuoteButton({ quoteId, isSuperAdmin }) {
  const router = useRouter();

  // ⭐ Always ensure quoteId is a string
  const id = typeof quoteId === "object" ? quoteId._id : quoteId;

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [permissionReason, setPermissionReason] = useState("");

  // ⭐ SUPER ADMIN OVERRIDE — ALWAYS ALLOW EDIT
  if (isSuperAdmin) {
    return (
      <button
        onClick={() =>
          router.push(`/dashboard/admin/quotes/${id}/technical`)
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        Edit Quote (Super Admin)
      </button>
    );
  }

  useEffect(() => {
    async function checkPermission() {
      try {
        const res = await fetch(
          `/api/quotes/${id}/check-permission`,
          { cache: "no-store" }
        );

        const data = await res.json();
        console.log("Permission check data:", data);

        setCanEdit(data.canEdit);
        setPermissionReason(data.reason);
      } catch (err) {
        console.error("Permission check failed:", err);
      }
    }

    checkPermission();
  }, [id]);

  // 🔥 If user CAN edit → open technical quote page
  const handleEdit = () => {
    router.push(`/dashboard/admin/quotes/${id}/technical`);
  };

  // 🔥 Handle regular admin requesting access
  const handleRequestEdit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quotes/${id}/request-edit`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Edit request sent to Super Admin successfully!");
        setShowModal(false);
      } else {
        alert(data.error || "Failed to send edit request");
      }
    } catch (error) {
      console.error("Error requesting edit:", error);
      alert("Request failed");
    } finally {
      setIsLoading(false);
    }
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
        {canEdit ? "Edit Quote" : "Request Edit"}
      </button>

      {/* Modal for regular admins */}
      {!canEdit && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Request Edit Access</h3>

            <p className="text-gray-600 mb-6">
              {permissionReason === "pending_approval"
                ? "Your edit request is pending approval."
                : "You need Super Admin approval to edit this quote."}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isLoading}
              >
                Close
              </button>

              {permissionReason !== "pending_approval" && (
                <button
                  onClick={handleRequestEdit}
                  disabled={isLoading}
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
