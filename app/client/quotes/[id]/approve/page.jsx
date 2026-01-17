"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ApproveQuotePage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [isAlreadyProcessed, setIsAlreadyProcessed] = useState(false);

  useEffect(() => {
    const approveQuote = async () => {
      try {
        const response = await fetch(`/api/client/quotes/${params.id}/approve`, {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
          // Check if quote was already approved
          if (data.message && data.message.toLowerCase().includes("already")) {
            setStatus("info");
            setMessage(data.message);
            setIsAlreadyProcessed(true);
          } else {
            setStatus("success");
            setMessage(data.message || "Quote approved successfully!");
          }
          
          // Redirect to client quote view
          if (data.clientQuoteId) {
            setTimeout(() => {
              router.push(`/client/quotes/${data.clientQuoteId}`);
            }, 2000);
          }
        } else {
          setStatus("error");
          setMessage(data.error || data.message || "Failed to approve quote");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while approving the quote");
      }
    };

    approveQuote();
  }, [params.id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Approving your quote...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600 mb-2">{message}</p>
            <p className="text-sm text-gray-500">We'll contact you shortly to proceed with your shipment.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
          </div>
        )}

        {status === "info" && (
          <div className="text-center">
            <div className="text-blue-600 text-5xl mb-4">ℹ</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Processed</h2>
            <p className="text-gray-600 mb-2">{message}</p>
            <p className="text-sm text-gray-500">This quote has already been approved.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to quote details...</p>
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