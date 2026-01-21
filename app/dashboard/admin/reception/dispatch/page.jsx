"use client";

import { useEffect, useState } from "react";
import AddReceivalModal from "@/Components/dispatch/AddReceivalModal";
import AddDispatchModal from "@/Components/dispatch/AddDispatchModal";

export default function DispatchPage() {
  const [activeView, setActiveView] = useState("receival");
  const [receivalData, setReceivalData] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [openReceival, setOpenReceival] = useState(false);
  const [openDispatch, setOpenDispatch] = useState(false);

  /* ---------- FETCH FUNCTIONS ---------- */

  const fetchReceival = async () => {
    const res = await fetch("/api/admin/couriers/receival");
    if (res.ok) {
      const data = await res.json();
      setReceivalData(data);
    }
  };

  const fetchDispatch = async () => {
    const res = await fetch("/api/admin/couriers/dispatch");
    if (res.ok) {
      const data = await res.json();
      setDispatchData(data);
    }
  };

  /* ---------- AUTO FETCH ON TAB CHANGE ---------- */

  useEffect(() => {
    if (activeView === "receival") {
      fetchReceival();
    } else {
      fetchDispatch();
    }
  }, [activeView]);

  return (
    <div style={{ padding: "16px" }}>
      {/* Header */}
      <div style={header}>
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>
          Courier Register
        </h1>

        {activeView === "receival" ? (
          <button onClick={() => setOpenReceival(true)} style={primaryButton}>
            + Add Receival
          </button>
        ) : (
          <button onClick={() => setOpenDispatch(true)} style={primaryButton}>
            + Add Dispatch
          </button>
        )}
      </div>

      {/* Toggle */}
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => setActiveView("receival")}
          style={activeView === "receival" ? activeToggle : inactiveToggle}
        >
          Receival
        </button>
        <button
          onClick={() => setActiveView("dispatch")}
          style={activeView === "dispatch" ? activeToggle : inactiveToggle}
        >
          Dispatch
        </button>
      </div>

      {/* CONTENT */}
      {activeView === "receival" ? (
        receivalData.length === 0 ? (
          <p>No receival entries yet.</p>
        ) : (
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>No.</th>
                <th>Date</th>
                <th>From</th>
                <th>Courier Service</th>
                <th>Receiver</th>
              </tr>
            </thead>
            <tbody>
              {receivalData.map((r) => (
                <tr key={r._id}>
                  <td>{r.serialNo}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.fromWho}</td>
                  <td>{r.courierService}</td>
                  <td>{r.receiver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : dispatchData.length === 0 ? (
        <p>No dispatch entries yet.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>No.</th>
              <th>Date</th>
              <th>Name</th>
              <th>Place</th>
              <th>Courier Service</th>
              <th>Dock No.</th>
            </tr>
          </thead>
          <tbody>
            {dispatchData.map((d) => (
              <tr key={d._id}>
                <td>{d.serialNo}</td>
                <td>{new Date(d.date).toLocaleDateString()}</td>
                <td>{d.name}</td>
                <td>{d.place}</td>
                <td>{d.courierService}</td>
                <td>{d.dockNo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODALS */}
      <AddReceivalModal
        open={openReceival}
        onClose={() => setOpenReceival(false)}
        onSuccess={fetchReceival}
      />

      <AddDispatchModal
        open={openDispatch}
        onClose={() => setOpenDispatch(false)}
        onSuccess={fetchDispatch}
      />
    </div>
  );
}

/* ---------- Styles ---------- */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const primaryButton = {
  padding: "8px 14px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const activeToggle = {
  padding: "6px 12px",
  marginRight: "8px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const inactiveToggle = {
  padding: "6px 12px",
  marginRight: "8px",
  backgroundColor: "#e5e7eb",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
