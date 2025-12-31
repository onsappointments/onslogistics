"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    company: "",
    shipmentType: "export",
    modeOfShipment: "Sea",
    containerType: "",
    fromCity: "",
    toCity: "",
    commodity: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    setLoading(true);

    const res = await fetch("/api/admin/jobs/create-manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to create job");
      return;
    }

    alert("Job created successfully");
    router.push(`/dashboard/admin/jobs/${data.job._id}`);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">
        Create Job (Manual)
      </h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <Input label="Company" value={form.company} onChange={v => update("company", v)} />

        <Select
          label="Shipment Type"
          value={form.shipmentType}
          onChange={v => update("shipmentType", v)}
          options={["export", "import"]}
        />

        <Select
          label="Mode of Shipment"
          value={form.modeOfShipment}
          onChange={v => update("modeOfShipment", v)}
          options={["Sea", "Air", "Road"]}
        />

        <Input label="Container Type" value={form.containerType} onChange={v => update("containerType", v)} />
        <Input label="From City" value={form.fromCity} onChange={v => update("fromCity", v)} />
        <Input label="To City" value={form.toCity} onChange={v => update("toCity", v)} />
        <Input label="Commodity" value={form.commodity} onChange={v => update("commodity", v)} />

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
