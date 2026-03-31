"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMPORT_HEADS, EXPORT_HEADS } from "@/constants/expenditureHeads";

export default function TechnicalQuotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [quote, setQuote] = useState(null);
  const [charges, setCharges] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState(null);
  const [activeTab, setActiveTab] = useState("sale");

  /* -------------------------------------------
      LOAD QUOTE + TECHNICAL QUOTE + PURCHASE SHEET
  --------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/admin/quotes/${id}`);
      const data = await res.json();

      const q = data?.quote || data?.clientQuote || data?.data?.quote || null;

      if (!q) {
        alert("Quote not found");
        setLoading(false);
        return;
      }

      setQuote(q);

      const heads = q.shipmentType === "import" ? IMPORT_HEADS : EXPORT_HEADS;

      // ── SALE (technical quote) ──
      if (data.technicalQuote) {
        setCharges(
          (data.technicalQuote.lineItems || []).map((item) => ({
            remarks: "",
            ...item,
          })),
        );
        setStatus(data.technicalQuote.status);
      } else {
        setCharges(
          heads.map((h) => ({
            head: h,
            remarks: "",
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
          })),
        );
        setStatus("draft");
      }

      // ── PURCHASE SHEET ──
      const emptyPurchaseHeads = heads.map((h) => ({
        head: h,
        remarks: "",
        vendor: "",
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
      }));

      try {
        const purchaseRes = await fetch(
          `/api/admin/purchase/purchase-sheet?quoteId=${id}`,
        );
        const purchaseData = await purchaseRes.json();

        if (purchaseData?.lineItems?.length > 0) {
          // Merge saved data with defaults so new fields are never undefined
          setPurchaseItems(
            purchaseData.lineItems.map((item) => ({
              currency: "INR",
              exchangeRate: 1,
              igstPercent: 0,
              igstAmount: 0,
              cgstPercent: 0,
              cgstAmount: 0,
              sgstPercent: 0,
              sgstAmount: 0,
              baseAmount: 0,
              ...item,
            })),
          );
        } else {
          setPurchaseItems(emptyPurchaseHeads);
        }
      } catch {
        setPurchaseItems(emptyPurchaseHeads);
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
        setPermission(p);
      } catch (err) {
        console.error("Permission check failed:", err);
      }
    };
    loadPermission();
  }, [id]);

  /* -------------------------------------------
      EDIT LOCK LOGIC
  --------------------------------------------- */
  const isSuperAdmin = permission?.role === "super_admin";
  const isNewQuote = !status || status === "draft";
  const canEdit = isSuperAdmin || permission?.canEdit === true || isNewQuote;
  const isFinalLocked =
    (status === "sent_to_client" || status === "client_approved") && !canEdit;

  /* -------------------------------------------
      UPDATE SALE LINE
  --------------------------------------------- */
  const updateSaleLine = (index, field, value) => {
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
      row.baseAmount + row.igstAmount + row.cgstAmount + row.sgstAmount;

    updated[index] = row;
    setCharges(updated);
  };

  /* -------------------------------------------
      UPDATE PURCHASE LINE
  --------------------------------------------- */
  const updatePurchaseLine = (index, field, value) => {
    const updated = [...purchaseItems];
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
      row.baseAmount + row.igstAmount + row.cgstAmount + row.sgstAmount;

    updated[index] = row;
    setPurchaseItems(updated);
  };

  /* -------------------------------------------
      SAVE SALE DRAFT
  --------------------------------------------- */
  const saveDraft = async () => {
    if (isFinalLocked) {
      alert("You don't have permission to edit.");
      return;
    }

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
      SAVE PURCHASE SHEET
  --------------------------------------------- */
  const savePurchaseSheet = async () => {
    await fetch("/api/admin/purchase/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: id,
        lineItems: purchaseItems,
      }),
    });
    alert("Purchase sheet saved");
  };

  /* -------------------------------------------
      FINALIZE & SEND
  --------------------------------------------- */
  const finalizeQuote = async () => {
    if (isFinalLocked) {
      alert("You don't have permission to finalize this quote");
      return;
    }

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
      TOTALS — SALE
  --------------------------------------------- */
  const subtotal = charges.reduce((s, i) => s + (i.baseAmount || 0), 0);
  const igstTotal = charges.reduce((s, i) => s + (i.igstAmount || 0), 0);
  const cgstTotal = charges.reduce((s, i) => s + (i.cgstAmount || 0), 0);
  const sgstTotal = charges.reduce((s, i) => s + (i.sgstAmount || 0), 0);
  const grandTotal = subtotal + igstTotal + cgstTotal + sgstTotal;

  /* -------------------------------------------
      TOTALS — PURCHASE
  --------------------------------------------- */
  const purchaseSubtotal = purchaseItems.reduce(
    (s, i) => s + (i.baseAmount || 0),
    0,
  );
  const purchaseIgstTotal = purchaseItems.reduce(
    (s, i) => s + (i.igstAmount || 0),
    0,
  );
  const purchaseCgstTotal = purchaseItems.reduce(
    (s, i) => s + (i.cgstAmount || 0),
    0,
  );
  const purchaseSgstTotal = purchaseItems.reduce(
    (s, i) => s + (i.sgstAmount || 0),
    0,
  );
  const totalPurchaseCost = purchaseItems.reduce(
    (s, i) => s + (i.totalAmount || 0),
    0,
  );
  const totalProfit = grandTotal - totalPurchaseCost;
  const profitMargin =
    grandTotal > 0 ? Math.round((totalProfit / grandTotal) * 100) : 0;

  /* -------------------------------------------
      UI
  --------------------------------------------- */
  if (loading) return <p className="p-10">Loading…</p>;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Technical Quote</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("sale")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "sale"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sale Quote
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Sent to Client
          </span>
        </button>
        <button
          onClick={() => setActiveTab("purchase")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "purchase"
              ? "border-yellow-500 text-yellow-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Purchase Sheet
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Internal Only
          </span>
        </button>
      </div>

      {/* ── SALE TAB ── */}
      {activeTab === "sale" && (
        <>
          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Service</th>
                  <th className="p-2">Remarks</th>
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
                    <td className="p-2 font-medium">{c.head}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.remarks}
                        onChange={(e) =>
                          updateSaleLine(i, "remarks", e.target.value)
                        }
                        className="border w-24 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        min={0}
                        type="number"
                        value={c.quantity}
                        onChange={(e) =>
                          updateSaleLine(i, "quantity", e.target.value)
                        }
                        className="border w-16 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        min={0}
                        type="number"
                        value={c.rate}
                        onChange={(e) =>
                          updateSaleLine(i, "rate", e.target.value)
                        }
                        className="border w-24 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={c.currency}
                        onChange={(e) =>
                          updateSaleLine(i, "currency", e.target.value)
                        }
                        className="border p-1 rounded"
                        disabled={isFinalLocked}
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
                          updateSaleLine(i, "exchangeRate", e.target.value)
                        }
                        className="border w-20 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        min={0}
                        type="number"
                        value={c.igstPercent}
                        onChange={(e) =>
                          updateSaleLine(i, "igstPercent", e.target.value)
                        }
                        className="border w-16 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        min={0}
                        type="number"
                        value={c.cgstPercent}
                        onChange={(e) =>
                          updateSaleLine(i, "cgstPercent", e.target.value)
                        }
                        className="border w-16 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        min={0}
                        type="number"
                        value={c.sgstPercent}
                        onChange={(e) =>
                          updateSaleLine(i, "sgstPercent", e.target.value)
                        }
                        className="border w-16 p-1 rounded"
                        disabled={isFinalLocked}
                      />
                    </td>
                    <td className="p-2 font-semibold text-right">
                      ₹{(c.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sale Totals */}
          <div className="mt-6 max-w-md ml-auto bg-gray-50 p-4 rounded-xl">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>IGST: ₹{igstTotal.toFixed(2)}</p>
            <p>CGST: ₹{cgstTotal.toFixed(2)}</p>
            <p>SGST: ₹{sgstTotal.toFixed(2)}</p>
            <p className="font-bold border-t mt-2 pt-2">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </p>
          </div>

          {/* Sale Buttons */}
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
        </>
      )}

      {/* ── PURCHASE TAB ── */}
      {activeTab === "purchase" && (
        <>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
            This sheet is for internal use only and is never shared with the
            client. Track your vendor costs here to calculate profit per job.
          </div>

          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="p-2 text-left">Service</th>
                  <th className="p-2">Vendor</th>
                  <th className="p-2">Remarks</th>
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
                {purchaseItems.map((p, i) => {
                  const saleRow = charges[i];
                  const saleTotal = saleRow?.totalAmount || 0;
                  const rowProfit = saleTotal - (p.totalAmount || 0);

                  return (
                    <tr key={i} className="border-t">
                      <td className="p-2 font-medium">{p.head}</td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={p.vendor || ""}
                          onChange={(e) =>
                            updatePurchaseLine(i, "vendor", e.target.value)
                          }
                          className="border w-28 p-1 rounded"
                          placeholder="Vendor"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={p.remarks || ""}
                          onChange={(e) =>
                            updatePurchaseLine(i, "remarks", e.target.value)
                          }
                          className="border w-24 p-1 rounded"
                          placeholder="Notes"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          min={0}
                          type="number"
                          value={p.quantity || 0}
                          onChange={(e) =>
                            updatePurchaseLine(i, "quantity", e.target.value)
                          }
                          className="border w-16 p-1 rounded"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          min={0}
                          type="number"
                          value={p.rate || 0}
                          onChange={(e) =>
                            updatePurchaseLine(i, "rate", e.target.value)
                          }
                          className="border w-24 p-1 rounded"
                        />
                      </td>

                      <td className="p-2">
                        <select
                          value={p.currency || "INR"}
                          onChange={(e) =>
                            updatePurchaseLine(i, "currency", e.target.value)
                          }
                          className="border p-1 rounded"
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
                          value={p.exchangeRate || 1}
                          onChange={(e) =>
                            updatePurchaseLine(
                              i,
                              "exchangeRate",
                              e.target.value,
                            )
                          }
                          className="border w-20 p-1 rounded"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          min={0}
                          type="number"
                          value={p.igstPercent || 0}
                          onChange={(e) =>
                            updatePurchaseLine(i, "igstPercent", e.target.value)
                          }
                          className="border w-16 p-1 rounded"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          min={0}
                          type="number"
                          value={p.cgstPercent || 0}
                          onChange={(e) =>
                            updatePurchaseLine(i, "cgstPercent", e.target.value)
                          }
                          className="border w-16 p-1 rounded"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          min={0}
                          type="number"
                          value={p.sgstPercent || 0}
                          onChange={(e) =>
                            updatePurchaseLine(i, "sgstPercent", e.target.value)
                          }
                          className="border w-16 p-1 rounded"
                        />
                      </td>

                      <td className="p-2 font-semibold text-orange-700">
                        ₹{(p.totalAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Purchase Totals */}
          <div className="mt-6 flex gap-6 justify-end flex-wrap">
            <div className="max-w-xs w-full bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <p className="text-xs text-yellow-700 uppercase font-medium mb-2">
                Internal Summary
              </p>
              <p>Subtotal: ₹{purchaseSubtotal.toFixed(2)}</p>
              <p>IGST: ₹{purchaseIgstTotal.toFixed(2)}</p>
              <p>CGST: ₹{purchaseCgstTotal.toFixed(2)}</p>
              <p>SGST: ₹{purchaseSgstTotal.toFixed(2)}</p>
              <p className="border-t mt-2 pt-2">
                Total Purchase Cost: ₹{totalPurchaseCost.toFixed(2)}
              </p>
              <p>Sale Revenue: ₹{grandTotal.toFixed(2)}</p>
              <p
                className={`font-bold border-t mt-2 pt-2 ${
                  totalProfit >= 0 ? "text-green-700" : "text-red-600"
                }`}
              >
                Net Profit: ₹{totalProfit.toFixed(2)} ({profitMargin}%)
              </p>
            </div>
          </div>

          {/* Purchase Save Button */}
          <div className="mt-8">
            <button onClick={savePurchaseSheet} className="btn-primary">
              Save Purchase Sheet
            </button>
          </div>
        </>
      )}
    </div>
  );
}
