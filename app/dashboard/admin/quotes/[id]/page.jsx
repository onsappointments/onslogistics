import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import QuoteActions from "./QuoteActions";

export default async function QuoteDetails({ params }) {
  const { id } = await params;

  await connectDB();
  const quote = await Quote.findById(id).lean();

  if (!quote) return <div className="p-10">Quote not found</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Quote Details</h1>

       <Section title="Personal Information">
        <Field label="First Name" value={quote.firstName} />
        <Field label="Last Name" value={quote.lastName} />
        <Field label="Company" value={quote.company} />
        <Field label="Email" value={quote.email} />
        <Field label="Phone" value={`${quote.phoneCountryCode || ""} ${quote.phone}`} />
        <Field label="WhatsApp" value={quote.whatsappNumber} />
        <Field label="Website" value={quote.yourWebsite} />
        <Field label="Customer Type" value={quote.customerType} />
        <Field label="How Did You Know Us" value={quote.howDidYouKnowUs} />
        <Field label="Preferred Contact" value={quote.preferredContactMethod} />
        <Field label="Best Time To Call" value={quote.bestTimeToCall} />
        <Field label="Best Time To Email" value={quote.bestTimeToEmail} />
      </Section>

      {/* LOCATION */}
      <Section title="Location Details">
        <Field label="From City" value={quote.fromCity} />
        <Field label="To City" value={quote.toCity} />
        <Field label="From State" value={quote.fromState} />
        <Field label="To State" value={quote.toState} />
        <Field label="From Postal" value={quote.fromPostal} />
        <Field label="To Postal" value={quote.toPostal} />
        <Field label="From Location Type" value={quote.fromLocationType} />
        <Field label="To Location Type" value={quote.toLocationType} />
      </Section>

      {/* SHIPMENT */}
      <Section title="Shipment Details">
        <Field label="Item" value={quote.item} />
        <Field label="Transport Mode" value={quote.modeOfTransport} />
        <Field label="Shipment Mode" value={quote.modeOfShipment} />
        <Field label="Container Type" value={quote.containerType} />
        <Field label="Estimated Shipping Date" value={quote.estimatedShippingDate} />
        <Field label="Freight Terms" value={quote.freightTerms} />
        <Field label="Purpose of Goods" value={quote.goodsPurpose} />
        <Field label="Value of Goods" value={`${quote.valueOfGoods} ${quote.currency || ""}`} />
        <Field label="Shipmenttype" value={quote.shipmentType}  />
      </Section>

      {/* GOODS INFO */}
      <Section title="Goods Specification">
        <Field label="Dimensions" value={quote.dimensions} />
        <Field label="Pieces" value={quote.pieces} />
        <Field label="IMO Code" value={quote.imoCode} />
        <Field label="Nature of Goods" value={quote.natureOfGoods} />
        <Field label="Temperature" value={quote.temperature} />
        <Field label="Total Weight" value={`${quote.totalWeight} ${quote.weightMeasure}`} />
      </Section>

      {/* MESSAGE */}
      <Section title="Message">
        <p className="text-gray-700 whitespace-pre-line">{quote.message}</p>
      </Section>

      {/* META */}
      <Section title="System Info">
        <Field label="Status" value={quote.status} />
        <Field label="Submitted" value={new Date(quote.createdAt).toLocaleString()} />
      </Section>
      
      {/* ⭐ CLIENT ACTION BUTTONS */}
      <QuoteActions id={quote._id.toString()} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
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
