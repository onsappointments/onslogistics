"use client";

import { useEffect, useState } from "react";

export default function RequestQuotePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [quoteId, setQuoteId] = useState(null);

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

    fetchCSC(`countries/${form.fromCountry}/states`).then(setFromStates);

    setForm((p) => ({ ...p, fromState: "", fromCity: "" }));
    setFromCities([]);
  }, [form.fromCountry]);

  // Fetch states for toCountry
  useEffect(() => {
    if (!form.toCountry) return;

    fetchCSC(`countries/${form.toCountry}/states`).then(setToStates);

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
    const requiredFields = ["firstName", "email", "item", "shipmentType", "company", "fromCountry", "toCountry", "fromCity", "toCity", "modeOfTransport", "modeOfShipment", "phone", "containerType"];
    for (const field of requiredFields) {
      if (!form[field]?.trim()) {
        setStatus(`Please fill the ${field.replace(/([A-Z])/g, " $1")} field.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    setStatus("");
  
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      const res = await fetch("/api/quotes/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setStatus(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }
  
      setQuoteId(data.otpId);
      setShowOtpModal(true);
      setStatus("OTP sent to your email");
  
    } catch (err) {
      console.error(err);
      setStatus("Server error. Try again later.");
    }
  
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setStatus("Please enter OTP");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("/api/quotes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, otp }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setStatus(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }
  
      setStatus("Your quote request has been submitted successfully!");
      setForm(initialForm);
      setShowOtpModal(false);
      setOtp("");
      setQuoteId(null);
  
    } catch (err) {
      console.error(err);
      setStatus("Verification failed");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="fromCountry"
                  value={form.fromCountry}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fromCountry: e.target.value,
                      fromState: "",
                      fromCity: "",
                    })
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
              </div>

              {/* To Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="toCountry"
                  value={form.toCountry}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      toCountry: e.target.value,
                      toState: "",
                      toCity: "",
                    })
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
              </div>

              {/* From State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From State
                </label>
                <select
                  name="fromState"
                  value={form.fromState}
                  onChange={(e) =>
                    setForm({ ...form, fromState: e.target.value, fromCity: "" })
                  }
                  className="input-box"
                  disabled={!form.fromCountry}
                >
                  <option value="">Select From State</option>
                  {fromStates.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To State
                </label>
                <select
                  name="toState"
                  value={form.toState}
                  onChange={(e) =>
                    setForm({ ...form, toState: e.target.value, toCity: "" })
                  }
                  className="input-box"
                  disabled={!form.toCountry}
                >
                  <option value="">Select To State</option>
                  {toStates.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* From City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From City <span className="text-red-500">*</span>
                </label>
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
              </div>

              {/* To City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To City <span className="text-red-500">*</span>
                </label>
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
              </div>

              {/* From Postal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Postal Code
                </label>
                <input
                  name="fromPostal"
                  value={form.fromPostal}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  className="input-box"
                />
              </div>

              {/* To Postal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Postal Code
                </label>
                <input
                  name="toPostal"
                  value={form.toPostal}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  className="input-box"
                />
              </div>

              {/* From Location Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Location Type
                </label>
                <select
                  name="fromLocationType"
                  value={form.fromLocationType}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option>Port</option>
                  <option>Door</option>
                </select>
              </div>

              {/* To Location Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Location Type
                </label>
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
            </div>
          </section>

          {/* Shipment Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item <span className="text-red-500">*</span>
                </label>
                <input
                  name="item"
                  value={form.item}
                  onChange={handleChange}
                  placeholder="Enter item description"
                  className="input-box"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  name="dimensions"
                  value={form.dimensions}
                  onChange={handleChange}
                  placeholder="e.g., 10x20x30 cm"
                  className="input-box"
                />
              </div>

              {/* Pieces */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Pieces
                </label>
                <input
                  name="pieces"
                  value={form.pieces}
                  onChange={handleChange}
                  placeholder="Enter number of pieces"
                  type="number"
                  min="0"
                  className="input-box"
                />
              </div>

              {/* Nature of Goods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature of Goods
                </label>
                <input
                  name="natureOfGoods"
                  value={form.natureOfGoods}
                  onChange={handleChange}
                  placeholder="e.g., Fragile, Perishable"
                  className="input-box"
                />
              </div>

              {/* IMO Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IMO Code
                </label>
                <input
                  name="imoCode"
                  value={form.imoCode}
                  onChange={handleChange}
                  placeholder="Enter IMO code (if hazardous)"
                  className="input-box"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature Requirements
                </label>
                <input
                  name="temperature"
                  value={form.temperature}
                  onChange={handleChange}
                  placeholder="e.g., -20°C to 5°C"
                  className="input-box"
                />
              </div>

              {/* Mode of Transport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode of Transport <span className="text-red-500">*</span>
                </label>
                <select
                  name="modeOfTransport"
                  value={form.modeOfTransport}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Mode of Transport</option>
                  <option>Air</option>
                  <option>Sea</option>
                  <option>Road</option>
                </select>
              </div>

              {/* Freight Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Freight Terms
                </label>
                <select
                  name="freightTerms"
                  value={form.freightTerms}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Freight Terms</option>
                  <option>Paid by Shipper</option>
                  <option>Paid by Consignee</option>
                </select>
              </div>

              {/* Container Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Container Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="containerType"
                  value={form.containerType}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Container Type</option>
                  <option>20 FT</option>
                  <option>40 FT</option>
                  <option>LCL</option>
                </select>
              </div>

              {/* Mode of Shipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode of Shipment <span className="text-red-500">*</span>
                </label>
                <select
                  name="modeOfShipment"
                  value={form.modeOfShipment}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Mode of Shipment</option>
                  <option>Container</option>
                  <option>Break Bulk</option>
                  <option>LCL</option>
                </select>
              </div>

              {/* Goods Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goods Purpose
                </label>
                <select
                  name="goodsPurpose"
                  value={form.goodsPurpose}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Goods Purpose</option>
                  <option>Personal</option>
                  <option>Commercial</option>
                </select>
              </div>

              {/* Shipment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="shipmentType"
                  value={form.shipmentType}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Shipment Type</option>
                  <option>import</option>
                  <option>export</option>
                  <option>courier</option>
                </select>
              </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value of Goods
          </label>

          <div className="flex gap-3 items-center">
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="input-box !w-32 !min-h-[48px]"   // FORCES proper size
            >
              <option>INR</option>
              <option>USD</option>
              <option>AED</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>

            <input
              name="valueOfGoods"
              value={form.valueOfGoods}
              onChange={handleChange}
              placeholder="Enter value"
              type="number"
              min="0"
              step="0.01"
              className="input-box flex-1 !min-h-[48px]"
            />
          </div>
        </div>



              {/* Total Weight - FIXED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Weight
            </label>

            <div className="flex gap-3 items-center">
              <input
                name="totalWeight"
                value={form.totalWeight}
                onChange={handleChange}
                placeholder="Enter weight"
                type="number"
                min="0"
                step="0.01"
                className="input-box flex-1 !min-h-[48px]"
              />

              <select
                name="weightMeasure"
                value={form.weightMeasure}
                onChange={handleChange}
                className="input-box !w-32 !min-h-[48px]"
              >
                <option>Kgs</option>
                <option>Lbs</option>
                <option>Tons</option>
              </select>
            </div>
          </div>
            </div>
          </section>

          {/* Personal Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="input-box"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="input-box"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="input-box"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  type="email"
                  className="input-box"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    name="phoneCountryCode"
                    value={form.phoneCountryCode}
                    onChange={handleChange}
                    placeholder="+91"
                    className="input-box !w-32 !min-h-[48px]"
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="input-box flex-1 !min-h-[48px]"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  className="input-box"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Website
                </label>
                <input
                  name="yourWebsite"
                  value={form.yourWebsite}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                  className="input-box"
                />
              </div>

              {/* Customer Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type
                </label>
                <select
                  name="customerType"
                  value={form.customerType}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="">Select Customer Type</option>
                  <option>Exporter</option>
                  <option>Importer</option>
                  <option>Manufacturer</option>
                  <option>Individual</option>
                </select>
              </div>

              {/* How Did You Know Us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How Did You Know Us?
                </label>
                <input
                  name="howDidYouKnowUs"
                  value={form.howDidYouKnowUs}
                  onChange={handleChange}
                  placeholder="e.g., Google, Referral, Social Media"
                  className="input-box"
                />
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
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
              </div>

              {/* Best Time to Call */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Time to Call
                </label>
                <input
                  name="bestTimeToCall"
                  value={form.bestTimeToCall}
                  onChange={handleChange}
                  placeholder="e.g., 10 AM - 12 PM"
                  className="input-box"
                />
              </div>

              {/* Best Time to Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Time to Email
                </label>
                <input
                  name="bestTimeToEmail"
                  value={form.bestTimeToEmail}
                  onChange={handleChange}
                  placeholder="e.g., Morning, Afternoon"
                  className="input-box"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any additional information or requirements..."
                  className="input-box h-32 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmitClick}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>

            {status && (
              <p
                className={`text-base font-medium text-center ${
                  status.includes("successfully")
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* OTP Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ${
          showOtpModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-2">Verify Your Email</h3>
          <p className="text-gray-600 mb-6 text-sm">
            We've sent a 6-digit code to {form.email}
          </p>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            className="input-box text-center text-2xl tracking-widest font-mono mb-4"
          />

          <div className="flex gap-3">
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"          
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>  
      </div>
      </main>
    );
}