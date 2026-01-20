"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMPORT_HEADS, EXPORT_HEADS } from "@/constants/expenditureHeads";

export default function TechnicalQuotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [quote, setQuote] = useState(null);
  const [charges, setCharges] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);

  const [permission, setPermission] = useState(null);

  /* -------------------------------------------
      FETCH QUOTE + TECHNICAL QUOTE
  --------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/admin/quotes/${id}`);
      const data = await res.json();

      console.log("📦 Quote API Response:", data);

      const q =
        data?.quote ||
        data?.clientQuote ||
        data?.data?.quote ||
        null;

      if (!q) {
        alert("Quote not found");
        setLoading(false);
        return;
      }

      setQuote(q);

      if (data.technicalQuote) {
        setCharges(data.technicalQuote.lineItems || []);
        setStatus(data.technicalQuote.status || "draft");
      } else {
        const shipmentType = q.shipmentType;

        const heads =
          shipmentType === "import" ? IMPORT_HEADS : EXPORT_HEADS;

        setCharges(
          heads.map((head) => ({
            head,
            quantity: 0,
            rate: 0,
            currency: "INR",
            exchangeRate: 1,

            igstPercent: 0,
            igstAmount: 0,
            cgstPercent: 0,
            cgstAmount: 0,
            sgstPercent: 0,
            sgstAmount: 0,

            baseAmount: 0,
            totalAmount: 0,
          }))
        );
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);


  /* -------------------------------------------
      FETCH PERMISSION
  --------------------------------------------- */
  useEffect(() => {
    const loadPermission = async () => {
      try {
        const res = await fetch(`/api/quotes/${id}/check-permission`);
        const p = await res.json();
        console.log("🔐 Permission:", p);
        setPermission(p);
      } catch (err) {
        console.error("Permission error", err);
      }
    };

    loadPermission();
  }, [id]);


  /* -------------------------------------------
      CAN EDIT LOGIC
  --------------------------------------------- */

  // super admin can always edit
  const isSuperAdmin = quote?.createdByRole === "super_admin";

  // approved user can edit
  const canEdit = isSuperAdmin || permission?.canEdit === true;

  // lock only applies if NOT allowed to edit
  const isFinalLocked =
    (status === "sent_to_client" ||
      status === "client_approved") &&
    !canEdit;



  /* -------------------------------------------
      UPDATE LINE VALUE
  --------------------------------------------- */
  const updateLine = (index, field, value) => {
    if (isFinalLocked) return;

    const updated = [...charges];
    const row = { ...updated[index], [field]: value };

    const qty = Number(row.quantity || 0);
    const rate = Number(row.rate || 0);
    const fx = Number(row.exchangeRate || 1);

    const base = qty * rate * fx;

    row.baseAmount = base;
    row.igstAmount = base * (Number(row.igstPercent || 0) / 100);
    row.cgstAmount = base * (Number(row.cgstPercent || 0) / 100);
    row.sgstAmount = base * (Number(row.sgstPercent || 0) / 100);

    row.totalAmount =
      row.baseAmount +
      row.igstAmount +
      row.cgstAmount +
      row.sgstAmount;

    updated[index] = row;
    setCharges(updated);
  };


  /* -------------------------------------------
      SAVE DRAFT
  --------------------------------------------- */
  const saveDraft = async () => {
    if (isFinalLocked) return alert("You cannot edit this quote");

    await fetch("/api/admin/technical-quotes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: id,
        shipmentType: quote.shipmentType,
        lineItems: charges,
      }),
    });

    alert("Draft saved");
    router.push(`/dashboard/admin/quotes/${id}`);
  };


  /* -------------------------------------------
      FINALIZE & SEND
  --------------------------------------------- */
  const finalizeQuote = async () => {
    if (isFinalLocked) return alert("You cannot finalize this quote");

    if (!confirm("After sending, quote will lock. Continue?")) return;

    await fetch("/api/admin/technical-quotes/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId: id }),
    });

    alert("Sent to client");
    router.push(`/dashboard/admin/quotes/${id}`);
  };


  /* -------------------------------------------
      LOADING
  --------------------------------------------- */
  if (loading) return <p className="p-10">Loading…</p>;


  /* -------------------------------------------
      TOTALS
  --------------------------------------------- */
  const subtotal = charges.reduce((s, i) => s + i.baseAmount, 0);
  const igstTotal = charges.reduce((s, i) => s + i.igstAmount, 0);
  const cgstTotal = charges.reduce((s, i) => s + i.cgstAmount, 0);
  const sgstTotal = charges.reduce((s, i) => s + i.sgstAmount, 0);
  const grandTotal = subtotal + igstTotal + cgstTotal + sgstTotal;


  /* -------------------------------------------
      UI
  --------------------------------------------- */
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">
        Technical Quote
      </h1>

      <div className="overflow-x-auto bg-white border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Service</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Curr</th>
              <th className="p-2">Ex.Rate</th>
              <th className="p-2">IGST %</th>
              <th className="p-2">CGST %</th>
              <th className="p-2">SGST %</th>
              <th className="p-2">Total (INR)</th>
            </tr>
          </thead>

          <tbody>
            {charges.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{c.head}</td>

                <td className="p-2">
                  <input
                    min={0}
                    type="number"
                    value={c.quantity}
                    onChange={(e) =>
                      updateLine(i, "quantity", e.target.value)
                    }
                    className="border w-16 p-1"
                    disabled={isFinalLocked}
                  />
                </td>

                <td className="p-2">
                  <input
                    min={0}
                    type="number"
                    value={c.rate}
                    onChange={(e) =>
                      updateLine(i, "rate", e.target.value)
                    }
                    className="border w-24 p-1"
                    disabled={isFinalLocked}
                  />
                </td>

                <td className="p-2">
                  <select
                    value={c.currency}
                    onChange={(e) =>
                      updateLine(i, "currency", e.target.value)
                    }
                    disabled={isFinalLocked}
                    className="border p-1"
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </td>

                <td className="p-2">
                  <input
                    min={0}
                    type="number"
                    value={c.exchangeRate}
                    onChange={(e) =>
                      updateLine(i, "exchangeRate", e.target.value)
                    }
                    className="border w-20 p-1"
                    disabled={isFinalLocked}
                  />
                </td>

                <td className="p-2">
                  <input
                    min={0}
                    type="number"
                    value={c.igstPercent}
                    onChange={(e) =>
                      updateLine(i, "igstPercent", e.target.value)
                    }
                    className="border w-16 p-1"
                    disabled={isFinalLocked}
                  />
                </td>

                <td className="p-2">
                  <input
                    min={0}
                    type="number"
                    value={c.cgstPercent}
                    onChange={(e) =>
                      updateLine(i, "cgstPercent", e.target.value)
                    }
                    className="border w-16 p-1"
                    disabled={isFinalLocked}
                  />
                </td>

                <td className="p-2">
                  <input
                    min={0}
                    type="number"
                    value={c.sgstPercent}
                    onChange={(e) =>
                      updateLine(i, "sgstPercent", e.target.value)
                    }
                    className="border w-16 p-1"
                    disabled={isFinalLocked}
                  />
                </td>

                <td className="p-2 font-semibold">
                  ₹{c.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="mt-6 max-w-md ml-auto bg-gray-50 p-4 rounded">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>IGST: ₹{igstTotal.toFixed(2)}</p>
        <p>CGST: ₹{cgstTotal.toFixed(2)}</p>
        <p>SGST: ₹{sgstTotal.toFixed(2)}</p>
        <p className="font-bold border-t mt-2 pt-2">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      {!isFinalLocked && (
        <div className="mt-8 flex gap-4">
          <button onClick={saveDraft} className="btn-primary">
            Save Draft
          </button>
          <button onClick={finalizeQuote} className="btn-success">
            Finalize & Send
          </button>
        </div>
      )}
    </div>
  );
}
