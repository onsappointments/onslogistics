import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { updateQuote } from "../actions"; // reuse server action
import { redirect } from "next/navigation";

export default async function EditQuotePage({ params }) {
  await connectDB();
  const { id } = await params;

  const quote = await Quote.findById(id).lean();
  if (!quote) return <div className="p-10">Quote not found.</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Edit Quote</h1>

      <form
        action={async (formData) => {
          "use server";
          await updateQuote(formData);
          redirect(`/dashboard/admin/quotes/${id}`);
        }}
        className="space-y-8"
      >
       <input type="hidden" name="id" value={quote._id.toString()} />


        {/* -------- PERSONAL INFORMATION -------- */}
        <Section title="Personal Information">
          <Input name="firstName" label="First Name" defaultValue={quote.firstName} />
          <Input name="lastName" label="Last Name" defaultValue={quote.lastName} />
          <Input name="company" label="Company" defaultValue={quote.company} />
          <Input name="email" label="Email" defaultValue={quote.email} />
          <Input
            name="phoneCountryCode"
            label="Phone Country Code"
            defaultValue={quote.phoneCountryCode}
          />
          <Input name="phone" label="Phone Number" defaultValue={quote.phone} />
          <Input
            name="whatsappNumber"
            label="WhatsApp Number"
            defaultValue={quote.whatsappNumber}
          />
          <Input name="yourWebsite" label="Website" defaultValue={quote.yourWebsite} />
          <Input
            name="customerType"
            label="Customer Type"
            defaultValue={quote.customerType}
          />
          <Input
            name="howDidYouKnowUs"
            label="How Did You Know Us"
            defaultValue={quote.howDidYouKnowUs}
          />
        </Section>

        {/* -------- LOCATION -------- */}
        <Section title="Location Details">
          <Input name="fromCity" label="From City" defaultValue={quote.fromCity} />
          <Input name="toCity" label="To City" defaultValue={quote.toCity} />
          <Input name="fromState" label="From State" defaultValue={quote.fromState} />
          <Input name="toState" label="To State" defaultValue={quote.toState} />
          <Input name="fromPostal" label="From Postal" defaultValue={quote.fromPostal} />
          <Input name="toPostal" label="To Postal" defaultValue={quote.toPostal} />
          <Input
            name="fromLocationType"
            label="From Location Type"
            defaultValue={quote.fromLocationType}
          />
          <Input
            name="toLocationType"
            label="To Location Type"
            defaultValue={quote.toLocationType}
          />
        </Section>

        {/* -------- SHIPMENT -------- */}
        <Section title="Shipment Details">
          <Input name="item" label="Item" defaultValue={quote.item} />
          <Input
            name="modeOfTransport"
            label="Mode of Transport"
            defaultValue={quote.modeOfTransport}
          />
          <Input
            name="modeOfShipment"
            label="Mode of Shipment"
            defaultValue={quote.modeOfShipment}
          />
          <Input
            name="containerType"
            label="Container Type"
            defaultValue={quote.containerType}
          />
          <Input
            name="estimatedShippingDate"
            label="Estimated Shipping Date"
            defaultValue={quote.estimatedShippingDate}
          />
          <Input
            name="freightTerms"
            label="Freight Terms"
            defaultValue={quote.freightTerms}
          />
          <Input
            name="goodsPurpose"
            label="Goods Purpose"
            defaultValue={quote.goodsPurpose}
          />
          <Input
            name="valueOfGoods"
            label="Value of Goods"
            defaultValue={quote.valueOfGoods}
          />
          <Input name="currency" label="Currency" defaultValue={quote.currency} />
        </Section>

        {/* -------- GOODS DETAILS -------- */}
        <Section title="Goods Specification">
          <Input name="dimensions" label="Dimensions" defaultValue={quote.dimensions} />
          <Input name="pieces" label="Pieces" defaultValue={quote.pieces} />
          <Input name="imoCode" label="IMO Code" defaultValue={quote.imoCode} />
          <Input
            name="natureOfGoods"
            label="Nature of Goods"
            defaultValue={quote.natureOfGoods}
          />
          <Input
            name="temperature"
            label="Temperature"
            defaultValue={quote.temperature}
          />
          <Input
            name="totalWeight"
            label="Total Weight"
            defaultValue={quote.totalWeight}
          />
          <Input
            name="weightMeasure"
            label="Weight Measure"
            defaultValue={quote.weightMeasure}
          />
        </Section>

        {/* -------- MESSAGE -------- */}
        <Section title="Message">
          <textarea
            name="message"
            defaultValue={quote.message}
            className="w-full border p-3 rounded-lg bg-gray-50"
            rows="5"
          ></textarea>
        </Section>

        {/* -------- SUBMIT BUTTON -------- */}
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>

        {/* CANCEL */}
        <a
          href={`/dashboard/admin/quotes/${id}`}
          className="ml-4 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </a>
      </form>
    </div>
  );
}

/* UI COMPONENTS */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, name, defaultValue }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ""}
        className="border p-2 rounded-lg bg-gray-50"
      />
    </div>
  );
}
