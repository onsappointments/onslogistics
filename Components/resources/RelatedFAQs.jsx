// components/resources/RelatedFAQs.jsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RelatedFAQs({ faqs }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-16">

      <h3 className="text-xl font-semibold mb-4">
        Frequently Asked Questions
      </h3>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border rounded-2xl p-4 bg-white shadow-sm"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left font-medium"
            >
              {faq.question}
            </button>

            {open === i && (
              <p className="mt-2 text-gray-600 text-sm">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link href="/faq" className="text-blue-600 text-sm">
          View all FAQs →
        </Link>
      </div>
    </div>
  );
}