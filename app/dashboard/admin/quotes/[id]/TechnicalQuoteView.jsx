export default function TechnicalQuoteView({ technicalQuote }) {
  // ✅ HARD GUARDS
  if (!technicalQuote) return null;
  if (!Array.isArray(technicalQuote.lineItems)) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Technical Quote
        </h2>

        <span
          className={`text-sm px-3 py-1 rounded ${
            technicalQuote.status === "draft"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {technicalQuote.status.replaceAll("_", " ").toUpperCase()}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-center">Required</th>
              <th className="p-3 text-center">Done</th>
              <th className="p-3 text-right">Rate</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {technicalQuote.lineItems.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-medium">{item.head}</td>

                <td className="p-3 text-center">
                  {item.serviceRequired ? "✔️" : "—"}
                </td>

                <td className="p-3 text-center">
                  {item.serviceDone ? "✔️" : "—"}
                </td>

                <td className="p-3 text-right">
                  ₹{Number(item.rate || 0).toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {item.quantity}
                </td>

                <td className="p-3 text-right font-semibold">
                  ₹{Number(item.totalAmount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="mt-6 max-w-sm ml-auto text-sm">
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Grand Total</span>
          <span>
            ₹{Number(technicalQuote.grandTotal || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
