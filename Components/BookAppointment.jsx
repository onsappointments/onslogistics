"use client";

import { useState } from "react";

export default function BookAppointment() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("https://formspree.io/f/xzzyblrb", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      setStatus("SUCCESS");
      e.currentTarget.reset();
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <section id="book-appointment" className="bg-[#F5F5F7] py-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 border border-white/40">
        <h2 className="text-4xl font-semibold text-[#1d1d1f] text-center mb-10 font-['SF Pro Display']">
          Book an Appointment
        </h2>

        <div className="space-y-6">
          {/* Name, Email, Phone */}
          <div className="grid md:grid-cols-3 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            />
          </div>

          {/* Service */}
          <div>
            <select
              name="service"
              required
              className="p-4 w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            >
              <option value="">Select Service</option>
              <option>Freight Forwarding</option>
              <option>Road Transportation</option>
              <option>Sea Cargo</option>
              <option>Air Cargo</option>
              <option>Licensing</option>
              <option>Export / Import Consultation</option>
              <option>Custom Clearance</option>
            </select>
          </div>

          {/* Origin, Destination, Date */}
          <div className="grid md:grid-cols-3 gap-6">
            <input
              type="text"
              name="origin"
              placeholder="Origin (e.g., Mumbai)"
              required
              className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            />
            <input
              type="text"
              name="destination"
              placeholder="Destination (e.g., Dubai)"
              required
              className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            />
            <input
              type="date"
              name="pickupDate"
              required
              className="p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition w-full"
            />
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Additional Details (e.g., Machinery, 2 containers, need price and ETA)"
            rows={4}
            className="p-4 w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
          ></textarea>

          {/* Submit */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-10 py-3 bg-blue-600 text-white font-medium text-lg rounded-full
                         hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </div>

          {status === "SUCCESS" && (
            <p className="text-green-600 text-center mt-4">✅ Appointment submitted successfully!</p>
          )}
          {status === "ERROR" && (
            <p className="text-red-600 text-center mt-4">❌ Something went wrong. Try again later.</p>
          )}
        </div>
      </div>
    </section>
  );
}