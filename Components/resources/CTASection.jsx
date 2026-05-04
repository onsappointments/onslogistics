"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <div className="mt-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 text-white px-8 py-12 shadow-lg">

        {/* CONTENT */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ship Without Delays?
          </h2>

          <p className="text-blue-100 mb-8">
            Get expert guidance on customs clearance, freight pricing, and logistics planning.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            {/* PRIMARY CTA */}
            <Link
              href="/request-quote"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition text-center"
            >
              Get a Freight Quote
            </Link>

            {/* SECONDARY CTA */}
            <Link
              href="/contact"
              className="border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition text-center"
            >
              Talk to an Expert
            </Link>

          </div>

          <p className="text-xs text-blue-200 mt-6">
            Trusted by importers & exporters across India
          </p>
        </div>
      </div>
    </div>
  );
}