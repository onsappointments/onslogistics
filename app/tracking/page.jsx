"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TrackingLandingPage() {
  const router = useRouter();
  const [reference, setReference] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!reference.trim()) {
      alert("Please enter a tracking reference");
      return;
    }

    router.push(`/tracking/${reference.trim().toUpperCase()}`);
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">
          Shipment & Container Tracking
        </h1>

        <p className="text-gray-600 mb-6">
          Track your shipment using Container No, BL No, Booking No or Invoice No.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter tracking reference (e.g. MRKU8365035)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Track Shipment
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Examples: MRKU8365035, BL20250123, BKG889900, INV-98231
        </p>
      </div>
    </main>
  );
}
