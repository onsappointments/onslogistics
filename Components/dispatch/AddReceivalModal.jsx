"use client";

import { useState } from "react";

export default function AddReceivalModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    letterNo: "",
    fromWho: "",
    subject: "",
    courierService: "",
    receiver: "",
    remarks: "",
  });

  if (!open) return null;

  const submit = async () => {
    if (!form.fromWho || !form.courierService || !form.receiver) {
      alert("From Who, Courier Service and Receiver are required");
      return;
    }

    const res = await fetch("/api/admin/couriers/receival", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSuccess?.();
      onClose();
    } else {
      alert("Failed to receive courier");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "10px" }}>Add Courier – Receival</h2>

        <input
          style={input}
          placeholder="Letter No."
          onChange={(e) => setForm({ ...form, letterNo: e.target.value })}
        />

        <input
          style={input}
          placeholder="From Who *"
          onChange={(e) => setForm({ ...form, fromWho: e.target.value })}
        />

        <input
          style={input}
          placeholder="Subject"
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <input
          style={input}
          placeholder="Courier Service *"
          onChange={(e) =>
            setForm({ ...form, courierService: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Receiver *"
          onChange={(e) => setForm({ ...form, receiver: e.target.value })}
        />

        <textarea
          style={input}
          placeholder="Remarks"
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button style={btnOutline} onClick={onClose}>
            Cancel
          </button>
          <button style={btnPrimary} onClick={submit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  background: "#fff",
  padding: "16px",
  width: "420px",
  borderRadius: "6px",
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
};

const btnPrimary = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const btnOutline = {
  padding: "6px 12px",
  background: "#e5e7eb",
  border: "none",
  cursor: "pointer",
};
