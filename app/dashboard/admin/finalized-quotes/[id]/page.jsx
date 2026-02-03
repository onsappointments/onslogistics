import Quote from "@/models/Quote";
import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import mongoose from "mongoose";
import ConvertToJobPanel from "./ConvertToJobPanel";
import CurrencyConverter from "@/Components/CurrencyConverter";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import EditQuoteButton from "@/Components/EditQuoteButton";
import Link from "next/link";

export default async function FinalizedQuoteDetails({ params }) {
  const id = params?.id; // ✅ don't await params

  await connectDB();

  // session + adminType
  const session = await getServerSession(authOptions);

  let adminType = null;
  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email })
      .select("adminType")
      .lean();
    adminType = user?.adminType || null;
  }

  // guard id
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900">Invalid Quote ID</h1>
          <p className="text-gray-600 mt-2">This quote link is invalid.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/admin/finalized-quotes"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Finalized Quotes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const technicalQuote = await TechnicalQuote.findById(id)
    .populate("clientQuoteId")
    .lean();


    console.log("🚀 ~ file: page.jsx:47 ~ FinalizedQuoteDetails ~ technicalQuote:", technicalQuote)

  if (!technicalQuote) {
    return (
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900">Quote not found</h1>
          <p className="text-gray-600 mt-2">
            This quote may have been deleted or you don’t have access.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/admin/finalized-quotes"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Finalized Quotes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // job lookup (fallback: technicalQuoteId OR quoteId)
  const technicalQuoteId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  const quoteId = technicalQuote.clientQuoteId?._id;

  const job = await Job.findOne({
    $or: [
      ...(technicalQuoteId ? [{ technicalQuoteId }] : []),
      ...(quoteId ? [{ quoteId }] : []),
    ],
  })
    .select("_id jobId status createdAt")
    .lean();

  const clientQuote = technicalQuote.clientQuoteId || {};
  const currencySummary = technicalQuote.currencySummary || {};
  const grandTotalINR = Number(technicalQuote.grandTotalINR || 0);

  const lineItems = Array.isArray(technicalQuote.lineItems)
    ? technicalQuote.lineItems.filter((x) => Number(x?.quantity) > 0 && Number(x?.rate) > 0)
    : [];

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-8">
      {/* Header Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <Link
              href="/dashboard/admin/finalized-quotes"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Finalized Quotes
            </Link>

            <h1 className="text-4xl font-bold text-gray-900 mt-2">Finalized Quote</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill status={technicalQuote.status} />

              {clientQuote?.company && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
                  {clientQuote.company}
                </span>
              )}

              {clientQuote?.shipmentType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200 capitalize">
                  {clientQuote.shipmentType}
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-3">
              Review client details, line items, taxes and totals. Convert to job when ready.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
            {adminType && (
              <EditQuoteButton
                quoteId={technicalQuote.clientQuoteId?._id?.toString()}
                isSuperAdmin={adminType === "super_admin"}
              />
            )}
          </div>
        </div>

        {/* Job banner */}
        {job && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-900">Job already created</p>
                <p className="text-sm text-green-800 mt-0.5">
                  Job ID: <span className="font-semibold">{job.jobId || job._id?.toString()}</span> • Status:{" "}
                  <span className="font-semibold capitalize">{job.status}</span>
                </p>
              </div>
            </div>

            <Link
              href={`/dashboard/admin/jobs/${job._id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition"
            >
              Open Job
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Client Quote */}
      <Card title="Client Quote" subtitle="Client details and shipment info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Company" value={clientQuote.company} />
          <Info label="Email" value={clientQuote.email} />
          <Info label="Shipment Type" value={clientQuote.shipmentType} />
          <Info label="From" value={clientQuote.fromCity} />
          <Info label="To" value={clientQuote.toCity} />
          <Info
            label="Route"
            value={
              clientQuote.fromCity && clientQuote.toCity
                ? `${clientQuote.fromCity} → ${clientQuote.toCity}`
                : null
            }
          />

          <Info label="From Location Type" value={clientQuote.fromLocationType} />
          <Info label="To Location Type" value={clientQuote.toLocationType} />

          {clientQuote.fromLocationType === "ICD" && (
            <Info label="From ICD" value={clientQuote.fromICD} />
          )}
          {clientQuote.toLocationType === "ICD" && <Info label="To ICD" value={clientQuote.toICD} />}
        </div>
      </Card>

      {/* Technical Quote */}
      <Card title="Technical Quote" subtitle="Line items, taxes, and totals">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr className="text-gray-700">
                <th className="px-5 py-4 font-semibold">Service</th>
                <th className="px-5 py-4 font-semibold">Qty</th>
                <th className="px-5 py-4 font-semibold">Rate</th>
                <th className="px-5 py-4 font-semibold">Curr</th>
                <th className="px-5 py-4 font-semibold">Ex. Rate</th>
                <th className="px-5 py-4 font-semibold">Base (INR)</th>
                <th className="px-5 py-4 font-semibold">IGST</th>
                <th className="px-5 py-4 font-semibold">CGST</th>
                <th className="px-5 py-4 font-semibold">SGST</th>
                <th className="px-5 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                    No payable line items found.
                  </td>
                </tr>
              ) : (
                lineItems.map((item, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition">
                    <td className="px-5 py-4 font-semibold text-gray-900">{item.head}</td>
                    <td className="px-5 py-4 text-gray-700">{item.quantity}</td>
                    <td className="px-5 py-4 text-gray-700">
                      {currencySymbol(item.currency)}
                      {Number(item.rate || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{item.currency}</td>
                    <td className="px-5 py-4 text-gray-700">{item.exchangeRate ?? "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{item.baseAmount ?? "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{item.igstPercent ?? "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{item.cgstPercent ?? "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{item.sgstPercent ?? "—"}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#0F4C81]">
                      ₹{Number(item.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* totals */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{lineItems.length}</span> payable items
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-sm font-semibold text-blue-700">Grand Total</span>
            <span className="text-xl font-extrabold text-[#0F4C81]">
              {formatINR(grandTotalINR)}
            </span>
          </div>
        </div>
      </Card>

      {/* Currency Summary */}
      <Card title="Currency Summary" subtitle="Breakdown by currency">
        <div className="space-y-4">
          {Object.values(currencySummary)
            .filter((curr) => Number(curr?.subtotal) > 0)
            .map((curr) => (
              <div
                key={curr.currency}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{curr.currency}</h3>
                  <span className="text-sm font-semibold text-gray-700">
                    Subtotal: {curr.currency} {Number(curr.subtotal || 0).toFixed(2)}
                  </span>
                </div>

                <div className="p-6 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-gray-700">
                      <tr>
                        <th className="py-2 text-left font-semibold">Service</th>
                        <th className="py-2 text-right font-semibold">Qty</th>
                        <th className="py-2 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(curr.services || [])
                        .filter((s) => Number(s?.amount) > 0)
                        .map((s, i) => (
                          <tr key={i}>
                            <td className="py-3 text-gray-800">{s.head}</td>
                            <td className="py-3 text-right text-gray-700">{s.quantity}</td>
                            <td className="py-3 text-right font-semibold text-gray-900">
                              {curr.currency} {Number(s.amount || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

          <div className="pt-2 flex justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Converter</div>
              <div className="text-lg font-semibold">
                <CurrencyConverter grandTotalINR={grandTotalINR} currencySummary={currencySummary} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Convert to job */}
      {!job && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <ConvertToJobPanel
            technicalQuoteId={technicalQuote._id.toString()}
            status={technicalQuote.status}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- UI components ---------- */

function Card({ title, subtitle, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="p-8">{children}</div>
    </section>
  );
}

function Info({ label, value }) {
  const v = value === undefined || value === null || value === "" ? "—" : value;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1 break-words">{v}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize";

  if (s === "client_approved") return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>client approved</span>;
  if (s === "sent_to_client") return <span className={`${base} bg-yellow-100 text-yellow-700 border-yellow-200`}>sent to client</span>;
  if (s === "rejected") return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>rejected</span>;

  return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>{s.replaceAll("_", " ")}</span>;
}

/* ---------- Helpers ---------- */

function currencySymbol(curr) {
  if (curr === "INR") return "₹";
  if (curr === "USD") return "$";
  if (curr === "EUR") return "€";
  return "";
}

function formatINR(n) {
  const num = Number(n || 0);
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}
