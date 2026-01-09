export default function TechnicalQuoteView({ technicalQuote }) {
  /* ---------- HARD GUARDS ---------- */
  if (!technicalQuote) return null;
  if (!Array.isArray(technicalQuote.lineItems)) return null;

  const {
  status,
  subtotal = 0,
  igstTotal = 0,
  cgstTotal = 0,
  sgstTotal = 0,
  grandTotalINR = 0,
} = technicalQuote;


  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Technical Quote</h2>

        <span
          className={`text-sm px-3 py-1 rounded ${
            status === "draft"
              ? "bg-yellow-100 text-yellow-700"
              : status === "sent_to_client"
              ? "bg-blue-100 text-blue-700"
              : status === "client_approved"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status.replaceAll("_", " ").toUpperCase()}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Service</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Rate</th>
              <th className="p-2 text-center">Curr</th>
              <th className="p-2 text-right">Ex. Rate</th>
              <th className="p-2 text-right">Base (INR)</th>
              <th className="p-2 text-right">IGST</th>
              <th className="p-2 text-right">CGST</th>
              <th className="p-2 text-right">SGST</th>
              <th className="p-2 text-right">Total (INR)</th>
            </tr>
          </thead>

          <tbody>
            {technicalQuote.lineItems.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 font-medium">{item.head}</td>

                <td className="p-2 text-right">{item.quantity}</td>

                <td className="p-2 text-right">
                  {item.currency} {Number(item.rate).toFixed(2)}
                </td>

                <td className="p-2 text-center">{item.currency}</td>

                <td className="p-2 text-right">
                  {Number(item.exchangeRate).toFixed(4)}
                </td>

                <td className="p-2 text-right">
                  ₹{Number(item.baseAmount).toFixed(2)}
                </td>

                <td className="p-2 text-right">
                  {item.igstPercent > 0
                    ? `${item.igstPercent}% ₹${item.igstAmount.toFixed(2)}`
                    : "—"}
                </td>

                <td className="p-2 text-right">
                  {item.cgstPercent > 0
                    ? `${item.cgstPercent}% ₹${item.cgstAmount.toFixed(2)}`
                    : "—"}
                </td>

                <td className="p-2 text-right">
                  {item.sgstPercent > 0
                    ? `${item.sgstPercent}% ₹${item.sgstAmount.toFixed(2)}`
                    : "—"}
                </td>

                <td className="p-2 text-right font-semibold">
                  ₹{Number(item.totalAmount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="mt-6 max-w-sm ml-auto text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{Number(subtotal).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>IGST</span>
          <span>₹{Number(igstTotal).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>CGST</span>
          <span>₹{Number(cgstTotal).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>SGST</span>
          <span>₹{Number(sgstTotal).toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold border-t pt-2 text-base">
          <span>Grand Total</span>
          <span>₹{Number(grandTotalINR).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
