import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import ConvertToJobPanel from "./ConvertToJobPanel";
import Quote from "@/models/Quote";
import CurrencyConverter from "@/Components/CurrencyConverter";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditQuoteButton from "@/Components/EditQuoteButton";

export default async function FinalizedQuoteDetails({ params }) {
  const { id } = await params; 

  await connectDB();

  // Get user session
  const session = await getServerSession(authOptions);
  
  // Fetch user from database to get adminType
  let adminType = null;
  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email }).lean();
    adminType = user?.adminType;
  }

  console.log("Admin Type:", adminType);

  const technicalQuote = await TechnicalQuote.findById(id)
    .populate("clientQuoteId")
    .lean();

  if (!technicalQuote) {
    return <div className="p-10">Quote not found</div>;
  }

  const job = await Job.findOne({ technicalQuoteId: id }).lean();

  const clientQuote = technicalQuote.clientQuoteId;
  const currencySummary = technicalQuote.currencySummary || {};
  const grandTotalINR = technicalQuote.grandTotalINR || 0;

  console.log("Technical Quote:", technicalQuote);

  return (
    <div className="p-10 max-w-6xl mx-auto ">
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
        {/* Edit Button - Only show for admins */}
        {adminType && (
          <div className="mb-4 flex justify-end">
            <EditQuoteButton 
              quoteId={technicalQuote.clientQuoteId._id.toString()}
              isSuperAdmin={adminType === "super_admin"}
            />
          </div>
        )}

        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr className="">
              <th className="p-2">Service</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Curr</th>
              <th className="p-2">Ex. Rate</th>
              <th className="p-2">Base (INR)</th>
              <th className="p-2">IGST</th>
              <th className="p-2">CGST</th>
              <th className="p-2">SGST</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {technicalQuote.lineItems.map((item, i) => (
              item.quantity > 0 && item.rate > 0 && ( 
                <tr key={i} className="border-t">
                  <td className="p-3">{item.head}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.currency === "INR" ? "₹" : item.currency === "USD" ? "$" : item.currency === "EUR" ? "€" : ""}{item.rate}</td>
                  <td className="p-3">{item.currency}</td>
                  <td className="p-3">{item.exchangeRate}</td>
                  <td className="p-3">{item.baseAmount}</td>
                  <td className="p-3">{item.igstPercent}</td>
                  <td className="p-3">{item.cgstPercent}</td>
                  <td className="p-3">{item.sgstPercent}</td>
                  <td className="p-3 font-semibold">
                    ₹{item.totalAmount.toFixed(2)}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right font-semibold text-lg">
          Total: ₹{grandTotalINR.toFixed(2)}
        </div>

        {/* CURRENCY SUMMARY */}
        <Section title="Currency Summary">
          {Object.values(currencySummary)
            .filter((curr) => curr.subtotal > 0)
            .map((curr) => (
              <div key={curr.currency} className="mb-6 border rounded p-4">
                <h3 className="text-lg font-semibold mb-3">
                  {curr.currency}
                </h3>

                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Service</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(curr.services || [])
                      .filter((s) => s.amount > 0)
                      .map((s, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{s.head}</td>
                          <td className="p-2 text-right">{s.quantity}</td>
                          <td className="p-2 text-right">
                            {curr.currency} {s.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <div className="text-right font-semibold mt-3">
                  Subtotal: {curr.currency} {curr.subtotal.toFixed(2)}
                </div>
              </div>
            ))}

          <div className="mt-6 text-right text-xl font-semibold">
            <CurrencyConverter grandTotalINR={grandTotalINR} currencySummary={currencySummary} />
          </div>
        </Section>
      </Section>

      {/* CLIENT APPROVAL CTA */}
      {!job && (
        <ConvertToJobPanel
          technicalQuoteId={technicalQuote._id.toString()}
          status={technicalQuote.status}
        />
      )}
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