"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n) {
  return parseFloat(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function numToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function h(x) {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x/10)]+(x%10?" "+ones[x%10]:"");
    return ones[Math.floor(x/100)]+" Hundred"+(x%100?" "+h(x%100):"");
  }
  if (!n) return "Zero";
  const p = Math.round((n%1)*100), r = Math.floor(n);
  let rem = r, w = "";
  if (rem >= 10000000){ w += h(Math.floor(rem/10000000))+" Crore "; rem %= 10000000; }
  if (rem >= 100000)  { w += h(Math.floor(rem/100000))  +" Lakh ";  rem %= 100000; }
  if (rem >= 1000)    { w += h(Math.floor(rem/1000))    +" Thousand "; rem %= 1000; }
  if (rem > 0) w += h(rem);
  return "Indian Rupees "+w.trim()+(p?" and "+h(p)+" paise":"")+" Only";
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v+"T00:00:00");
  if (isNaN(d)) return v;
  return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"2-digit"}).replace(/ /g,"-");
}

/** Compute totals supporting IGST + CGST/SGST per line */
function calcTotals(items = []) {
  let sub = 0, cgst = 0, sgst = 0, igst = 0;
  items.forEach(it => {
    const a = parseFloat(it.amount)  || 0;
    const g = parseFloat(it.gstRate) || 0;
    sub += a;
    if (it.taxType === "igst") {
      igst += +(a * g / 100).toFixed(2);
    } else {
      const half = g / 2;
      cgst += +(a * half / 100).toFixed(2);
      sgst += +(a * half / 100).toFixed(2);
    }
  });
  return {
    subtotal:   +sub.toFixed(2),
    totalCgst:  +cgst.toFixed(2),
    totalSgst:  +sgst.toFixed(2),
    totalIgst:  +igst.toFixed(2),
    grandTotal: +(sub + cgst + sgst + igst).toFixed(2),
  };
}

const EMPTY_LINE = { description:"", subNote:"", hsnSac:"", gstRate:18, taxType:"cgst_sgst", amount:"" };

const GST_RATES = [0, 5, 12, 18, 28];

// ── Form section definitions ──────────────────────────────────────────────────
const SECTIONS = [
  { title:"Invoice Details", icon:"📄", fields:[
    { id:"invoiceNumber",      label:"Invoice No.",         placeholder:"OLIPL286/25-26",               half:true },
    { id:"date",               label:"Date",                type:"date",                                 half:true },
    { id:"sbBeNumber",         label:"S.B / B.E No.",       placeholder:"1135745 DT: 28.02.2026",        half:true },
    { id:"destination",        label:"Destination",         placeholder:"MOMBASA (KENYA)",               half:true },
    { id:"numberOfPackages",   label:"No. of Packages",     placeholder:"1382",                          half:true },
    { id:"grossWeight",        label:"Gross Weight",        placeholder:"28048.000 KGS",                 half:true },
    { id:"partyInvoiceNumber", label:"Party Invoice No.",   placeholder:"SHA2025-26/25 DT: 28.02.2026", half:true },
    { id:"blNumber",           label:"B/L No.",             placeholder:"HLCUDE1260308481",              half:true },
    { id:"description",        label:"Description",         placeholder:"EXPORT_MOMBASA (KENYA)",        half:true },
    { id:"containerNumber",    label:"Container No.",       placeholder:"HLBU3754307 20'",               half:true },
    { id:"trackingNumber",     label:"Tracking / AWB No.",  placeholder:"",                              half:true },
    { id:"dimensions",         label:"Dimensions",          placeholder:"96*89*60 cms",                  half:true },
    { id:"shipmentType",       label:"Shipment Type",       placeholder:"Export / Import / Courier",     half:true },
    { id:"exRate",             label:"Ex Rate",             placeholder:"1 USD = 95.41 INR",             half:true },
  ]},
  { title:"Consignee (Ship to)", icon:"📦", gstinLookup:"consignee", fields:[
    { id:"consigneeName",    label:"Name / Company", placeholder:"Ram Kishan Shankar Dass Agro Pvt. Ltd." },
    { id:"consigneeAddress", label:"Address",        placeholder:"Opp Railway Station, Behram, Nawan Shahar", textarea:true },
    { id:"consigneeGstin",   label:"GSTIN/UIN",      placeholder:"03AAACR7851B1ZS",  third:true },
    { id:"consigneePan",     label:"PAN/IT No.",      placeholder:"AAACR7851B",       third:true },
    { id:"consigneeState",   label:"State, Code",     placeholder:"Punjab, 03",       third:true },
  ]},
  { title:"Buyer (Bill to)", icon:"🧾", sameAs:true, gstinLookup:"buyer", fields:[
    { id:"buyerName",      label:"Name / Company",  placeholder:"Ram Kishan Shankar Dass Agro Pvt. Ltd." },
    { id:"buyerAddress",   label:"Address",         placeholder:"Opp Railway Station, Behram, Nawan Shahar", textarea:true },
    { id:"buyerGstin",     label:"GSTIN/UIN",        placeholder:"03AAACR7851B1ZS",  quarter:true },
    { id:"buyerPan",       label:"PAN/IT No.",        placeholder:"AAACR7851B",       quarter:true },
    { id:"buyerState",     label:"State, Code",       placeholder:"Punjab, 03",       quarter:true },
    { id:"placeOfSupply",  label:"Place of Supply",   placeholder:"Punjab",           quarter:true },
  ]},
  { title:"Bank Details", icon:"🏦", fields:[
    { id:"bankAccountHolder", label:"A/C Holder Name",   placeholder:"ONS Logistics India Pvt. Ltd", half:true },
    { id:"bankName",          label:"Bank Name",          placeholder:"State Bank of India",          half:true },
    { id:"bankAccountNumber", label:"A/C No.",            placeholder:"36207405735",                  half:true },
    { id:"bankIfsc",          label:"Branch & IFS Code",  placeholder:"Chd. Road, Mundian Kalan & SBIN0004633", half:true },
    { id:"bankSwift",         label:"SWIFT Code",         placeholder:"",                             half:true },
    { id:"companyPan",        label:"Company PAN",        placeholder:"AABCO1633R",                   half:true },
  ]},
  { title:"Remarks & Declaration", icon:"📝", fields:[
    { id:"remarks",     label:"Remarks",     placeholder:"BEING EXPORT_MOMBASA (KENYA)_CNTR NO…", textarea:true },
    { id:"declaration", label:"Declaration", textarea:true },
  ]},
];

