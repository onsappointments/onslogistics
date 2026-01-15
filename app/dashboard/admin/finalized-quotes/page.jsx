import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import FilterTabs from "@/Components/FilterTabs.jsx";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FinalizedQuotesPage({ searchParams }) {
  await connectDB();
  const params = await searchParams;
  const status = params?.status;

  const quotes = await TechnicalQuote.aggregate([
    {
      $match: status
      ? { status }
        : { status: { $in: ["sent_to_client", "client_approved"] } },
    },

    // Only show if grandTotalINR > 0
    {
      $match: {
        grandTotalINR: { $gt: 0 },
        "clientQuote.toCity": {$ne : ""},
        "clientQuote.fromCity": {$ne : ""},
      },
    },

    // Attach client quote
    {
      $lookup: {
        from: "quotes",
        localField: "clientQuoteId",
        foreignField: "_id",
        as: "clientQuote",
      },
    },
    { $unwind: { path: "$clientQuote", preserveNullAndEmptyArrays: true } },

    // Attach job
    {
      $lookup: {
        from: "jobs",
        localField: "clientQuote._id",
        foreignField: "quoteId",
        as: "job",
      },
    },

    // Hide if converted to job
    {
      $match: {
        $or: [
          { status: "sent_to_client" },
          { status: "client_approved", job: { $size: 0 } },
        ],
      },
    },

    { $sort: { createdAt: -1 } },
  ]);


  console.log("📦 Quotes received:", quotes);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Finalized Quotes</h1>

      <FilterTabs active={status || "all"} />

      <div className="bg-white rounded-xl shadow overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Client</th>
              <th className="p-4">Shipment Details</th>
              <th className="p-4">Charges Summary</th>
              <th className="p-4">Grand Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {quotes.map((q) => {
              const c = q.clientQuote || {};
              const currencySummary = q.currencySummary || {};

              const currencyLines = Object.values(currencySummary)
                .filter((cs) => cs.subtotal > 0)
                .map(
                  (cs) =>
                    `${cs.currency}: ${cs.subtotal} (INR ${cs.inrEquivalent})`
                );

              return (
                <tr key={q._id} className="border-t hover:bg-gray-50">
                  {/* CLIENT */}
                  <td className="p-4">
                    <div className="font-semibold">{c.company}</div>
                    <div className="text-xs text-gray-500">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                    <div className="text-xs text-gray-500">{c.phone}</div>
                  </td>

                  {/* SHIPMENT DETAILS */}
                  <td className="p-4">
                    <div className="capitalize font-medium">
                      {q.shipmentType}
                    </div>
                    <div className="text-xs">
                      <strong>Origin:</strong> {c.fromCity}, {c.fromCountry}
                    </div>
                    <div className="text-xs">
                      <strong>Destination:</strong> {c.toCity},{" "}
                      {c.toCountry}
                    </div>
                  </td>

                  {/* CURRENCY SUMMARY */}
                  <td className="p-4 text-xs text-gray-700">
                    {currencyLines.length > 0
                      ? currencyLines.map((l, i) => (
                          <div key={i} className="mb-1">
                            {l}
                          </div>
                        ))
                      : "—"}
                  </td>

                  {/* GRAND TOTAL */}
                  <td className="p-4 font-semibold text-[#0F4C81]">
                    ₹{Number(q.grandTotalINR || 0).toFixed(2)}
                  </td>

                  {/* STATUS */}
                  <td className="p-4 capitalize">
                    {q.status.replaceAll("_", " ")}
                  </td>

                  {/* ACTION */}
                  <td className="p-4">
                    <Link
                      href={`/dashboard/admin/finalized-quotes/${q._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}

            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No finalized quotes available (Grand Total is zero)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
