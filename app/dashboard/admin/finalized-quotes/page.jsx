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

    {
      $lookup: {
        from: "quotes",
        localField: "clientQuoteId",
        foreignField: "_id",
        as: "clientQuote",
      },
    },
    {
      $unwind: {
        path: "$clientQuote",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "jobs",
        localField: "clientQuote._id",
        foreignField: "quoteId",
        as: "job",
      },
    },

    {
      $match: {
        $or: [
          { status: "sent_to_client" }, // always show
          {
            status: "client_approved",
            job: { $size: 0 }, // hide if converted to job
          },
        ],
      },
    },

    { $sort: { createdAt: -1 } },
  ]);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Finalized Quotes</h1>

      <FilterTabs active={status || "all"} />

      <div className="bg-white rounded-xl shadow overflow-hidden mt-6">
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
              <tr key={q._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">
                  {q.clientQuote?.company || "—"}
                </td>

                <td className="p-4 capitalize">{q.shipmentType}</td>

                <td className="p-4 font-semibold">
                  ₹{Number(q.grandTotalINR || 0).toFixed(2)}
                </td>

                <td className="p-4 capitalize">
                  {q.status.replaceAll("_", " ")}
                </td>

                <td className="p-4">
                  <Link
                    href={`/dashboard/admin/finalized-quotes/${q._id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {quotes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No quotes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