// ── GSTIN auto-lookup hook ────────────────────────────────────────────────────
function useGstinLookup(form, setForm, showToast) {
  const [lookingUp, setLookingUp] = useState({ consignee: false, buyer: false });

  const lookup = useCallback(async (partyType) => {
    const gstin = partyType === "consignee" ? form.consigneeGstin : form.buyerGstin;
    if (!gstin || gstin.length !== 15) {
      showToast("Enter a valid 15-character GSTIN first", "warn");
      return;
    }
    setLookingUp(l => ({ ...l, [partyType]: true }));
    try {
      const r = await fetch(`/api/admin/gstin-lookup?gstin=${encodeURIComponent(gstin)}`);
      const d = await r.json();
      if (!d.found) {
        showToast("No record found for this GSTIN — fill manually", "info");
        return;
      }
      const prefix = partyType === "consignee" ? "consignee" : "buyer";
      setForm(f => ({
        ...f,
        [`${prefix}Name`]:    d.name    || f[`${prefix}Name`],
        [`${prefix}Address`]: d.address || f[`${prefix}Address`],
        [`${prefix}Gstin`]:   d.gstin   || f[`${prefix}Gstin`],
        [`${prefix}Pan`]:     d.pan     || f[`${prefix}Pan`],
        [`${prefix}State`]:   d.state   || f[`${prefix}State`],
      }));
      showToast(`✓ Auto-filled from GSTIN record`, "success");
    } catch {
      showToast("GSTIN lookup failed", "error");
    } finally {
      setLookingUp(l => ({ ...l, [partyType]: false }));
    }
  }, [form, setForm, showToast]);

  return { lookup, lookingUp };
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InvoiceEditorPage() {
  const { id } = useParams();
  const router  = useRouter();
  const sp      = useSearchParams();
  const invId   = sp.get("invoiceId");

  const [form,       setForm]       = useState(null);
  const [lines,      setLines]      = useState([{ ...EMPTY_LINE }]);
  const [invType,    setInvType]    = useState("proforma");
  const [savedId,    setSavedId]    = useState(invId || null);
  const [jobMeta,    setJobMeta]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [sameAsCons, setSameAsCons] = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [toast,      setToast]      = useState(null);

  const showToast = useCallback((msg, kind = "success") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const { lookup: gstinLookup, lookingUp } = useGstinLookup(form, setForm, showToast);

// ONLY the useEffect load block needs changing — drop this in to replace
// the existing one inside InvoiceEditorPage.

useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      if (invId) {
        // ── Opening an existing saved invoice by its own ID ──
        const r = await fetch(`/api/admin/invoices/${invId}`);
        const d = await r.json();
        if (d.invoice) {
          setForm(d.invoice);
          setLines(d.invoice.lineItems?.length ? d.invoice.lineItems : [{ ...EMPTY_LINE }]);
          setInvType(d.invoice.invoiceType);
          setSavedId(d.invoice._id);
        }
      } else {
        // ── Opening via job ID — defaults (+ TQ line items) come from the API ──
        const r = await fetch(`/api/admin/invoices?jobId=${id}`);
        const d = await r.json();
        setJobMeta(d.job);

        if (d.existing) {
          // A proforma was already saved for this job — load it as-is
          const inv = d.existing;
          setForm(inv);
          setLines(inv.lineItems?.length ? inv.lineItems : [{ ...EMPTY_LINE }]);
          setInvType(inv.invoiceType);
          setSavedId(inv._id);
          showToast("Existing proforma loaded", "info");
        } else {
          // Fresh invoice — populate form from job defaults,
          // and line items from TechnicalQuote (already mapped by the API)
          setForm({ ...d.defaults, invoiceNumber: "" });
          setLines(
            d.defaults.lineItems?.length
              ? d.defaults.lineItems   // ← TQ line items autofilled here
              : [{ ...EMPTY_LINE }]
          );
        }
      }
    } catch {
      showToast("Failed to load invoice data", "error");
    } finally {
      setLoading(false);
    }
  })();
}, [id, invId]);

  // ── Same-as-consignee mirror ──
  useEffect(() => {
    if (!sameAsCons || !form) return;
    setForm(f => ({
      ...f,
      buyerName:    f.consigneeName,
      buyerAddress: f.consigneeAddress,
      buyerGstin:   f.consigneeGstin,
      buyerPan:     f.consigneePan,
      buyerState:   f.consigneeState,
    }));
  }, [sameAsCons]);

  const onField = useCallback((fid, val) => {
    setForm(f => {
      const next = { ...f, [fid]: val };
      if (sameAsCons) {
        const mirror = {
          consigneeName:"buyerName", consigneeAddress:"buyerAddress",
          consigneeGstin:"buyerGstin", consigneePan:"buyerPan", consigneeState:"buyerState",
        };
        if (mirror[fid]) next[mirror[fid]] = val;
      }
      return next;
    });
  }, [sameAsCons]);

  // ── Line items ──
  const addLine    = () => setLines(l => [...l, { ...EMPTY_LINE }]);
  const removeLine = i  => setLines(l => l.length > 1 ? l.filter((_,x) => x!==i) : l);
  const onLine     = (i, k, v) => setLines(l => l.map((it, x) => x===i ? { ...it, [k]:v } : it));

  // ── Save ──
  async function save(type = invType) {
    setSaving(true);
    try {
      const totals  = calcTotals(lines);
      const payload = { ...form, invoiceType: type, jobId: id, lineItems: lines, ...totals };

      let res;
      if (savedId) {
        res = await fetch(`/api/admin/invoices/${savedId}`, {
          method:"PUT", headers:{"Content-Type":"application/json"},
          body: JSON.stringify(payload),
        });
        if (type === "tax" && invType === "proforma") {
          await fetch(`/api/admin/invoices/${savedId}`, { method:"PATCH" });
        }
      } else {
        res = await fetch("/api/admin/invoices", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (d.invoice?._id) setSavedId(d.invoice._id);
      }

      if (!res.ok) throw new Error((await res.json())?.error || "Save failed");
      setInvType(type);
      setShowModal(false);
      showToast(type==="tax" ? "✓ Tax Invoice locked" : "✓ Proforma saved", "success");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  // ── PDF export ──
  async function downloadPDF() {
    if (!savedId) { showToast("Save the invoice first before exporting PDF", "warn"); return; }
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/admin/invoices/generate-pdf?invoiceId=${savedId}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Invoice-${form?.invoiceNumber || savedId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setPdfLoading(false);
    }
  }

  const locked  = invType === "tax";
  const totals  = calcTotals(lines);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-rose-50">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-700 rounded-full animate-spin mx-auto" />
        <p className="text-rose-800 font-medium">Loading invoice data…</p>
      </div>
    </div>
  );
  if (!form) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-rose-50">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-6 h-14 bg-rose-900 text-white shadow-lg flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-rose-200 hover:text-white text-sm font-medium transition">
            ← Back
          </button>
          <div className="w-px h-5 bg-rose-600" />
          <span className="font-semibold text-sm">{locked?"Tax Invoice":"Proforma Invoice"}</span>
          {jobMeta && (
            <span className="text-rose-300 text-xs hidden sm:block">{jobMeta.jobId} · {jobMeta.company}</span>
          )}
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${locked?"bg-emerald-500 text-white":"bg-amber-400 text-amber-900"}`}>
            {locked?"TAX INVOICE • LOCKED":"PROFORMA • DRAFT"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!locked && (
            <>
              <button onClick={() => save("proforma")} disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-sm font-semibold transition disabled:opacity-50">
                {saving ? "Saving…" : "💾 Save Draft"}
              </button>
              <button onClick={() => setShowModal(true)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition">
                → Finalize Tax Invoice
              </button>
            </>
          )}
          <button onClick={downloadPDF} disabled={pdfLoading}
            className="px-4 py-1.5 rounded-lg border border-rose-400 text-rose-100 hover:bg-rose-800 text-sm font-semibold transition disabled:opacity-50">
            {pdfLoading ? "Generating…" : "⬇ Export PDF"}
          </button>
        </div>
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* FORM PANEL */}
        <div className={`w-[460px] flex-shrink-0 bg-white border-r border-rose-200 overflow-y-auto ${locked?"pointer-events-none opacity-60":""}`}>
          <div className="p-5 space-y-6 pb-10">
            {locked && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center text-amber-800 text-sm font-semibold">
                🔒 Tax Invoice is locked and cannot be edited.
              </div>
            )}

            {SECTIONS.map(sec => (
              <FormSection
                key={sec.title}
                section={sec}
                form={form}
                onField={onField}
                sameAsCons={sameAsCons}
                setSameAsCons={setSameAsCons}
                locked={locked}
                onGstinLookup={gstinLookup}
                lookingUp={lookingUp}
              />
            ))}

            {/* ── LINE ITEMS ── */}
            <div>
              <div className="text-rose-700 font-bold text-xs tracking-widest uppercase mb-3 pb-2 border-b border-rose-100">
                📋 Line Items
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse" style={{ minWidth:580 }}>
                  <thead>
                    <tr className="bg-rose-50 text-rose-700 font-semibold">
                      <th className="p-2 text-left w-5">#</th>
                      <th className="p-2 text-left">Particulars</th>
                      <th className="p-2 text-left w-18">HSN/SAC</th>
                      <th className="p-2 text-left w-16">GST %</th>
                      <th className="p-2 text-left w-24">Tax Type</th>
                      <th className="p-2 text-left w-24">Amount ₹</th>
                      <th className="w-5" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((it, i) => (
                      <tr key={i} className="border-t border-rose-100">
                        <td className="p-1 text-center text-rose-300 font-mono">{i+1}</td>
                        <td className="p-1">
                          <input className="inp w-full mb-1" placeholder="Service description"
                            value={it.description} onChange={e => onLine(i,"description",e.target.value)} />
                          <input className="inp w-full text-[10px] text-gray-500" placeholder="Sub-note (USD 1595 @ 95.41)"
                            value={it.subNote} onChange={e => onLine(i,"subNote",e.target.value)} />
                        </td>
                        <td className="p-1">
                          <input className="inp w-full" placeholder="996521"
                            value={it.hsnSac} onChange={e => onLine(i,"hsnSac",e.target.value)} />
                        </td>
                        <td className="p-1">
                          <select className="inp w-full" value={it.gstRate}
                            onChange={e => onLine(i,"gstRate",parseFloat(e.target.value))}>
                            {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </td>
                        <td className="p-1">
                          <select className="inp w-full" value={it.taxType}
                            onChange={e => onLine(i,"taxType",e.target.value)}>
                            <option value="cgst_sgst">CGST + SGST</option>
                            <option value="igst">IGST</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <input className="inp w-full font-mono" type="number" step="0.01" placeholder="0.00"
                            value={it.amount} onChange={e => onLine(i,"amount",parseFloat(e.target.value)||"")} />
                        </td>
                        <td className="p-1">
                          <button onClick={() => removeLine(i)} className="text-red-300 hover:text-red-600 font-bold">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addLine}
                className="mt-3 w-full text-xs text-rose-700 bg-rose-50 border border-dashed border-rose-300 px-4 py-2 rounded-lg hover:bg-rose-100 transition font-medium">
                + Add Line Item
              </button>

              {/* Mini totals */}
              <div className="mt-3 bg-rose-50 rounded-lg p-3 text-xs font-mono space-y-1">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{fmt(totals.subtotal)}</span></div>
                {totals.totalCgst > 0 && (
                  <div className="flex justify-between text-gray-600"><span>CGST</span><span>₹{fmt(totals.totalCgst)}</span></div>
                )}
                {totals.totalSgst > 0 && (
                  <div className="flex justify-between text-gray-600"><span>SGST</span><span>₹{fmt(totals.totalSgst)}</span></div>
                )}
                {totals.totalIgst > 0 && (
                  <div className="flex justify-between text-blue-600"><span>IGST</span><span>₹{fmt(totals.totalIgst)}</span></div>
                )}
                <div className="flex justify-between font-bold text-rose-800 border-t border-rose-200 pt-1">
                  <span>Grand Total</span><span>₹{fmt(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="flex-1 overflow-y-auto bg-stone-300 p-6 flex flex-col items-center">
          <p className="text-xs text-stone-500 mb-4 font-medium">Live Preview — matches exported PDF exactly</p>
          <InvoicePreview form={form} lines={lines} invType={invType} totals={totals} />
        </div>
      </div>

      {/* CONVERT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900">Finalize as Tax Invoice?</h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                This will <strong>permanently lock</strong> the invoice. A Tax Invoice cannot be edited after finalization.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => save("tax")} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
                {saving ? "Finalizing…" : "Yes, Finalize"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg transition
          ${toast.kind==="error"?"bg-red-600 text-white":toast.kind==="warn"?"bg-amber-500 text-white":
            toast.kind==="info"?"bg-blue-600 text-white":"bg-gray-900 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <style jsx global>{`
        .inp { border:1px solid #fca5a5; border-radius:4px; padding:4px 7px; font-size:12px;
          background:#fff5f5; outline:none; font-family:inherit; transition:border-color .15s,background .15s; }
        .inp:focus { border-color:#991b1b; background:#fff; }
      `}</style>
    </div>
  );
}

// ── Form Section ──────────────────────────────────────────────────────────────
function FormSection({ section, form, onField, sameAsCons, setSameAsCons, locked, onGstinLookup, lookingUp }) {
  const partyType = section.gstinLookup; // "consignee" | "buyer" | undefined
  const gstinField = partyType === "consignee" ? "consigneeGstin"
                   : partyType === "buyer"      ? "buyerGstin"
                   : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-100">
        <span className="text-rose-700 font-bold text-xs tracking-widest uppercase">
          {section.icon} {section.title}
        </span>
        {section.sameAs && (
          <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-600">
            <input type="checkbox" checked={sameAsCons}
              onChange={e => setSameAsCons(e.target.checked)} className="accent-rose-700" />
            Same as Consignee
          </label>
        )}
      </div>

      {/* GSTIN lookup bar */}
      {partyType && gstinField && (
        <div className="flex gap-2 mb-3">
          <input
            className="inp flex-1"
            placeholder={`Enter GSTIN to auto-fill ${partyType} details`}
            value={form[gstinField] || ""}
            onChange={e => onField(gstinField, e.target.value.toUpperCase())}
            disabled={locked}
            maxLength={15}
          />
          <button
            onClick={() => onGstinLookup(partyType)}
            disabled={locked || lookingUp[partyType]}
            className="px-3 py-1 text-xs bg-rose-700 text-white rounded-md font-semibold hover:bg-rose-600 disabled:opacity-50 transition whitespace-nowrap"
          >
            {lookingUp[partyType] ? "Looking…" : "🔍 Auto-fill"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {section.fields
          // Skip the GSTIN field if we already rendered it above in the lookup bar
          .filter(f => !(partyType && f.id === gstinField))
          .map(f => (
            <div key={f.id} className={f.textarea || (!f.half && !f.third && !f.quarter) ? "col-span-2" : "col-span-1"}>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">{f.label}</label>
              {f.textarea ? (
                <textarea className="inp w-full resize-y" style={{ minHeight:52 }}
                  placeholder={f.placeholder} value={form[f.id]||""}
                  onChange={e => onField(f.id, e.target.value)} disabled={locked} />
              ) : (
                <input type={f.type||"text"} className="inp w-full"
                  placeholder={f.placeholder} value={form[f.id]||""}
                  onChange={e => onField(f.id, e.target.value)} disabled={locked} />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

// ── Live Invoice Preview — paste this as the InvoicePreview function in page.jsx
// Replaces the old InvoicePreview entirely.
// Changes vs old version:
//   • Company name: white-space:nowrap + 12px font (was 13px, wrapped to 2 lines)
//   • Logo: 50×50 (was 60×60)
//   • Line items table: 5 columns ONLY — Sl No | Particulars | HSN/SAC | GST Rate | Amount
//     Removed: "Tax Type", "Qty Shipped", "Qty Billed" columns
//   • Amount column: base amount only — NO per-line tax breakdown
//   • subNote shown in italic below description (remarks from TQ)
//   • CGST / SGST / IGST totals: separate rows at the bottom of tbody
//   • colSpan values updated throughout to match 5-column layout

function InvoicePreview({ form, lines, invType, totals }) {
  if (!form) return null;
  const isProforma = invType !== "tax";

  // Tax summary grouped by HSN + taxType
  const taxMap = {};
  lines.forEach(it => {
    const a  = parseFloat(it.amount)  || 0;
    const g  = parseFloat(it.gstRate) || 0;
    const tt = it.taxType || "cgst_sgst";
    const k  = `${it.hsnSac || "—"}__${tt}`;
    if (!taxMap[k]) taxMap[k] = { hsn: it.hsnSac || "—", taxable: 0, gst: g, taxType: tt };
    taxMap[k].taxable += a;
  });
  const taxRows = Object.values(taxMap).map(d => {
    if (d.taxType === "igst") {
      const igst = +(d.taxable * d.gst / 100).toFixed(2);
      return { ...d, cgstRate:0, cgst:0, sgstRate:0, sgst:0, igstRate:d.gst, igst };
    }
    const half = d.gst / 2;
    const cgst = +(d.taxable * half / 100).toFixed(2);
    return { ...d, cgstRate:half, cgst, sgstRate:half, sgst:cgst, igstRate:0, igst:0 };
  });

  const hasCgstSgst = lines.some(i => (i.taxType || "cgst_sgst") === "cgst_sgst");
  const hasIgst     = lines.some(i => i.taxType === "igst");

  const BD   = "1px solid #bbb";
  const BDL  = "1px solid #ddd";
  const HBGD = "#ffe0e0";
  const TBGD = "#ffe8e8";
  const SERIF = "'Times New Roman',Times,serif";
  const MONO  = "'Courier New',Courier,monospace";

  return (
    <div style={{ width:794, background:"#fff5f5", padding:"18px 24px 14px",
      fontFamily:SERIF, fontSize:10, color:"#000", position:"relative",
      boxShadow:"0 4px 32px rgba(0,0,0,.18)", lineHeight:1.3 }}>

      {/* Watermark */}
      {isProforma && (
        <div style={{ position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%) rotate(-28deg)",
          fontSize:72, fontWeight:900, color:"rgba(180,60,60,.055)",
          pointerEvents:"none", letterSpacing:".1em", whiteSpace:"nowrap", userSelect:"none" }}>
          PROFORMA
        </div>
      )}

      {/* Dup note */}
      <div style={{ textAlign:"right", fontSize:9, fontStyle:"italic", marginBottom:2, color:"#555" }}>
        {isProforma ? "(PROFORMA INVOICE — NOT A TAX DOCUMENT)" : "(DUPLICATE FOR SUPPLIER)"}
      </div>

      {/* ── HEADER ── */}
      <div style={{ display:"flex", border:BD }}>
        {/* Logo + company — fixed width 240px */}
        <div style={{ width:240, flexShrink:0, padding:"7px 10px", borderRight:BD,
          display:"flex", alignItems:"flex-start", gap:7 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="ONS" width={50} height={50}
            style={{ objectFit:"contain", flexShrink:0, borderRadius:4 }} />
          <div>
            {/* white-space:nowrap is the key fix — keeps name on one line */}
            <div style={{ fontSize:12, fontWeight:700, color:"#8b2020", marginBottom:3,
              lineHeight:1.2, whiteSpace:"nowrap" }}>
              ONS Logistics India Pvt. Ltd
            </div>
            <div style={{ fontSize:7.5, lineHeight:1.6, color:"#333" }}>
              24, Atam Nagar, Near Radha Swami Satsang Bhawan, Gate No.7<br/>
              Mundian Kalan, Chandigarh Road, Ludhiana<br/>
              PAN NO: AABCO1633R &nbsp;|&nbsp; GSTIN/UIN: 03AABCO1633R1ZD<br/>
              State Name: Punjab, Code: 03 &nbsp;|&nbsp; CIN: U61100PB2006PTC031261<br/>
              Contact: +91-9988886511<br/>
              E-Mail: accounts@onslog.com &nbsp;|&nbsp; www.onslog.com
            </div>
          </div>
        </div>

        {/* Meta grid */}
        <div style={{ flex:1, padding:"6px 10px" }}>
          <div style={{ fontSize:14, fontWeight:700, textAlign:"center", letterSpacing:".04em", marginBottom:5 }}>
            {isProforma ? "Proforma Invoice" : "Tax Invoice"}
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:8.5 }}>
            <tbody>
              {[
                ["DB. NOTE / INVOICE NO", form.invoiceNumber || "—"],
                ["DATE",                  fmtDate(form.date)],
                ["S.B/B.E NO.",           form.sbBeNumber || "N.A"],
                ["DESTINATION",           form.destination || "—"],
                ["NO. OF PKGS.",          form.numberOfPackages || "—"],
                ["GROSS WEIGHT",          form.grossWeight || "—"],
                ["PARTY INVOICE NO.",     form.partyInvoiceNumber || "N.A"],
                ["B/L NO.",               form.blNumber || "N.A"],
                ["DESCRIPTION",           form.description || "—"],
                ["CONTAINER NO.",         form.containerNumber || "—"],
                ...(form.exRate          ? [["EX RATE",      form.exRate]]         : []),
                ...(form.trackingNumber  ? [["TRACKING NO.", form.trackingNumber]] : []),
                ...(form.dimensions      ? [["DIMENSIONS",   form.dimensions]]     : []),
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ fontWeight:700, paddingRight:6, whiteSpace:"nowrap", verticalAlign:"top", paddingBottom:1 }}>{k}</td>
                  <td style={{ paddingBottom:1, verticalAlign:"top" }}>: {v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PARTIES ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:BD, borderTop:"none" }}>
        {[
          { label:"Consignee (Ship to)", name:form.consigneeName, addr:form.consigneeAddress,
            gstin:form.consigneeGstin, pan:form.consigneePan, state:form.consigneeState },
          { label:"Buyer (Bill to)", name:form.buyerName, addr:form.buyerAddress,
            gstin:form.buyerGstin, pan:form.buyerPan, state:form.buyerState,
            extra:[["Place of Supply", form.placeOfSupply]] },
        ].map((p, i) => (
          <div key={p.label} style={{ padding:"6px 9px", borderRight: i === 0 ? BD : "none" }}>
            <div style={{ fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".04em", color:"#555", marginBottom:3 }}>{p.label}</div>
            <div style={{ fontSize:10.5, fontWeight:700, marginBottom:2 }}>{p.name || "—"}</div>
            <div style={{ fontSize:8.5, lineHeight:1.55, color:"#222" }}>
              {(p.addr || "").split("\n").map((l, j) => <span key={j}>{l}<br/></span>)}
            </div>
            <div style={{ marginTop:3, fontSize:8.5 }}>
              {[["GSTIN/UIN", p.gstin], ["PAN/IT No", p.pan], ["State Name", p.state], ...(p.extra || [])].map(([k, v]) => (
                <div key={k} style={{ display:"flex", gap:4 }}>
                  <span style={{ fontWeight:700, minWidth:88 }}>{k}</span>
                  <span>: {v || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── LINE ITEMS TABLE — 5 columns ── */}
      <table style={{ width:"100%", borderCollapse:"collapse", border:BD, borderTop:"none", fontSize:9 }}>
        <thead>
          <tr style={{ background:HBGD }}>
            <th style={{ padding:"4px 5px", border:BD, fontWeight:700, fontSize:8.5, textAlign:"center", width:24 }}>Sl No.</th>
            <th style={{ padding:"4px 5px", border:BD, fontWeight:700, fontSize:8.5, textAlign:"left" }}>Particulars</th>
            <th style={{ padding:"4px 5px", border:BD, fontWeight:700, fontSize:8.5, textAlign:"center", width:54 }}>HSN/SAC</th>
            <th style={{ padding:"4px 5px", border:BD, fontWeight:700, fontSize:8.5, textAlign:"center", width:48 }}>GST Rate</th>
            <th style={{ padding:"4px 5px", border:BD, fontWeight:700, fontSize:8.5, textAlign:"right", width:80 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((it, i) => {
            const a = parseFloat(it.amount) || 0;
            const g = parseFloat(it.gstRate) || 0;
            return (
              <tr key={i}>
                <td style={{ padding:"4px 5px", border:BDL, textAlign:"center" }}>{i + 1}</td>
                <td style={{ padding:"4px 5px", border:BDL, verticalAlign:"top" }}>
                  <div style={{ fontWeight:700, fontSize:9.5 }}>{it.description}</div>
                  {it.subNote && (
                    <div style={{ fontSize:8, color:"#555", fontStyle:"italic", marginTop:1 }}>{it.subNote}</div>
                  )}
                </td>
                <td style={{ padding:"4px 5px", border:BDL, textAlign:"center" }}>{it.hsnSac}</td>
                <td style={{ padding:"4px 5px", border:BDL, textAlign:"center" }}>{g > 0 ? `${g}%` : ""}</td>
                {/* Amount column: base amount ONLY — no per-line tax breakdown */}
                <td style={{ padding:"4px 5px", border:BDL, textAlign:"right", fontFamily:MONO }}>
                  {a > 0 ? fmt(a) : ""}
                </td>
              </tr>
            );
          })}

          {/* CGST total row */}
          {hasCgstSgst && (
            <tr>
              <td colSpan={3} style={{ border:"none", background:"transparent" }} />
              <td style={{ padding:"3px 5px", border:BDL, textAlign:"right", fontWeight:700, fontSize:8.5 }}>CGST</td>
              <td style={{ padding:"3px 5px", border:BDL, textAlign:"right", fontFamily:MONO, fontWeight:700 }}>{fmt(totals.totalCgst)}</td>
            </tr>
          )}
          {/* SGST total row */}
          {hasCgstSgst && (
            <tr>
              <td colSpan={3} style={{ border:"none", background:"transparent" }} />
              <td style={{ padding:"3px 5px", border:BDL, textAlign:"right", fontWeight:700, fontSize:8.5 }}>SGST</td>
              <td style={{ padding:"3px 5px", border:BDL, textAlign:"right", fontFamily:MONO, fontWeight:700 }}>{fmt(totals.totalSgst)}</td>
            </tr>
          )}
          {/* IGST total row */}
          {hasIgst && (
            <tr>
              <td colSpan={3} style={{ border:"none", background:"transparent" }} />
              <td style={{ padding:"3px 5px", border:BDL, textAlign:"right", fontWeight:700, fontSize:8.5 }}>IGST</td>
              <td style={{ padding:"3px 5px", border:BDL, textAlign:"right", fontFamily:MONO, fontWeight:700, color:"#1d4ed8" }}>{fmt(totals.totalIgst)}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr style={{ background:TBGD }}>
            <td colSpan={4} style={{ padding:"5px 8px", border:BD, textAlign:"right", fontWeight:700, fontSize:9.5, borderTop:"1.5px solid #aaa" }}>Total</td>
            <td style={{ padding:"5px 8px", border:BD, textAlign:"right", fontFamily:MONO, fontWeight:700, fontSize:12, borderTop:"1.5px solid #aaa" }}>
              ₹ {fmt(totals.grandTotal)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* ── AMOUNT IN WORDS ── */}
      <div style={{ border:BD, borderTop:"none", padding:"4px 9px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:8, color:"#555" }}>Amount Chargeable (in words)</div>
          <div style={{ fontSize:9.5, fontWeight:700 }}>{numToWords(totals.grandTotal)}</div>
        </div>
        <div style={{ fontSize:8, fontStyle:"italic", color:"#555" }}>E. &amp; O.E</div>
      </div>

      {/* ── TAX SUMMARY TABLE — 9 cols at 7.5px ── */}
      <table style={{ width:"100%", borderCollapse:"collapse", border:BD, borderTop:"none", fontSize:7.5 }}>
        <thead>
          <tr style={{ background:HBGD }}>
            {["HSN/SAC","Taxable Value","CGST Rate","CGST Amt","SGST/UTGST Rate","SGST/UTGST Amt","IGST Rate","IGST Amt","Total Tax Amt"].map((h, i) => (
              <th key={h} style={{ padding:"3px 4px", border:BD, fontWeight:700, textAlign:i===0?"left":"right" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {taxRows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding:"3px 4px", border:BDL }}>{r.hsn}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right", fontFamily:MONO }}>{fmt(r.taxable)}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right" }}>{r.cgstRate > 0 ? `${r.cgstRate}%` : "—"}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right", fontFamily:MONO }}>{r.cgst > 0 ? fmt(r.cgst) : "—"}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right" }}>{r.sgstRate > 0 ? `${r.sgstRate}%` : "—"}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right", fontFamily:MONO }}>{r.sgst > 0 ? fmt(r.sgst) : "—"}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right" }}>{r.igstRate > 0 ? `${r.igstRate}%` : "—"}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right", fontFamily:MONO }}>{r.igst > 0 ? fmt(r.igst) : "—"}</td>
              <td style={{ padding:"3px 4px", border:BDL, textAlign:"right", fontFamily:MONO }}>{fmt((r.cgst||0)+(r.sgst||0)+(r.igst||0))}</td>
            </tr>
          ))}
          <tr style={{ background:TBGD }}>
            <td style={{ padding:"3px 4px", border:BD, fontWeight:700, borderTop:"1px solid #aaa" }}>Total</td>
            <td style={{ padding:"3px 4px", border:BD, textAlign:"right", fontFamily:MONO, fontWeight:700, borderTop:"1px solid #aaa" }}>{fmt(totals.subtotal)}</td>
            <td style={{ padding:"3px 4px", border:BD, borderTop:"1px solid #aaa" }} />
            <td style={{ padding:"3px 4px", border:BD, textAlign:"right", fontFamily:MONO, fontWeight:700, borderTop:"1px solid #aaa" }}>{fmt(totals.totalCgst)}</td>
            <td style={{ padding:"3px 4px", border:BD, borderTop:"1px solid #aaa" }} />
            <td style={{ padding:"3px 4px", border:BD, textAlign:"right", fontFamily:MONO, fontWeight:700, borderTop:"1px solid #aaa" }}>{fmt(totals.totalSgst)}</td>
            <td style={{ padding:"3px 4px", border:BD, borderTop:"1px solid #aaa" }} />
            <td style={{ padding:"3px 4px", border:BD, textAlign:"right", fontFamily:MONO, fontWeight:700, borderTop:"1px solid #aaa" }}>{fmt(totals.totalIgst)}</td>
            <td style={{ padding:"3px 4px", border:BD, textAlign:"right", fontFamily:MONO, fontWeight:700, borderTop:"1px solid #aaa" }}>{fmt(totals.totalCgst+totals.totalSgst+totals.totalIgst)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── TAX IN WORDS ── */}
      <div style={{ border:BD, borderTop:"none", padding:"3px 9px", fontSize:8.5 }}>
        Tax Amount (in words) :{" "}
        <strong style={{ fontSize:9 }}>{numToWords(totals.totalCgst+totals.totalSgst+totals.totalIgst)}</strong>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:BD, borderTop:"none" }}>
        <div style={{ padding:"7px 9px", borderRight:BD }}>
          <div style={{ fontWeight:700, fontSize:8.5, marginBottom:3 }}>Remarks:</div>
          <div style={{ fontSize:8.5, fontStyle:"italic", lineHeight:1.5, marginBottom:7 }}>
            {(form.remarks || "").split("\n").map((l, i) => <span key={i}>{l}<br/></span>)}
          </div>
          <div style={{ display:"flex", gap:5, fontSize:8.5, marginBottom:8 }}>
            <span style={{ fontWeight:700, minWidth:88 }}>Company's PAN</span>
            <span>: {form.companyPan || "AABCO1633R"}</span>
          </div>
          <div style={{ fontWeight:700, fontSize:8.5, marginBottom:2 }}>Declaration</div>
          <div style={{ fontSize:8, fontStyle:"italic", color:"#444", lineHeight:1.5 }}>{form.declaration}</div>
        </div>
        <div style={{ padding:"7px 9px" }}>
          <div style={{ fontWeight:700, fontSize:8.5, marginBottom:4 }}>Company's Bank Details</div>
          {[
            ["A/c Holder's Name", form.bankAccountHolder],
            ["Bank Name",         form.bankName],
            ["A/c No.",           form.bankAccountNumber],
            ["Branch & IFS Code", form.bankIfsc],
            ["SWIFT Code",        form.bankSwift],
          ].map(([k, v]) => (
            <div key={k} style={{ display:"flex", gap:5, fontSize:8.5, lineHeight:1.6 }}>
              <span style={{ fontWeight:700, minWidth:96, flexShrink:0 }}>{k}</span>
              <span>: {v || ""}</span>
            </div>
          ))}
          <div style={{ textAlign:"right", marginTop:14 }}>
            <div style={{ fontSize:8, color:"#555" }}>for ONS Logistics India Pvt. Ltd</div>
            <div style={{ marginTop:28, fontSize:8.5, fontWeight:700 }}>Authorised Signatory</div>
          </div>
        </div>
      </div>

      {/* ── JURISDICTION ── */}
      <div style={{ textAlign:"center", fontSize:8.5, fontWeight:700, letterSpacing:".1em",
        borderTop:BD, padding:"4px 0 2px", marginTop:4 }}>
        SUBJECT TO LUDHIANA JURISDICTION
      </div>
      <div style={{ textAlign:"center", fontSize:7.5, color:"#888", marginTop:2 }}>
        This is a system generated invoice
      </div>
    </div>
  );
}