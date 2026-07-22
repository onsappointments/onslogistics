"use client";

import { ChevronDown } from "lucide-react";

export default function FAQItem({
  faq,
  open,
  onClick,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white transition-all">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="text-lg font-semibold text-gray-900">
          {faq.question}
        </span>

        <ChevronDown
          className={`h-5 w-5 text-blue-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 leading-7 text-gray-600">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}