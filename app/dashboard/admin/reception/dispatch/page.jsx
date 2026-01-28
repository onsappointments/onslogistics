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
  const [serialSort, setSerialSort] = useState("asc"); 
  const [editingReceival, setEditingReceival] = useState(null);
  const [editingDispatch, setEditingDispatch] = useState(null);



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

  const sortBySerial = (data) => {
    return [...data].sort((a, b) =>
      serialSort === "asc"
        ? a.serialNo - b.serialNo
        : b.serialNo - a.serialNo
    );
  };
  const openEditReceival = (row) => {
    setEditingReceival(row);
    setOpenReceival(true);
  };
  
  const openEditDispatch = (row) => {
    setEditingDispatch(row);
    setOpenDispatch(true);
  };
  
  const deleteReceival = async (id) => {
    if (!confirm("Delete this receival entry?")) return;
  
    await fetch("/api/admin/couriers/receival", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  
    fetchReceival();
  };
  
  const deleteDispatch = async (id) => {
    if (!confirm("Delete this dispatch entry?")) return;
  
    await fetch("/api/admin/couriers/dispatch", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  
    fetchDispatch();
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
          <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() =>
                  setSerialSort(serialSort === "asc" ? "desc" : "asc")
                }
              >
                No. {serialSort === "asc" ? "▲" : "▼"}
              </th>

                <th style={thStyle}>Date</th>
                <th style={thStyle}>Letter No.</th>
                <th style={thStyle}>From</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Courier Service</th>
                <th style={thStyle}>Receiver</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortBySerial(receivalData).map((r, index) => (
                <tr key={r._id} style={zebraRow(index)}>
                  <td style={tdStyle}>{r.serialNo}</td>
                  <td style={tdStyle}>{new Date(r.date).toLocaleDateString()}</td>
                  <td style={tdStyle}>{r.letterNo || "-"}</td>
                  <td style={tdStyle}>{r.fromWho}</td>
                  <td style={tdStyle}>{r.subject || "-"}</td>
                  <td style={tdStyle}>{r.courierService}</td>
                  <td style={tdStyle}>{r.receiver}</td>
                  <td style={tdStyle}>
                   <button onClick={() => openEditReceival(r)} style={{ marginRight: 6 }}>
                      ✏️
                   </button>
                   <button onClick={() => deleteReceival(r._id)}>
                       🗑
                   </button>
                 </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        )
      ) : dispatchData.length === 0 ? (
        <p>No dispatch entries yet.</p>
      ) : (
        <div style={tableContainer}>
  <table style={tableStyle}>
    <thead>
      <tr>
      <th
        style={{ ...thStyle, cursor: "pointer" }}
        onClick={() =>
          setSerialSort(serialSort === "asc" ? "desc" : "asc")
        }
      >
        No. {serialSort === "asc" ? "▲" : "▼"}
      </th>

        <th style={thStyle}>Date</th>
        <th style={thStyle}>Name</th>
        <th style={thStyle}>Address</th>
        <th style={thStyle}>Place</th>
        <th style={thStyle}>Subject</th>
        <th style={thStyle}>Courier Service</th>
        <th style={thStyle}>Remarks</th>
        <th style={thStyle}>Dock No.</th>
        <th style={thStyle}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {sortBySerial(dispatchData).map((d, index) => (
        <tr key={d._id} style={zebraRow(index)}>
          <td style={tdStyle}>{d.serialNo}</td>
          <td style={tdStyle}>{new Date(d.date).toLocaleDateString()}</td>
          <td style={tdStyle}>{d.name}</td>
          <td style={tdStyle}>{d.address}</td>
          <td style={tdStyle}>{d.place}</td>
          <td style={tdStyle}>{d.subject || "-"}</td>
          <td style={tdStyle}>{d.courierService}</td>
          <td style={tdStyle}>{d.remarks || "-"}</td>
          <td style={tdStyle}>{d.dockNo || "-"}</td>
          <td style={tdStyle}>
           <button onClick={() => openEditDispatch(d)} style={{ marginRight: 6 }}>
             ✏️
           </button>
           <button onClick={() => deleteDispatch(d._id)}>
             🗑
           </button>
         </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

      )}

      {/* MODALS */}
      <AddReceivalModal
        open={openReceival}
        initialData={editingReceival}
        onClose={() => {
          setOpenReceival(false);
          setEditingReceival(null);
        }}
        onSuccess={fetchReceival}
      />

      
      <AddDispatchModal
        open={openDispatch}
        initialData={editingDispatch}
        onClose={() => {
          setOpenDispatch(false);
          setEditingDispatch(null);
        }}
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
const tableContainer = {
  background: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const thStyle = {
  background: "#f3f4f6",
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const zebraRow = (index) => ({
  background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
});

