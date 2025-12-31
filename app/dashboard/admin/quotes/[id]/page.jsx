import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import QuoteActions from "./QuoteActions";
import Link from "next/link";
import TechnicalQuoteView from "./TechnicalQuoteView";
import mongoose from "mongoose";

export default async function QuoteDetails({ params }) {
  const { id } = await params;

  await connectDB();

  const quote = await Quote.findById(id).lean();

  // ✅ FIX 1: correct field name
  const technicalQuote = await TechnicalQuote.findOne({
    clientQuoteId: new mongoose.Types.ObjectId(id),
  }).lean();

  if (!quote) return <div className="p-10">Quote not found</div>;

  const canEditTechnicalQuote =
    !technicalQuote ||
    technicalQuote.status === "draft" ||
    technicalQuote.status === "client_rejected";

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Quote Details</h1>

        {/* ✅ FIX 2: show button only when editable */}
        {canEditTechnicalQuote && (
          <Link
            href={`/dashboard/admin/quotes/${quote._id}/technical`}
            className={`rounded-lg px-6 py-3 text-white font-medium transition ${
              technicalQuote
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {technicalQuote
              ? "Edit Technical Quote"
              : "Create Technical Quote"}
          </Link>
        )}
      </div>

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <Field label="First Name" value={quote.firstName} />
        <Field label="Last Name" value={quote.lastName} />
        <Field label="Company" value={quote.company} />
        <Field label="Email" value={quote.email} />
        <Field
          label="Phone"
          value={`${quote.phoneCountryCode || ""} ${quote.phone}`}
        />
      </Section>

      {/* LOCATION */}
      <Section title="Location Details">
        <Field label="From City" value={quote.fromCity} />
        <Field label="To City" value={quote.toCity} />
        <Field label="From State" value={quote.fromState} />
        <Field label="To State" value={quote.toState} />
        <Field label="From Postal" value={quote.fromPostal} />
        <Field label="To Postal" value={quote.toPostal} />
      </Section>

      {/* SHIPMENT */}
      <Section title="Shipment Details">
        <Field label="Item" value={quote.item} />
        <Field label="Shipment Type" value={quote.shipmentType} />
        <Field label="Container Type" value={quote.containerType} />
        <Field label="Mode" value={quote.modeOfShipment} />
      </Section>

      {/* MESSAGE */}
      <Section title="Message">
        <p className="text-gray-700 whitespace-pre-line">
          {quote.message || "—"}
        </p>
      </Section>

      {/* SYSTEM */}
      <Section title="System Info">
        <Field label="Status" value={quote.status} />
        <Field
          label="Submitted"
          value={new Date(quote.createdAt).toLocaleString()}
        />
      </Section>

      {/* ✅ FIX 3: draft/final view now works */}
      <TechnicalQuoteView technicalQuote={technicalQuote} />

      {/* ACTIONS */}
      <QuoteActions id={quote._id.toString()} />
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

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
