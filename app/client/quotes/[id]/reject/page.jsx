"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RejectQuotePage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [isAlreadyProcessed, setIsAlreadyProcessed] = useState(false);

  useEffect(() => {
    const rejectQuote = async () => {
      try {
        const response = await fetch(`/api/client/quotes/${params.id}/reject`, {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
          // Check if quote was already rejected
          if (data.message && data.message.toLowerCase().includes("already")) {
            setStatus("info");
            setMessage(data.message);
            setIsAlreadyProcessed(true);
          } else {
            setStatus("success");
            setMessage(data.message || "Quote rejected successfully.");
          }
        } else {
          setStatus("error");
          setMessage(data.error || data.message || "Failed to reject quote");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while rejecting the quote");
      }
    };

    rejectQuote();
  }, [params.id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your response...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="text-orange-600 text-5xl mb-4">ℹ</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Rejected</h2>
            <p className="text-gray-600 mb-2">{message}</p>
            <p className="text-sm text-gray-500">We'll contact you shortly to discuss alternatives.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
          </div>
        )}

        {status === "info" && (
          <div className="text-center">
            <div className="text-blue-600 text-5xl mb-4">ℹ</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Processed</h2>
            <p className="text-gray-600 mb-2">{message}</p>
            <p className="text-sm text-gray-500">This quote has already been rejected.</p>
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