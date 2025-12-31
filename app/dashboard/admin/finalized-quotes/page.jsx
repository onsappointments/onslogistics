import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import Link from "next/link";

export default async function FinalizedQuotesPage() {
  await connectDB();

  const quotes = await TechnicalQuote.find({
    status: { $in: ["sent_to_client", "client_approved"] },
  })
    .populate("clientQuoteId")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">
        Finalized Quotes
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4">Shipment</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {quotes.map((q) => (
              <tr key={q._id} className="border-t">
                <td className="p-4 font-medium">
                  {q.clientQuoteId?.company || "—"}
                </td>

                <td className="p-4 capitalize">
                  {q.shipmentType}
                </td>

                <td className="p-4 font-semibold">
                  ₹{q.grandTotal.toFixed(2)}
                </td>

                <td className="p-4">
                  <StatusBadge status={q.status} />
                </td>

                <td className="p-4">
                  <Link
                    href={`/dashboard/admin/finalized-quotes/${q._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}

            {quotes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No finalized quotes yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STATUS BADGE ---------- */

function StatusBadge({ status }) {
  const map = {
    sent_to_client: "bg-yellow-100 text-yellow-700",
    client_approved: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
