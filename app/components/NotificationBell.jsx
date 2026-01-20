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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
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
  
  // APPROVE USING CLIENT QUOTE ID (not technical)
const handleApproval = async (clientQuoteId) => {
  if (!clientQuoteId) {
    console.warn("No clientQuoteId provided");
    alert("Missing Client Quote ID.");
    return;
  }

  setApprovingId(clientQuoteId);

  try {
    const res = await fetch(
      `/api/quotes/${clientQuoteId}/approve-edit`, // ← FIXED
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid server response" };
    }

    console.log("APPROVE RESPONSE:", data);

    if (!res.ok) {
      alert(data.error || "Approval failed.");
      return;
    }

    alert("Edit request approved successfully.");

    await fetchNotifications();
  } catch (err) {
    console.error("APPROVAL ERROR:", err);
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
      {/* Button */}
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

      {/* Dropdown */}
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
              const isRead = notif.readBy?.length > 0;

              const technicalQuote = notif.quoteId;

              // Safe extraction
              const clientQuoteId =
                typeof technicalQuote?.clientQuoteId === "string"
                  ? technicalQuote.clientQuoteId
                  : technicalQuote?.clientQuoteId?._id;

              const technicalQuoteId = technicalQuote?._id;

              return (
                <div
                  key={notif._id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    {/* LEFT */}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notif.type === "EDIT_REQUEST" && "Edit Request"}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {notif.requestedByName} requested to edit this quote
                      </p>

                      <p className="text-xs mt-1">
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
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {getTimeAgo(notif.createdAt)}
                      </p>

                      {clientQuoteId && (
                        <Link
                          href={`/dashboard/admin/quotes/${clientQuoteId}`}
                          className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setIsOpen(false)}
                        >
                          View Quote →
                        </Link>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Mark as read
                      </button>

                      {isSuperAdmin &&
                        notif.type === "EDIT_REQUEST" &&
                        notif.status === "pending" &&
                        technicalQuoteId && (
                          <button
                            onClick={() => handleApproval(clientQuoteId)}
                            disabled={approvingId === clientQuoteId}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {approvingId === clientQuoteId
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
