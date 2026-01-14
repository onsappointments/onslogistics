import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import QuoteActions from "./QuoteActions";
import Link from "next/link";
import TechnicalQuoteView from "./TechnicalQuoteView";
import mongoose from "mongoose";
import { filter } from "framer-motion/m";

export default async function QuoteDetails({ params }) {
  const { id } = await params;

  await connectDB();

  const quote = await Quote.findById(id).lean();

  // ✅ FIX 1: correct field name
  const technicalQuote = await TechnicalQuote.findOne({
    clientQuoteId: new mongoose.Types.ObjectId(id),
  }).lean();

    const filteredLineItems = technicalQuote?.lineItems?.filter((item) => item.rate > 0 ? item : null);
    technicalQuote.lineItems = filteredLineItems;

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
        <Field label="WhatsApp Number" value={quote.whatsappNumber} />
        <Field label="Your Website" value={quote.yourWebsite} />
        <Field label="Customer Type" value={quote.customerType} />
        <Field label="Preferred Contact Method" value={quote.preferredContactMethod} />
        <Field label="Best Time to Call" value={quote.bestTimeToCall} />
        <Field label="Best Time to Email" value={quote.bestTimeToEmail} />
        <Field label="How Did You Know Us" value={quote.howDidYouKnowUs} />
      </Section>

      {/* LOCATION */}
      <Section title="Location Details">
        <Field label="From Country" value={quote.fromCountry} />
        <Field label="To Country" value={quote.toCountry} />
        <Field label="From State" value={quote.fromState} />
        <Field label="To State" value={quote.toState} />
        <Field label="From City" value={quote.fromCity} />
        <Field label="To City" value={quote.toCity} />
        <Field label="From Postal" value={quote.fromPostal} />
        <Field label="To Postal" value={quote.toPostal} />
        <Field label="From Location Type" value={quote.fromLocationType} />
        <Field label="To Location Type" value={quote.toLocationType} />
      </Section>

      {/* SHIPMENT */}
      <Section title="Shipment Details">
        <Field label="Item" value={quote.item} />
        <Field label="Shipment Type" value={quote.shipmentType} />
        <Field label="Mode of Transport" value={quote.modeOfTransport} />
        <Field label="Mode of Shipment" value={quote.modeOfShipment} />
        <Field label="Container Type" value={quote.containerType} />
        <Field label="Freight Terms" value={quote.freightTerms} />
        <Field label="Estimated Shipping Date" value={quote.estimatedShippingDate} />
        <Field label="Goods Purpose" value={quote.goodsPurpose} />
        <Field 
          label="Value of Goods" 
          value={quote.valueOfGoods ? `${quote.valueOfGoods} ${quote.currency || 'INR'}` : null} 
        />
        <Field label="Dimensions" value={quote.dimensions} />
        <Field label="Pieces" value={quote.pieces} />
        <Field 
          label="Total Weight" 
          value={quote.totalWeight ? `${quote.totalWeight} ${quote.weightMeasure || 'Kgs'}` : null} 
        />
        <Field label="IMO Code" value={quote.imoCode} />
        <Field label="Nature of Goods" value={quote.natureOfGoods} />
        <Field label="Temperature" value={quote.temperature} />
      </Section>

      {/* MESSAGE */}
      <Section title="Message">
        <div className="col-span-2">
          <p className="text-gray-700 whitespace-pre-line">
            {quote.message || "—"}
          </p>
        </div>
      </Section>

      {/* SYSTEM */}
      <Section title="System Info">
        <Field label="Reference No" value={quote.referenceNo} />
        <Field label="Status" value={quote.status} />
        <Field
          label="Submitted"
          value={new Date(quote.createdAt).toLocaleString()}
        />
        <Field
          label="Last Updated"
          value={new Date(quote.updatedAt).toLocaleString()}
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
  if (!value || value === "" || value === "—") return null;
  return (
    <div className="text-gray-700">
      <span className="font-medium">{label}: </span>
      {value}
    </div>
  );
}
