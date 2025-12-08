"use client";

import { useState } from "react";

export default function RequestQuotePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    fromLocationType: "Port",
    toLocationType: "Port",
    fromState: "",
    toState: "",
    fromPostal: "",
    toPostal: "",

    item: "",
    modeOfTransport: "",
    estimatedShippingDate: "",
    freightTerms: "",
    containerType: "",
    modeOfShipment: "",
    goodsPurpose: "",
    valueOfGoods: "",
    currency: "INR",
    dimensions: "",
    pieces: "",
    imoCode: "",
    natureOfGoods: "",
    temperature: "",
    totalWeight: "",
    weightMeasure: "Kgs",
    shipmentType: "",

  
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneCountryCode: "+91",
    phone: "",
    whatsappNumber: "",
    yourWebsite: "",
    customerType: "",
    howDidYouKnowUs: "",
    preferredContactMethod: "Phone",
    bestTimeToCall: "",
    bestTimeToEmail: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const response = await res.json();

      if (res.ok) {
        setStatus("Your quote request has been submitted successfully!");
      } else {
        setStatus(response.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <main className="bg-[#F5F5F7] min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Apple-style title */}
        <h1 className="text-5xl font-semibold text-center font-['SF Pro Display'] text-gray-900 mb-10">
          Request a Quote
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 space-y-12 border border-[#e5e5e5]"
        >
          {/* SECTION: Source & Destination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-['SF Pro Display']">
              Source & Destination
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "fromCity",
                "toCity",
                "fromState",
                "toState",
                "fromPostal",
                "toPostal",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={form[field]}
                  onChange={handleChange}
                  className="input-box"
                />
              ))}

              <select
                name="fromLocationType"
                value={form.fromLocationType}
                onChange={handleChange}
                className="input-box"
              >
                <option>Port</option>
                <option>Door</option>
              </select>

              <select
                name="toLocationType"
                value={form.toLocationType}
                onChange={handleChange}
                className="input-box"
              >
                <option>Port</option>
                <option>Door</option>
              </select>
            </div>
          </section>

          {/* SECTION: Shipment Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-['SF Pro Display']">
              Shipment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text fields */}
              {[
                "item",
                "estimatedShippingDate",
                "dimensions",
                "pieces",
                "imoCode",
                "temperature",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={form[field]}
                  onChange={handleChange}
                  type={field === "estimatedShippingDate" ? "date" : "text"}
                  className="input-box"
                  required={field === "item"}
                />
              ))}

              {/* Select fields */}
              <select
                name="modeOfTransport"
                onChange={handleChange}
                value={form.modeOfTransport}
                className="input-box"
              >
                <option value="">Mode of Transport</option>
                <option>Air</option>
                <option>Sea</option>
                <option>Road</option>
              </select>

              <select
                name="freightTerms"
                onChange={handleChange}
                value={form.freightTerms}
                className="input-box"
              >
                <option value="">Freight Terms</option>
                <option>Paid by Shipper</option>
                <option>Paid by Consignee</option>
              </select>

              <select
                name="containerType"
                onChange={handleChange}
                value={form.containerType}
                className="input-box"
              >
                <option value="">Container Type</option>
                <option>20 FT</option>
                <option>40 FT</option>
                <option>LCL</option>
              </select>

              <select
                name="modeOfShipment"
                onChange={handleChange}
                value={form.modeOfShipment}
                className="input-box"
              >
                <option value="">Mode of Shipment</option>
                <option>Container</option>
                <option>Break Bulk</option>
                <option>LCL</option>
              </select>

              <select
                name="goodsPurpose"
                onChange={handleChange}
                value={form.goodsPurpose}
                className="input-box"
              >
                <option value="">Goods For</option>
                <option>Personal</option>
                <option>Commercial</option>
              </select>

              {/* Value + Currency */}
              <div className="flex gap-2">
                <input
                  name="valueOfGoods"
                  placeholder="Value of goods"
                  value={form.valueOfGoods}
                  onChange={handleChange}
                  className="input-box flex-1"
                />
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="input-box w-32"
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>AED</option>
                </select>
              </div>

              {/* Weight + Unit */}
              <div className="flex gap-2">
                <input
                  name="totalWeight"
                  placeholder="Total weight"
                  value={form.totalWeight}
                  onChange={handleChange}
                  className="input-box flex-1"
                />
                <select
                  name="weightMeasure"
                  value={form.weightMeasure}
                  onChange={handleChange}
                  className="input-box w-32"
                >
                  <option>Kgs</option>
                  <option>Lbs</option>
                </select>
               </div>
                <select
               name="shipmentType"
               value={form.shipmentType}
              onChange={handleChange}
               className="input-box"
              >
              <option value="">Select Type</option>
              <option value="import">Import</option>
              <option value="export">Export</option>
              <option value="courier">Courier</option>
              </select>

            </div>
          </section>

          {/* SECTION: Personal Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-['SF Pro Display']">
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "firstName",
                "lastName",
                "company",
                "email",
                "phone",
                "whatsappNumber",
                "yourWebsite",
                "howDidYouKnowUs",
                "bestTimeToCall",
                "bestTimeToEmail",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={form[field]}
                  onChange={handleChange}
                  className="input-box"
                  type={field === "email" ? "email" : "text"}
                  required={field === "firstName" || field === "email"}
                />
              ))}

              {/* Country Code + Phone */}
              <div className="flex gap-2">
                <input
                  name="phoneCountryCode"
                  value={form.phoneCountryCode}
                  onChange={handleChange}
                  className="input-box w-24"
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  className="input-box flex-1"
                  onChange={handleChange}
                  value={form.phone}
                />
              </div>

              {/* Dropdowns */}
              <select
                name="customerType"
                value={form.customerType}
                onChange={handleChange}
                className="input-box"
              >
                <option value="">Customer Type</option>
                <option>Exporter</option>
                <option>Importer</option>
                <option>Manufacturer</option>
                <option>Individual</option>
              </select>

              <select
                name="preferredContactMethod"
                value={form.preferredContactMethod}
                onChange={handleChange}
                className="input-box"
              >
                <option>Phone</option>
                <option>Email</option>
                <option>Whatsapp</option>
              </select>

              <textarea
                name="message"
                placeholder="Message"
                className="input-box col-span-2 h-24"
                value={form.message}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
          >
            {loading ? "Submitting..." : "Submit Quote Request"}
          </button>

          {status && (
            <p className="text-lg text-green-700 font-medium mt-4">{status}</p>
          )}
        </form>
      </div>

      {/* Apple Input Style */}
      <style jsx>{`
        .input-box {
          padding: 12px 16px;
          border-radius: 14px;
          background: white;
          border: 1px solid #e5e5e5;
          font-size: 15px;
          transition: 0.2s;
        }
        .input-box:focus {
          border-color: black;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.07);
          outline: none;
        }
      `}</style>
    </main>
  );
}
