import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";

export default async function ClientQuotePage({ params }) {
  const { id } = await params;

  await connectDB();

  /* ---------------- CLIENT QUOTE ---------------- */
  const quote = await Quote.findById(id).lean();
  if (!quote) {
    return <div className="p-10">Quotation not available</div>;
  }

  /* ---------------- TECHNICAL QUOTE ---------------- */
  const technicalQuote = await TechnicalQuote.findOne({
    clientQuoteId: id,
    status: { $in: ["sent_to_client", "client_approved"] },
  }).lean();

  if (!technicalQuote) {
    return <div className="p-10">Quotation not available</div>;
  }

  const {
    lineItems = [],
    subtotal = 0,
    igstTotal = 0,
    cgstTotal = 0,
    sgstTotal = 0,
    grandTotal = 0,
    status,
  } = technicalQuote;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-2">
        Quotation from ONS Logistics
      </h1>

      <p className="text-gray-600 mb-6">
        Status:{" "}
        <span className="font-medium capitalize">
          {status.replaceAll("_", " ")}
        </span>
      </p>

      {/* CLIENT DETAILS */}
      <Section title="Client Information">
        <Field label="Name" value={`${quote.firstName} ${quote.lastName}`} />
        <Field label="Company" value={quote.company} />
        <Field label="Email" value={quote.email} />
        <Field label="Phone" value={quote.phone} />
      </Section>

      {/* SHIPMENT DETAILS */}
      <Section title="Shipment Details">
        <Field label="From" value={`${quote.fromCity}, ${quote.fromState}`} />
        <Field label="To" value={`${quote.toCity}, ${quote.toState}`} />
        <Field label="Shipment Type" value={quote.shipmentType} />
        <Field label="Container Type" value={quote.containerType} />
        <Field label="Mode" value={quote.modeOfShipment} />
      </Section>

      {/* TECHNICAL QUOTE */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Quotation Breakdown
        </h2>

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
              {lineItems.map((item, i) => (
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
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>IGST</span>
            <span>₹{igstTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>CGST</span>
            <span>₹{cgstTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>SGST</span>
            <span>₹{sgstTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total Payable (INR)</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* NOTES */}
      <Section title="Additional Notes">
        <p className="text-gray-700">
          {quote.message || "No additional notes"}
        </p>
      </Section>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="text-gray-700">
      <span className="font-medium">{label}: </span>
      {value}
    </div>
  );
}
