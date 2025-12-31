"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMPORT_HEADS, EXPORT_HEADS } from "@/constants/expenditureHeads";

export default function TechnicalQuotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [quote, setQuote] = useState(null);
  const [charges, setCharges] = useState([]);
  const [status, setStatus] = useState("draft"); // draft | sent_to_client
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/admin/quotes/${id}`);
      const data = await res.json();

      setQuote(data.quote);

      if (data.technicalQuote) {
        setCharges(data.technicalQuote.lineItems);
        setStatus(data.technicalQuote.status);
      } else {
        const heads =
          data.quote.shipmentType === "import"
            ? IMPORT_HEADS
            : EXPORT_HEADS;

        setCharges(
          heads.map((head) => ({
            head,
            description: "",
            serviceRequired: false,
            serviceDone: false,
            rate: 0,
            quantity: 1,
            totalAmount: 0,
          }))
        );
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const isFinal = status === "sent_to_client";

  /* ---------------- UPDATE LINE ---------------- */
  const updateCharge = (index, field, value) => {
    if (isFinal) return;

    const updated = [...charges];
    updated[index] = { ...updated[index], [field]: value };

    const rate = Number(updated[index].rate || 0);
    const quantity = Number(updated[index].quantity || 0);
    updated[index].totalAmount = rate * quantity;

    setCharges(updated);
  };

  /* ---------------- TOTALS ---------------- */
  const subtotal = charges.reduce(
    (sum, c) => sum + Number(c.totalAmount || 0),
    0
  );

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  /* ---------------- SAVE DRAFT ---------------- */
  const saveDraft = async () => {
    await fetch("/api/admin/technical-quotes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: id,
        shipmentType: quote.shipmentType,
        lineItems: charges,
        status: "draft",
      }),
    });

    alert("Technical quote saved as draft");
    router.push(`/dashboard/admin/quotes/${id}`);
  };

  /* ---------------- FINALIZE ---------------- */
  const finalizeQuote = async () => {
    const confirm = window.confirm(
      "Once sent to client, this quote cannot be edited. Continue?"
    );
    if (!confirm) return;

    await fetch("/api/admin/technical-quotes/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId: id }),
    });

    alert("Technical quote sent to client");
    router.push(`/dashboard/admin/quotes/${id}`);
  };

  if (loading) return <p className="p-10">Loading...</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">
            Technical Quote ({quote.shipmentType.toUpperCase()})
          </h1>
          <p className="text-gray-600">
            {quote.company} • {quote.fromCity} → {quote.toCity}
          </p>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            isFinal
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isFinal ? "Sent to Client" : "Draft"}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Service</th>
              <th className="p-3">Description</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>

          <tbody>
            {charges.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-medium">{c.head}</td>

                <td className="p-3">
                  <input
                    value={c.description}
                    disabled={isFinal}
                    onChange={(e) =>
                      updateCharge(i, "description", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 disabled:bg-gray-100"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="number"
                    value={c.rate}
                    disabled={isFinal}
                    onChange={(e) =>
                      updateCharge(i, "rate", e.target.value)
                    }
                    className="w-24 border rounded px-2 py-1 disabled:bg-gray-100"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="number"
                    value={c.quantity}
                    disabled={isFinal}
                    onChange={(e) =>
                      updateCharge(i, "quantity", e.target.value)
                    }
                    className="w-16 border rounded px-2 py-1 disabled:bg-gray-100"
                  />
                </td>

                <td className="p-3 font-semibold">
                  ₹{Number(c.totalAmount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="mt-8 max-w-md ml-auto bg-gray-50 p-6 rounded-xl">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>GST (18%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t pt-3">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex gap-4">
        {!isFinal && (
          <>
            <button
              onClick={saveDraft}
              className="px-6 py-3 rounded bg-blue-600 text-white"
            >
              Save Draft
            </button>

            <button
              onClick={finalizeQuote}
              className="px-6 py-3 rounded bg-green-600 text-white"
            >
              Finalize & Send to Client
            </button>
          </>
        )}

        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded border"
        >
          Back
        </button>
      </div>
    </div>
  );
}
