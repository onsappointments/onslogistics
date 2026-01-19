"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RejectQuotePage() {
  const params = useParams();
  const router = useRouter();

  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("form"); // form | loading | success | error | info
  const [message, setMessage] = useState("");

  const submitRejection = async () => {
    setStatus("loading");

    try {
      const response = await fetch(`/api/client/quotes/${params.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message?.toLowerCase().includes("already")) {
          setStatus("info");
          setMessage(data.message);
        } else {
          setStatus("success");
          setMessage(data.message || "Quote rejected successfully.");
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to reject quote");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred while rejecting the quote");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        
        {status === "form" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Reject Quote
            </h2>

            <p className="text-gray-600 mb-4 text-center">
              Please tell us what went wrong. This helps us improve.
            </p>

            <textarea
              className="w-full border rounded-lg p-3 mb-4 h-32"
              placeholder="Write your remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button
              onClick={submitRejection}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Submit Rejection
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Submitting your response...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">✔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quote Rejected
            </h2>
            <p className="text-gray-600 mb-2">{message}</p>
          </div>
        )}

        {status === "info" && (
          <div className="text-center">
            <div className="text-blue-600 text-5xl mb-4">ℹ</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Already Processed
            </h2>
            <p className="text-gray-600 mb-2">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
