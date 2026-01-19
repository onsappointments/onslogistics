"use client";
import { useState } from "react";

export default function ShipmentTypeSelector({ id, current }) {
  const [value, setValue] = useState(current);
  const [loading, setLoading] = useState(false);

  async function updateType() {
    setLoading(true);

    const res = await fetch(`/api/admin/quotes/${id}/shipmentType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipmentType: value })
    });

    setLoading(false);

    if (res.ok) {
      alert("Shipment type updated");
      window.location.reload();
    } else {
      alert("Error updating shipment type");
    }
  }

  return (
    <div className="flex items-center gap-3 mt-3">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-4 py-2 border rounded-lg bg-transparent"
      >
        <option value="Not set">Not Set</option>
        <option value="export">Export</option>
        <option value="import">Import</option>
        <option value="courier">Courier</option>
      </select>

      <button
        onClick={updateType}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Apply"}
      </button>
    </div>
  );
}
