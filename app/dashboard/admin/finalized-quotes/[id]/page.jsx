import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import ConvertToJobPanel from "./ConvertToJobPanel";
import Quote from "@/models/Quote";

export default async function FinalizedQuoteDetails({ params }) {
  const { id } = await params;

  await connectDB();

  const technicalQuote = await TechnicalQuote.findById(id)
    .populate("clientQuoteId")
    .lean();

  if (!technicalQuote) {
    return <div className="p-10">Quote not found</div>;
  }

  const clientQuote = technicalQuote.clientQuoteId;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Finalized Quote</h1>
        <StatusBadge status={technicalQuote.status} />
      </div>

      {/* CLIENT QUOTE */}
      <Section title="Client Quote">
        <Field label="Company" value={clientQuote.company} />
        <Field label="Email" value={clientQuote.email} />
        <Field label="Shipment Type" value={clientQuote.shipmentType} />
        <Field label="From" value={clientQuote.fromCity} />
        <Field label="To" value={clientQuote.toCity} />
      </Section>

      {/* TECHNICAL QUOTE */}
      <Section title="Technical Quote">
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
                <td className="p-3">{item.head}</td>
                <td className="p-3">₹{item.rate}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 font-semibold">
                  ₹{item.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right font-semibold text-lg">
          Total: ₹{technicalQuote.grandTotal.toFixed(2)}
        </div>
      </Section>

      {/* CLIENT APPROVAL CTA */}
      <ConvertToJobPanel
        technicalQuoteId={technicalQuote._id.toString()}
        status={technicalQuote.status}
      />
    </div>
  );
}

/* UI helpers */
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="text-gray-700 mb-1">
      <span className="font-medium">{label}: </span>
      {value}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
      {status.replaceAll("_", " ")}
    </span>
  );
}
