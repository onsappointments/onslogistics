"use client";

import { useEffect, useState } from "react";
import Recaptcha from "../../Components/Recaptcha";

export default function RequestQuotePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const initialForm = {
    fromCountry: "",
    toCountry: "",
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
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // States and Cities
 const [fromStates, setFromStates] = useState([]);
const [toStates, setToStates] = useState([]);
const [fromCities, setFromCities] = useState([]);
const [toCities, setToCities] = useState([]);
const [countries, setCountries] = useState([]);

// Client-side helper (calls your server API)
const fetchCSC = async (endpoint) => {
  try {
    const res = await fetch(`/api/csc?endpoint=${endpoint}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};


// Fetch all countries once
useEffect(() => {
  fetchCSC("countries").then(setCountries);
}, []);


// Fetch states for fromCountry
useEffect(() => {
  if (!form.fromCountry) return;

  fetchCSC(`countries/${form.fromCountry}/states`)
    .then(setFromStates);

  setForm((p) => ({ ...p, fromState: "", fromCity: "" }));
  setFromCities([]);
}, [form.fromCountry]);


// Fetch states for toCountry
useEffect(() => {
  if (!form.toCountry) return;

  fetchCSC(`countries/${form.toCountry}/states`)
    .then(setToStates);

  setForm((p) => ({ ...p, toState: "", toCity: "" }));
  setToCities([]);
}, [form.toCountry]);



  // Fetch cities when fromState changes
  useEffect(() => {
    if (!form.fromCountry || !form.fromState) return;
  
    fetchCSC(
      `countries/${form.fromCountry}/states/${form.fromState}/cities`
    ).then(setFromCities);
  }, [form.fromState]);
  
  

  // Fetch cities when toState changes
  useEffect(() => {
    if (!form.toCountry || !form.toState) return;
  
    fetchCSC(
      `countries/${form.toCountry}/states/${form.toState}/cities`
    ).then(setToCities);
  }, [form.toState]);
  

  // Manual validation for required fields
  const validateForm = () => {
    const requiredFields = ["firstName", "email", "item"];
    for (const field of requiredFields) {
      if (!form[field]?.trim()) {
        setStatus(`Please fill the ${field.replace(/([A-Z])/g, " $1")} field.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setStatus("");
    if (!validateForm()) return;
    setShowCaptchaModal(true);
    setLoading(true);
  };
  const handleCaptchaVerify = async (token) => {
    if (!token) return;

    setCaptchaToken(token);
    setShowCaptchaModal(false);
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken: token }),
      });

      const response = await res.json();

      if (res.ok) {
        setStatus("Your quote request has been submitted successfully!");
        setForm(initialForm);
        setCaptchaToken("");
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
        <h1 className="text-5xl font-semibold text-center font-['SF Pro Display'] text-gray-900 mb-10">
          Request a Quote
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 space-y-12 border border-[#e5e5e5]"
        >
          {/* Source & Destination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Source & Destination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Country */}
              <select
                name="fromCountry"
                value={form.fromCountry}
                onChange={(e) =>
                  setForm({ ...form, fromCountry: e.target.value, fromState: "", fromCity: "" })
                }
                className="input-box"
              >
                <option value="">Select From Country</option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select>

              {/* To Country */}
              <select
                name="toCountry"
                value={form.toCountry}
                onChange={(e) =>
                  setForm({ ...form, toCountry: e.target.value, toState: "", toCity: "" })
                }
                className="input-box"
              >
                <option value="">Select To Country</option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select> 

              {/* From State */}
              <select
                name="fromState"
                value={form.fromState}
                onChange={(e) =>
                  setForm({ ...form, fromState: e.target.value, fromCity: "" })
                }
                className="input-box"
              >
                <option value="">Select From State</option>
                {fromStates.map((state) => (
                  <option key={state.iso2} value={state.iso2}>
                    {state.name}
                  </option>
                ))}
              </select>

                 {/* To State */}
              <select
                name="toState"
                value={form.toState}
                onChange={(e) =>
                  setForm({ ...form, toState: e.target.value, toCity: "" })
                }
                className="input-box"
              >
                <option value="">Select To State</option>
                {toStates.map((state) => (
                  <option key={state.iso2} value={state.iso2}>
                    {state.name}
                  </option>
                ))}
              </select>

              {/* From City */}
              <select
                name="fromCity"
                value={form.fromCity}
                onChange={handleChange}
                disabled={!form.fromState}
                className="input-box"
              >
                <option value="">Select From City</option>
                {fromCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              {/* To City */}
              <select
                name="toCity"
                value={form.toCity}
                onChange={handleChange}
                disabled={!form.toState}
                className="input-box"
              >
                <option value="">Select To City</option>
                {toCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              {/* Postal Codes */}
              <input
                name="fromPostal"
                value={form.fromPostal}
                onChange={handleChange}
                placeholder="From Postal"
                className="input-box"
              />
              <input
                name="toPostal"
                value={form.toPostal}
                onChange={handleChange}
                placeholder="To Postal"
                className="input-box"
              />

              {/* Location Type */}
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

          {/* Shipment Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  type={field === "estimatedShippingDate" ? "date" : "text"}
                  className="input-box"
                />
              ))}

              {[
                { name: "modeOfTransport", options: ["", "Air", "Sea", "Road"] },
                { name: "freightTerms", options: ["", "Paid by Shipper", "Paid by Consignee"] },
                { name: "containerType", options: ["", "20 FT", "40 FT", "LCL"] },
                { name: "modeOfShipment", options: ["", "Container", "Break Bulk", "LCL"] },
                { name: "goodsPurpose", options: ["", "Personal", "Commercial"] },
                { name: "shipmentType", options: ["", "import", "export", "courier"] },
              ].map((field) => (
                <select
                  key={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="input-box"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt || `Select ${field.name.replace(/([A-Z])/g, " $1")}`}
                    </option>
                  ))}
                </select>
              ))}

              {/* Value + Currency */}
              <div className="flex gap-2">
                <input
                  name="valueOfGoods"
                  value={form.valueOfGoods}
                  onChange={handleChange}
                  placeholder="Value of goods"
                  className="input-box flex-1"
                />
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="input-box w-32"
                >
                  {["INR", "USD", "AED"].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Weight + Unit */}
              <div className="flex gap-2">
                <input
                  name="totalWeight"
                  value={form.totalWeight}
                  onChange={handleChange}
                  placeholder="Total weight"
                  className="input-box flex-1"
                />
                <select
                  name="weightMeasure"
                  value={form.weightMeasure}
                  onChange={handleChange}
                  className="input-box w-32"
                >
                  {["Kgs", "Lbs"].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
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
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className="input-box"
                  type={field === "email" ? "email" : "text"}
                />
              ))}

              <div className="flex gap-2">
                <input
                  name="phoneCountryCode"
                  value={form.phoneCountryCode}
                  onChange={handleChange}
                  className="input-box w-24"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="input-box flex-1"
                />
              </div>

              <select
                name="customerType"
                value={form.customerType}
                onChange={handleChange}
                className="input-box"
              >
                {[ "Customer Type", "Exporter", "Importer", "Manufacturer", "Individual"].map(
                  (opt) => (
                    <option key={opt}>{opt}</option>
                  )
                )}
              </select>

              <select
                name="preferredContactMethod"
                value={form.preferredContactMethod}
                onChange={handleChange}
                className="input-box"
              >
                {["Phone", "Email", "Whatsapp"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="input-box col-span-2 h-24"
              />
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmitClick}
            className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
          >
            {loading ? "Submitting..." : "Submit Quote Request"}
          </button>

          {status && (
            <p className="text-lg text-green-700 font-medium mt-4">{status}</p>
          )}
        </form>
      </div>

      {/* Captcha Modal */}
     <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ${
          showCaptchaModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Verify Captcha</h3>
          <Recaptcha onVerify={handleCaptchaVerify} />
          <button
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setShowCaptchaModal(false)}
          >
            Cancel
          </button>
        </div>
</div>

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