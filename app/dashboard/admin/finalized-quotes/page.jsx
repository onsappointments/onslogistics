import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import FilterTabs from "@/Components/FilterTabs.jsx";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function statusBadge(status) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize";
  if (status === "client_approved")
    return `${base} bg-green-100 text-green-700 border-green-200`;
  if (status === "sent_to_client")
    return `${base} bg-red-50 text-red-700 border-red-200`;
  return `${base} bg-gray-100 text-gray-700 border-gray-200`;
}

function formatINR(n) {
  const num = Number(n || 0);
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export default async function FinalizedQuotesPage({ searchParams }) {
  await connectDB();
  const params = await searchParams;

  const status = params?.status || null;
  const show = params?.show || null; // active_jobs

  let matchStage = {};

  // 1) filter logic
  if (show === "active_jobs") {
    // handled later (job exists)
  } else if (status) {
    matchStage.status = status;
  } else {
    matchStage.status = { $in: ["sent_to_client", "client_approved"] };
  }

  // 2) pipeline
  const quotes = await TechnicalQuote.aggregate([
    { $match: matchStage },

    {
      $match: {
        grandTotalINR: { $gt: 0 },
        "clientQuote.toCity": { $ne: "" },
        "clientQuote.fromCity": { $ne: "" },
      },
    },

    {
      $lookup: {
        from: "quotes",
        localField: "clientQuoteId",
        foreignField: "_id",
        as: "clientQuote",
      },
    },
    { $unwind: { path: "$clientQuote", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "jobs",
        localField: "clientQuote._id",
        foreignField: "quoteId",
        as: "job",
      },
    },

    show === "active_jobs"
      ? { $match: { job: { $not: { $size: 0 } } } }
      : { $match: { job: { $size: 0 } } },

    { $sort: { createdAt: -1 } },
  ]);

  const count = quotes.length;

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-8">
      {/* Header card */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Finalized Quotes</h1>
            <p className="text-gray-600 mt-2">
              Review quotes that are sent to client / approved — and optionally those converted into jobs.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Showing: {count}
              </span>

              {show === "active_jobs" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                  Converted to Jobs
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold">
                  Not converted yet
                </span>
              )}

              {status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm font-semibold capitalize">
                  Filter: {status.replaceAll("_", " ")}
                </span>
              )}
            </div>
          </div>

          <div className="">
            <FilterTabs active={show || status || "all"} />
          </div>
        </div>
      </section>

      {/* Table card */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/40 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Quotes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Click <span className="font-semibold">View</span> to open full breakdown.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            {count > 0 ? `Updated • ${new Date().toLocaleString()}` : ""}
          </div>
        </div>

        {count === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">No finalized quotes</p>
            <p className="text-sm text-gray-600 mt-1">Try switching tabs/filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-700">
                  <th className="px-8 py-4 font-semibold">Client</th>
                  <th className="px-8 py-4 font-semibold">Shipment</th>
                  <th className="px-8 py-4 font-semibold">Charges Summary</th>
                  <th className="px-8 py-4 font-semibold">Grand Total</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {quotes.map((q) => {
                  const c = q.clientQuote || {};
                  const currencySummary = q.currencySummary || {};

                  const currencyLines = Object.values(currencySummary)
                    .filter((cs) => cs?.subtotal > 0)
                    .map((cs) => `${cs.currency}: ${cs.subtotal} (INR ${cs.inrEquivalent})`);

                  return (
                    <tr key={q._id} className="hover:bg-blue-50/30 transition">
                      {/* Client */}
                      <td className="px-8 py-5 align-top">
                        <div className="font-semibold text-gray-900">{c.company || "—"}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {c.firstName || ""} {c.lastName || ""}
                        </div>
                        <div className="text-xs text-gray-500">{c.email || "—"}</div>
                        <div className="text-xs text-gray-500">{c.phone || "—"}</div>
                      </td>

                      {/* Shipment */}
                      <td className="px-8 py-5 align-top">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold capitalize">
                          {q.shipmentType || "—"}
                        </div>
                        <div className="text-xs text-gray-700 mt-3">
                          <span className="text-gray-500 font-semibold">Origin:</span>{" "}
                          {c.fromCity || "—"}
                          {c.fromCountry ? `, ${c.fromCountry}` : ""}
                        </div>
                        <div className="text-xs text-gray-700 mt-1">
                          <span className="text-gray-500 font-semibold">Destination:</span>{" "}
                          {c.toCity || "—"}
                          {c.toCountry ? `, ${c.toCountry}` : ""}
                        </div>
                      </td>

                      {/* Charges Summary */}
                      <td className="px-8 py-5 align-top">
                        {currencyLines.length > 0 ? (
                          <div className="space-y-1">
                            {currencyLines.map((l, i) => (
                              <div
                                key={i}
                                className="inline-flex items-center rounded-xl px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                              >
                                {l}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-8 py-5 align-top">
                        <span className="text-base font-bold text-[#0F4C81]">
                          {formatINR(q.grandTotalINR)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-5 align-top  whitespace-nowrap">
                        <span className={statusBadge(q.status)}>
                          {String(q.status || "").replaceAll("_", " ")}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-8 py-5 align-top text-right">
                        <Link
                          href={`/dashboard/admin/finalized-quotes/${q._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                          View
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-8 py-4 border-t border-gray-100 text-xs text-gray-500">
              💡 Tip: Use tabs to switch between Approved / Sent / Converted jobs.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
