
"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const RequestQuoteForm = forwardRef(({ adminMode = false , setParentLoading}, ref) => {
  const [loading, setLoading] = useState(false);

  const initialForm = {
    fromCountry: "",
    toCountry: "",
    fromCity: "",
    toCity: "",
    fromLocationType: "Port",
    toLocationType: "Port",
    fromICD: "",
    toICD: "",
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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const resetForm = () => setForm(initialForm);

  useImperativeHandle(ref, () => ({
    handleSubmit,
    resetForm,
  }));

  // =============================
  // Country/State/City Fetching
  // =============================
    const [fromStates, setFromStates] = useState([]);
    const [toStates, setToStates] = useState([]);
    const [fromCities, setFromCities] = useState([]);
    const [toCities, setToCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [fromIcdSuggestions, setFromIcdSuggestions] = useState([]);
    const [toIcdSuggestions, setToIcdSuggestions] = useState([]);


    const ICD_SUGGESTIONS = [
  "GRFL Sahnewala ",
  "HTPL kila Raipur ",
  "ICD Adani-Kila Raipur",
  "ICD Ghungrana (Ahmedgarh)",
  "ICD Chawa Payal",
  "ICD Concor",
];
const handleFromIcdInput = (value) => {
  setForm(p => ({ ...p, fromICD: value }));

  // If empty → show all
  if (!value.trim()) {
    setFromIcdSuggestions(ICD_SUGGESTIONS);
    return;
  }

  const filtered = ICD_SUGGESTIONS.filter(icd =>
    icd.toLowerCase().includes(value.toLowerCase())
  );

  setFromIcdSuggestions(filtered); // if none → becomes []
};

const handleToIcdInput = (value) => {
  setForm(p => ({ ...p, toICD: value }));

  if (!value.trim()) {
    setToIcdSuggestions(ICD_SUGGESTIONS);
    return;
  }

  const filtered = ICD_SUGGESTIONS.filter(icd =>
    icd.toLowerCase().includes(value.toLowerCase())
  );

  setToIcdSuggestions(filtered);
};




  const fetchCSC = async (endpoint) => {
    try {
      const res = await fetch(`/api/csc?endpoint=${endpoint}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    fetchCSC("countries").then(setCountries);
  }, []);

  useEffect(() => {
    if (!form.fromCountry) return;
    fetchCSC(`countries/${form.fromCountry}/states`).then(setFromStates);
    setForm((p) => ({ ...p, fromState: "", fromCity: "" }));
    setFromCities([]);
  }, [form.fromCountry]);

  useEffect(() => {
    if (!form.toCountry) return;
    fetchCSC(`countries/${form.toCountry}/states`).then(setToStates);
    setForm((p) => ({ ...p, toState: "", toCity: "" }));
    setToCities([]);
  }, [form.toCountry]);

  useEffect(() => {
    if (form.fromCountry && form.fromState) {
      fetchCSC(`countries/${form.fromCountry}/states/${form.fromState}/cities`)
        .then(setFromCities);
    }
  }, [form.fromState]);

  useEffect(() => {
    if (form.toCountry && form.toState) {
      fetchCSC(`countries/${form.toCountry}/states/${form.toState}/cities`)
        .then(setToCities);
    }
  }, [form.toState]);

  // =============================
  // Shipment Type Auto-set
  // =============================
  useEffect(() => {
    if (!form.fromCountry || !form.toCountry) return;

    const fromIndia = form.fromCountry === "IN";
    const toIndia = form.toCountry === "IN";

    let shipmentType =
      fromIndia && toIndia
        ? "courier"
        : fromIndia
        ? "export"
        : toIndia
        ? "import"
        : "Not Set";

    setForm((p) =>
      p.shipmentType === shipmentType ? p : { ...p, shipmentType }
    );
  }, [form.fromCountry, form.toCountry]);

  // =============================
  // Validation
  // =============================
  const validateForm = (showStatus) => {
    const required = [
      "firstName",
      "email",
      "item",
      "company",
      "fromCountry",
      "toCountry",
      "fromCity",
      "toCity",
      "modeOfTransport",
      "modeOfShipment",
      "phone",
      "containerType",
    ];

    for (const field of required) {
      if (!form[field] || form[field].toString().trim() === "") {
        showStatus?.(
          "warning",
          "Missing Field",
          `Please fill ${field}`
        );
        return false;
      }
    }

    return true;
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async (showStatus) => {
    if (!validateForm(showStatus)) return null;

    setLoading(true);
setParentLoading?.(true);
    console.log("FORM AT SUBMIT:", form);


    try {
      const endpoint = adminMode
        ? "/api/quotes/create"
        : "/api/quotes/init";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...form,
            fromICD: form.fromICD,
            toICD: form.toICD,
            }),

      });

      const data = await res.json();

      if (!res.ok) {
        showStatus?.("error", "Error", data.error || "Failed");
        return null;
      }

      // ===== ADMIN FLOW =====
      if (adminMode) {
        showStatus?.(
          "success",
          "Quote Created",
          "Quote created successfully"
        );

        resetForm();

        return { skipOtp: true, quoteId: data.quoteId };
      }

      // ===== CLIENT FLOW =====
      showStatus?.(
        "success",
        "OTP Sent",
        "OTP sent to your email"
      );

      return { skipOtp: false, otpId: data.otpId };

    } catch (err) {
      showStatus?.("error", "Server Error", "Try again later");
      return null;
    } finally {
      setLoading(false);
        setParentLoading?.(false);
    }
  };

  return (
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
              <option>ICD</option>
            </select>
            {form.fromLocationType === "ICD" && (
  <div className="relative">
    <label className="block text-sm font-medium mb-2">
      Select From ICD
    </label>

    <input
  value={form.fromICD}
  name="fromICD"
  onChange={(e) => handleFromIcdInput(e.target.value)}
  onFocus={() => setFromIcdSuggestions(ICD_SUGGESTIONS)}
  onBlur={() => setTimeout(() => setFromIcdSuggestions([]), 200)}
  placeholder="Type ICD..."
  className="input-box"
/>


    {fromIcdSuggestions.length > 0 && (
      <div className="absolute bg-white border w-full rounded shadow z-10 max-h-48 overflow-y-auto">
        {fromIcdSuggestions.map((icd, i) => (
          <div
            key={i}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setFromIcdSuggestions([]);
            }}
            onMouseDown={() => {
  setForm(p => ({ ...p, fromICD: icd }));
}}
          >
            {icd}
          </div>
        ))}
      </div>
    )}
  </div>
)}

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
              <option>ICD</option>
            </select>
            {form.toLocationType === "ICD" && (
  <div className="relative">
    <label className="block text-sm font-medium mb-2">
      Select To ICD
    </label>

   <input
  value={form.toICD}
name="toICD"
  onChange={(e) => handleToIcdInput(e.target.value)}
  onFocus={() => setToIcdSuggestions(ICD_SUGGESTIONS)}
  onBlur={() => setTimeout(() => setToIcdSuggestions([]), 200)}
  placeholder="Type ICD..."
  className="input-box"
/>


    {toIcdSuggestions.length > 0 && (
      <div className="absolute bg-white border w-full rounded shadow z-10 max-h-48 overflow-y-auto">
        {toIcdSuggestions.map((icd, i) => (
          <div
            key={i}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setToIcdSuggestions([]);
            }}
            onMouseDown={() => {
  setForm(p => ({ ...p, toICD: icd }));
}}
          >
            {icd}
          </div>
        ))}
      </div>
    )}
  </div>
)}

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
              <option>40 FT Gen</option>
              <option>40 FT HC</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value of Goods
            </label>

            <div className="flex gap-3 items-center">
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="input-box !w-32 !min-h-[48px]"
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

          {/* Total Weight */}
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
        <h2 className="text-2xl font-semibold mb-4">{adminMode ? "Client Details" : "Personal Details"}</h2>
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
    </form>
  );
});

RequestQuoteForm.displayName = "RequestQuoteForm";
export default RequestQuoteForm;


