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

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-2">
        Quotation from ONS Logistics
      </h1>

      <p className="text-gray-600 mb-6">
        Status:{" "}
        <span className="font-medium capitalize">
          {technicalQuote.status.replaceAll("_", " ")}
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

      {/* TECHNICAL QUOTE TABLE */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quotation Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Service</th>
                <th className="p-3">Rate</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {technicalQuote.lineItems.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 font-medium">{item.head}</td>
                  <td className="p-3">₹{item.rate}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-semibold">
                    ₹{item.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="text-right mt-6 text-lg font-semibold">
          Total Amount: ₹{technicalQuote.grandTotal}
        </div>
      </div>

      {/* MESSAGE */}
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
