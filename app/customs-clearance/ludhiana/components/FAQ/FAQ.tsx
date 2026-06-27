"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

import { faqData } from "./faq.data";

export default function FAQ() {
  const [openId, setOpenId] = useState<string>(
    faqData[0]?.id ?? ""
  );

  return (
    <section
      id="faq"
      className="relative py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">

            <HelpCircle className="h-4 w-4 text-blue-600" />

            <span className="text-sm font-semibold text-blue-700">
              Frequently Asked Questions
            </span>

          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Customs Clearance Questions Answered
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Find answers to some of the most common questions about import
            customs clearance, export documentation, ICEGATE, Bill of Entry,
            Shipping Bill and customs procedures for businesses operating
            through Ludhiana.
          </p>

        </div>

        {/* Accordion */}

        <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

          {faqData.map((faq, index) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={
                  index !== faqData.length - 1
                    ? "border-b border-slate-200"
                    : ""
                }
              >
                {/* Button */}

                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenId(isOpen ? "" : faq.id)
                  }
                  className="flex w-full items-center justify-between px-8 py-7 text-left transition hover:bg-slate-50"
                >
                  <h3 className="max-w-3xl text-lg font-semibold text-slate-900">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {/* Content */}

                <div
                  className={`grid overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">

                    <div className="border-t border-slate-200 bg-slate-50 px-8 py-7">

                      <p className="leading-8 text-slate-600">
                        {faq.answer}
                      </p>

                      {faq.relatedLinks &&
                        faq.relatedLinks.length > 0 && (
                          <div className="mt-8">

                            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                              Related Guides
                            </h4>

                            <div className="mt-4 flex flex-wrap gap-3">

                              {faq.relatedLinks.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                >
                                  {link.title}

                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              ))}

                            </div>

                          </div>
                        )}

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom Note */}

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center">

          <h3 className="text-xl font-semibold text-slate-900">
            Still have questions?
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            Every shipment is different. If your cargo involves specialised
            documentation, multiple products or specific customs requirements,
            our team can help you understand the documentation and customs
            process before your shipment moves.
          </p>

          <Link
            href="/request-quote"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Request a Customs Clearance Quote

            <ArrowRight className="h-5 w-5" />

          </Link>

        </div>

      </div>

    </section>
  );
}