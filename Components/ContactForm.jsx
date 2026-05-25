"use client";

import { FileText, CalendarCheck, ArrowRight } from "lucide-react";

export default function ContactForm() {
  return (
    <section
      id="contact-form"
      className="bg-[#F5F5F7] py-24 px-6 md:px-16 flex justify-center"
    >
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* ── ORIGINAL FORM ── */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10">
          <h2 className="text-4xl font-semibold text-center mb-10 font-['SF_Pro_Display']">
            Send a Message
          </h2>

          <form
            action="https://formspree.io/f/mjkjvqjp"
            method="POST"
            className="flex flex-col gap-6"
          >
            <input
              type="text"
              name="Full Name"
              placeholder="Full Name"
              required
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="Email"
              placeholder="Email"
              required
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="Phone"
              placeholder="Phone Number"
              required
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="Subject"
              placeholder="Subject"
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="Message"
              placeholder="Message"
              rows={5}
              required
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="px-10 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium text-lg"
            >
              Submit Message
            </button>
          </form>
        </div>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500 whitespace-nowrap">Not ready to message?</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* ── CTA CARDS ── */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Request a Quote */}
          <a
            href="/request-quote"
            className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm">Request a Quote</p>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Get a tailored price for your shipment — FTL, PTL, Air & more.
              </p>
            </div>
          </a>

          {/* Book Appointment */}
          <a
            href="/book-appointment"
            className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm">Book an Appointment</p>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Schedule a call or in-person visit when the time suits you.
              </p>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}