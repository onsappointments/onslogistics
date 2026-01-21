"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  // ----- CLIENT (shipments/docs) -----
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ----- COMPANY SEARCH (debounced suggestions) -----
  const [companyQuery, setCompanyQuery] = useState("");
  const [companies, setCompanies] = useState([]); // [{name}]
  const [companiesLoading, setCompaniesLoading] = useState(false);

  // ----- SELECTED COMPANY + JOBS -----
  const [selectedCompany, setSelectedCompany] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Protect admin route
  useEffect(() => {
    if (status === "unauthenticated") window.location.href = "/login";
    if (status === "authenticated" && session?.user?.role !== "admin") {
      window.location.href = "/dashboard/client";
    }
  }, [status, session]);

  // ✅ Debounced company suggestions
  useEffect(() => {
    const q = companyQuery.trim();

    // Clear if empty or too short (optional)
    if (!q || q.length < 1) {
      setCompanies([]);
      return;
    }

    const t = setTimeout(async () => {
      setCompaniesLoading(true);
      try {
        const res = await fetch(
          `/api/clients?mode=companies&q=${encodeURIComponent(q)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Company search failed:", data);
          setCompanies([]);
          return;
        }

        setCompanies(data.companies || []);
      } catch (err) {
        console.error("Company search error:", err);
        setCompanies([]);
      } finally {
        setCompaniesLoading(false);
      }
    }, 350); // debounce time

    return () => clearTimeout(t);
  }, [companyQuery]);

  // ✅ Click company -> load jobs for that company
  const handleSelectCompany = async (companyName) => {
    setSelectedCompany(companyName);
    setJobs([]);
    setJobsLoading(true);

    try {
      const res = await fetch(
        `/api/clients?mode=jobs&company=${encodeURIComponent(companyName)}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Jobs fetch failed:", data);
        setJobs([]);
        return;
      }

      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Jobs fetch error:", err);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch shipments + docs (your existing feature)
  const handleSelectClient = async (companyName, clientData) => {
    setSelectedClient(companyName);
    setSelectedClientDetails(clientData);

    const shipmentRes = await fetch(
      `/api/shipments?company=${encodeURIComponent(companyName)}`,
      { cache: "no-store" }
    );
    const docsRes = await fetch(
      `/api/documents?company=${encodeURIComponent(companyName)}`,
      { cache: "no-store" }
    );

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
    handleSelectClient(selectedClient, selectedClientDetails);
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
      handleSelectClient(selectedClient, selectedClientDetails);
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

      {/* ================= SEARCH COMPANIES (DEBOUNCED) ================= */}
      <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Search Companies</h2>

        <input
          type="text"
          placeholder="Type company name...."
          value={companyQuery}
          onChange={(e) => {
            setCompanyQuery(e.target.value);
            setSelectedCompany("");
            setJobs([]);
          }}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        {companiesLoading && (
          <p className="text-sm text-gray-500 mt-4">Searching...</p>
        )}

        {!companiesLoading && companies.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              Select a company ({companies.length})
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {companies.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSelectCompany(c.name)}
                  className={`w-full text-left p-5 rounded-xl transition border ${
                    selectedCompany.toLowerCase() === c.name.toLowerCase()
                      ? "bg-blue-100 border-blue-400"
                      : "bg-gray-50 hover:bg-gray-100 border-transparent"
                  }`}
                >
                  <p className="font-semibold text-gray-800">{c.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {!companiesLoading &&
          companyQuery.trim().length >= 2 &&
          companies.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800">
                No companies found matching "{companyQuery}"
              </p>
            </div>
          )}

        {/* ================= JOBS FOR SELECTED COMPANY ================= */}
        {selectedCompany && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Jobs for:{" "}
                <span className="text-blue-700">{selectedCompany}</span>
              </h3>

              <button
                onClick={() => {
                  setSelectedCompany("");
                  setJobs([]);
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
            </div>

            {jobsLoading && (
              <p className="text-sm text-gray-500">Loading jobs...</p>
            )}

            {!jobsLoading && jobs.length === 0 && (
              <p className="text-sm text-gray-600">
                No jobs found for this company.
              </p>
            )}

            {!jobsLoading && jobs.length > 0 && (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link
                    key={job._id}
                    href={`/dashboard/admin/jobs/${job._id}`}
                    className="block cursor-pointer p-6 rounded-xl transition bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          🆔 {job.jobId || job.jobNumber || job._id}
                        </p>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                          {job.customerName && (
                            <div>
                              <span className="text-gray-500">👤 Customer: </span>
                              {job.customerName}
                            </div>
                          )}

                          <div>
                            <span className="text-gray-500">📌 Status: </span>
                            {job.status || "—"}
                          </div>

                          {job.portOfLoading && (
                            <div>
                              <span className="text-gray-500">🚢 POL: </span>
                              {job.portOfLoading}
                            </div>
                          )}

                          {job.portOfDischarge && (
                            <div>
                              <span className="text-gray-500">🏝️ POD: </span>
                              {job.portOfDischarge}
                            </div>
                          )}

                          {job.stage && (
                            <div>
                              <span className="text-gray-500">🧭 Stage: </span>
                              {job.stage}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-blue-600 font-medium">Open →</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* (rest of your client shipments/docs UI remains same) */}
      {selectedClient && (
  <section className="space-y-10">
    {/* ---------- CLIENT DETAILS SUMMARY ---------- */}
    {selectedClientDetails && (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          📊 Client Overview — {selectedClient}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Company Name</p>
            <p className="font-semibold text-lg text-gray-800">
              {selectedClientDetails.company}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Email</p>
            <p className="font-semibold text-gray-800">
              {selectedClientDetails.email}
            </p>
          </div>

          {selectedClientDetails.phone && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Phone</p>
              <p className="font-semibold text-gray-800">
                {selectedClientDetails.phone}
              </p>
            </div>
          )}

          {selectedClientDetails.address && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Address</p>
              <p className="font-semibold text-gray-800">
                {selectedClientDetails.address}
              </p>
            </div>
          )}

          {selectedClientDetails.contactPerson && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Contact Person</p>
              <p className="font-semibold text-gray-800">
                {selectedClientDetails.contactPerson}
              </p>
            </div>
          )}

          {selectedClientDetails.gstin && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">GSTIN</p>
              <p className="font-semibold text-gray-800">
                {selectedClientDetails.gstin}
              </p>
            </div>
          )}

          {selectedClientDetails.iecCode && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">IEC Code</p>
              <p className="font-semibold text-gray-800">
                {selectedClientDetails.iecCode}
              </p>
            </div>
          )}
        </div>
      </div>
    )}

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
                    onChange={(e) => handleStatusUpdate(s._id, e.target.value)}
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
            handleSelectClient(selectedClient, selectedClientDetails);
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
