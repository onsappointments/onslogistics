"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NotificationBell() {
  const { data: session } = useSession();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const isSuperAdmin = session?.user?.adminType === "super_admin";
  const currentUserId = session?.user?.id;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });

      if (!res.ok) return;

      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error("Error loading notifications", e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    });

    fetchNotifications();
  };

  // Approve QUOTE edit
  const approveQuoteEdit = async (clientQuoteId) => {
    if (!clientQuoteId) {
      alert("Missing Client Quote ID.");
      return;
    }

    setApprovingId(`quote:${clientQuoteId}`);

    try {
      const res = await fetch(`/api/quotes/${clientQuoteId}/approve-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Approval failed.");
        return;
      }

      alert("Quote edit request approved successfully.");
      await fetchNotifications();
    } catch (err) {
      console.error("QUOTE APPROVAL ERROR:", err);
      alert("Something went wrong.");
    } finally {
      setApprovingId(null);
    }
  };

  // Approve JOB edit
  const approveJobEdit = async (jobId) => {
    if (!jobId) {
      alert("Missing Job ID.");
      return;
    }

    setApprovingId(`job:${jobId}`);

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/approve-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Approval failed.");
        return;
      }

      alert("Job edit request approved successfully.");
      await fetchNotifications();
    } catch (err) {
      console.error("JOB APPROVAL ERROR:", err);
      alert("Something went wrong.");
    } finally {
      setApprovingId(null);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-blue-50 w-full text-left relative"
      >
        Approval for Edits
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[500px] overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          {loading && (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          )}

          {!loading &&
            notifications.map((notif) => {
              const isRead = Boolean(
                notif.readBy?.some(
                  (r) =>
                    String(r.userId) === String(currentUserId) ||
                    String(r.userId?._id) === String(currentUserId)
                )
              );

              // jobId can be string or populated object
              const rawJob = notif.jobId;
              const jobId =
                typeof rawJob === "string"
                  ? rawJob
                  : rawJob?._id
                  ? String(rawJob._id)
                  : null;

              const rawTechQuote = notif.quoteId;

              const clientQuoteId =
                typeof rawTechQuote?.clientQuoteId === "string"
                  ? rawTechQuote.clientQuoteId
                  : rawTechQuote?.clientQuoteId?._id
                  ? String(rawTechQuote.clientQuoteId._id)
                  : null;

              const isJobNotif = Boolean(jobId);
              const isQuoteNotif = Boolean(clientQuoteId);

              const title =
                notif.type === "EDIT_REQUEST"
                  ? "Edit Request"
                  : notif.type === "EDIT_APPROVED"
                  ? "Edit Approved"
                  : notif.type === "EDIT_REJECTED"
                  ? "Edit Rejected"
                  : "Notification";

              const jobReadable = rawJob?.jobId || jobId || "";

              const description = isJobNotif
                ? `${notif.requestedByName} requested to edit job ${jobReadable}`
                : `${notif.requestedByName} requested to edit this quote`;

              // ✅ show remarks/message
              const remarkText =
                (notif.remarks && notif.remarks.trim()) ||
                (notif.message && notif.message.trim()) ||
                "";

              const canApprove =
  Boolean(isSuperAdmin) &&
  notif.status === "pending" &&
  (notif.type === "EDIT_REQUEST" || notif.type === "JOB_EDIT_REQUEST") &&
  (isJobNotif || isQuoteNotif);


              return (
                <div
                  key={notif._id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {title}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">{description}</p>

                      {remarkText && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Remarks: </span>
                          {remarkText}
                        </p>
                      )}

                      <p className="text-xs mt-2">
                        {notif.status === "pending" && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                            Pending
                          </span>
                        )}
                        {notif.status === "approved" && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            Approved
                          </span>
                        )}
                        {notif.status === "rejected" && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            Rejected
                          </span>
                        )}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {getTimeAgo(notif.createdAt)}
                      </p>

                      {isJobNotif && jobId && (
                        <Link
                          href={`/dashboard/admin/jobs/${jobId}`}
                          className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setIsOpen(false)}
                        >
                          View Job →
                        </Link>
                      )}

                      {!isJobNotif && isQuoteNotif && clientQuoteId && (
                        <Link
                          href={`/dashboard/admin/quotes/${clientQuoteId}`}
                          className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setIsOpen(false)}
                        >
                          View Quote →
                        </Link>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Mark as read
                      </button>

                      {canApprove && (
                        <button
                          onClick={() =>
                            isJobNotif
                              ? approveJobEdit(jobId)
                              : approveQuoteEdit(clientQuoteId)
                          }
                          disabled={
                            approvingId ===
                            (isJobNotif
                              ? `job:${jobId}`
                              : `quote:${clientQuoteId}`)
                          }
                          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {approvingId ===
                          (isJobNotif
                            ? `job:${jobId}`
                            : `quote:${clientQuoteId}`)
                            ? "Approving..."
                            : "Approve"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
