"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Protect admin route
  useEffect(() => {
    if (status === "unauthenticated") window.location.href = "/login";
    if (status === "authenticated" && session?.user?.role !== "admin") {
      window.location.href = "/dashboard/client";
    }
  }, [status, session]);

  // Search client by business name
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const res = await fetch(`/api/clients?businessName=${searchTerm}`);
    const data = await res.json();
    setClients(data);
  };

  // Fetch shipments + docs
  const handleSelectClient = async (businessName) => {
    setSelectedClient(businessName);

    const shipmentRes = await fetch(`/api/shipments?businessName=${businessName}`);
    const docsRes = await fetch(`/api/documents?businessName=${businessName}`);

    setShipments(await shipmentRes.json());
    setDocs(await docsRes.json());
  };

  // Update shipment status
  const handleStatusUpdate = async (shipmentId, newStatus) => {
    await fetch(`/api/shipments/${shipmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    alert("Shipment status updated!");
    handleSelectClient(selectedClient);
  };

  // Upload document
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedClient) return alert("Select a client first!");

    const formData = new FormData(e.target);
    formData.append("businessName", selectedClient);

    setUploading(true);

    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (res.ok) {
      alert("Document uploaded successfully!");
      handleSelectClient(selectedClient);
      e.target.reset();
    } else {
      alert("Upload failed!");
    }
  };

  if (status === "loading")
    return <p className="text-center mt-20">Loading admin dashboard...</p>;

  return (
    <div className="space-y-12">
      
      {/* ================= HEADER ================= */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8 gap-6">
        <div>
          <h1 className="text-4xl font-semibold mb-2">
          Welcome, {session?.user?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Manage clients, shipments, and documents efficiently.
        </p>
        </div>
      </section>

       

      {/* ================= SEARCH CLIENT ================= */}
      <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Search Client</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Business Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {clients.length > 0 && (
          <div className="mt-6 space-y-3">
            {clients.map((c) => (
              <div
                key={c._id}
                onClick={() => handleSelectClient(c.businessName)}
                className={`cursor-pointer p-4 rounded-xl transition ${
                  selectedClient === c.businessName
                    ? "bg-blue-100 border border-blue-400"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <p className="font-semibold text-gray-800">{c.businessName}</p>
                <p className="text-gray-600 text-sm">{c.email}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CLIENT DATA SECTION ================= */}
      {selectedClient && (
        <section className="space-y-10">
          
          {/* ---------- ACTIVE SHIPMENTS ---------- */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">
              Active Shipments — {selectedClient}
            </h2>

            {shipments.length === 0 ? (
              <p className="text-gray-600 text-sm">No shipments found.</p>
            ) : (
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-gray-700">
                    <th className="px-4 py-2">Ref ID</th>
                    <th className="px-4 py-2">Origin</th>
                    <th className="px-4 py-2">Destination</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s._id} className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-3">{s.referenceId}</td>
                      <td className="px-4 py-3">{s.origin}</td>
                      <td className="px-4 py-3">{s.destination}</td>
                      <td className="px-4 py-3">{s.status}</td>
                      <td className="px-4 py-3">
                        <select
                          defaultValue={s.status}
                          onChange={(e) =>
                            handleStatusUpdate(s._id, e.target.value)
                          }
                          className="border p-2 rounded-lg"
                        >
                          <option>Pending</option>
                          <option>Documentation</option>
                          <option>Customs</option>
                          <option>Railout</option>
                          <option>Sailout</option>
                          <option>Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ---------- ADD SHIPMENT ---------- */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Add New Shipment</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const form = new FormData(e.target);

                const payload = {
                  businessName: selectedClient,
                  referenceId: form.get("referenceId"),
                  origin: form.get("origin"),
                  destination: form.get("destination"),
                  status: form.get("status"),
                };

                const res = await fetch("/api/shipments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                if (res.ok) {
                  alert("Shipment added!");
                  handleSelectClient(selectedClient);
                  e.target.reset();
                } else {
                  alert("Failed to add shipment");
                }
              }}
              className="flex flex-col gap-4"
            >
              <input
                name="referenceId"
                placeholder="Reference ID"
                required
                className="p-4 border rounded-xl"
              />
              <input
                name="origin"
                placeholder="Origin"
                required
                className="p-4 border rounded-xl"
              />
              <input
                name="destination"
                placeholder="Destination"
                required
                className="p-4 border rounded-xl"
              />
              <select name="status" className="p-4 border rounded-xl">
                <option>Pending</option>
                <option>Documentation</option>
                <option>Customs</option>
                <option>Railout</option>
                <option>Sailout</option>
                <option>Delivered</option>
              </select>

              <button className="bg-blue-600 text-white py-3 rounded-xl">
                Add Shipment
              </button>
            </form>
          </div>

          {/* ---------- DOCUMENTS ---------- */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Client Documents</h2>

            {docs.length === 0 ? (
              <p>No documents found.</p>
            ) : (
              <div className="space-y-3">
                {docs.map((d) => (
                  <div
                    key={d._id}
                    className="flex justify-between bg-gray-50 p-4 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{d.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {d.shipmentId || "General Document"}
                      </p>
                    </div>
                    <a
                      href={d.fileUrl}
                      download
                      className="text-blue-600 font-medium"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- UPLOAD DOCUMENT ---------- */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">Upload Document</h2>

            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <input
                name="shipmentId"
                placeholder="Shipment Ref ID (optional)"
                className="p-4 border rounded-xl"
              />
              <input
                type="file"
                name="file"
                required
                className="p-4 border rounded-xl"
              />

              <button
                className="bg-blue-600 text-white py-3 rounded-xl"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
