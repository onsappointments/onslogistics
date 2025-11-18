"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const [shipments, setShipments] = useState([]);
  const [docs, setDocs] = useState([]);
useEffect(() => {
  if (status !== "authenticated") return;

  const businessName = session?.user?.businessName;
  if (!businessName) {
    console.warn("⚠️ No businessName found in session yet");
    return;
  }

  console.log("🔍 Logged-in business:", businessName);

  const fetchDocs = async () => {
    try {
      const res = await fetch(
        `/api/documents?businessName=${encodeURIComponent(businessName)}`
      );
      const data = await res.json();
      console.log("📄 Documents received:", data);
      setDocs(data);
    } catch (err) {
      console.error("❌ Failed to fetch documents:", err);
    }
  };

  const fetchShipments = async () => {
    try {
      const res = await fetch(
        `/api/shipments?businessName=${encodeURIComponent(businessName)}`
      );
      const data = await res.json();
      console.log("📦 Shipments received:", data);
      setShipments(data);
    } catch (err) {
      console.error("❌ Failed to fetch shipments:", err);
    }
  };

  fetchDocs();
  fetchShipments();
}, [status, session]);

  if (status === "loading") {
    return <p className="text-center mt-20">Loading your dashboard...</p>;
  }

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-semibold mb-2">
          Welcome back, {session?.user?.name || "Client"} 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your shipments and documents with ease.
        </p>
      </section>

      {/* Shipments */}
      <section
        className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]
        border border-white/40 transition hover:shadow-[0_12px_50px_rgba(0,0,0,0.1)]"
      >
        <h2 className="text-2xl font-semibold mb-4">My Shipments</h2>

        {!shipments?.length && (
          <p className="text-gray-600">You don’t have any active shipments yet.</p>
        )}

        {shipments?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="px-4 py-2 font-medium">Shipment ID</th>
                  <th className="px-4 py-2 font-medium">Origin</th>
                  <th className="px-4 py-2 font-medium">Destination</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr
                    key={s._id}
                    className="bg-white hover:bg-gray-50 transition rounded-xl shadow-sm"
                  >
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {s.referenceId}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{s.origin}</td>
                    <td className="px-4 py-3 text-gray-700">{s.destination}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          s.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : s.status === "In Transit"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(s.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Documents */}
      <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">My Documents</h2>

        {docs?.length === 0 && (
          <p className="text-gray-600 text-sm">No documents available.</p>
        )}

        {docs?.length > 0 && (
          <div className="space-y-4">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{doc.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {doc.shipmentId || "General Document"}
                  </p>
                </div>
                <a
                  href={doc.fileUrl}
                  download
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Support Section */}
      <section
        id="support"
        className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]
        border border-white/40 transition hover:shadow-[0_12px_50px_rgba(0,0,0,0.1)]"
      >
        <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-3">
          Contact our support team for shipment updates or documentation help.
        </p>
        <a href="/contact" className="text-blue-600 hover:underline font-medium">
          Contact Us
        </a>
      </section>
    </div>
  );
}
