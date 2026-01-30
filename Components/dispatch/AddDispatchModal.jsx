"use client";

import { useState, useEffect } from "react";

export default function AddDispatchModal({
  open,
  onClose,
  onSuccess,
  initialData = null,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    place: "",
    subject: "",
    courierService: "",
    dockNo: "",
    remarks: "",
    handoverby: "",
    handoverto: "",
    status:"" ,
    delivereddate:"",
    _id: null, // 👈 needed for edit
  });

  /* ===================== PRELOAD DATA FOR EDIT ===================== */

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        address: initialData.address || "",
        place: initialData.place || "",
        subject: initialData.subject || "",
        courierService: initialData.courierService || "",
        dockNo: initialData.dockNo || "",
        remarks: initialData.remarks || "",
        handoverby: initialData.handoverby || "",
        handoverto: initialData.handoverto || "",
        status: initialData.status || "",
        delivereddate: initialData.delivereddate || "",
        _id: initialData._id,
      });
    } else {
      // reset when adding new
      setForm({
        name: "",
        address: "",
        place: "",
        subject: "",
        courierService: "",
        dockNo: "",
        remarks: "",
        handoverby: "",
        handoverto: "",
        status:"" ,
        delivereddate:"",
        _id: null,
      });
    }
  }, [initialData]);

  if (!open) return null;

  /* ===================== SUBMIT ===================== */

  const submit = async () => {
    if (saving) return;

    if (!form.name || !form.address || !form.place || !form.courierService) {
      alert("Name, Address, Place and Courier Service are required");
      return;
    }

    setSaving(true);

    try {
      const method = form._id ? "PUT" : "POST";

      const res = await fetch("/api/admin/couriers/dispatch", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Failed to save dispatch");
    } finally {
      setSaving(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "10px" }}>
          {form._id ? "Edit Courier – Dispatch" : "Add Courier – Dispatch"}
        </h2>

        <div style={formContainer}>
          <input
            style={input}
            placeholder="Name *"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            style={input}
            placeholder="Address *"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Place *"
            value={form.place}
            onChange={(e) =>
              setForm({ ...form, place: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Courier Service *"
            value={form.courierService}
            onChange={(e) =>
              setForm({ ...form, courierService: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Dock No."
            value={form.dockNo}
            onChange={(e) =>
              setForm({ ...form, dockNo: e.target.value })
            }
          />

          <textarea
            style={input}
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />
          <input
            style={input}
            placeholder="Handover By"
            value={form.handoverby}
            onChange={(e) =>
              setForm({ ...form, handoverby: e.target.value })
            }
          />
          <input
            style={input}
            placeholder="Handover To"
            value={form.handoverto}
            onChange={(e) =>
              setForm({ ...form, handoverto: e.target.value })
            }
          />
          <input
            style={input}
            placeholder="Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          />
          <input
            style={input}
            placeholder="Delivered Date"
            value={form.delivereddate}
            onChange={(e) =>
              setForm({ ...form, delivereddate: e.target.value })
            }
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
          <button style={btnOutline} onClick={onClose} disabled={saving}>
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={saving}
            style={{
              ...btnPrimary,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving
              ? "Saving..."
              : form._id
              ? "Update"
              : "Save"}
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
  padding: "16px",
};

const modal = {
  background: "#fff",
  padding: "20px",
  width: "100%",
  maxWidth: "500px",
  maxHeight: "90vh",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
};

const formContainer = {
  overflowY: "auto",
  maxHeight: "calc(90vh - 120px)",
  paddingRight: "8px",
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
  boxSizing: "border-box",
};

const btnPrimary = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnOutline = {
  padding: "6px 12px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};