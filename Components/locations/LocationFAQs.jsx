// Components/locations/LocationFAQs.jsx

"use client";

import { useState } from "react";

import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";

export default function LocationFAQs({ data }) {

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 overflow-hidden">

      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">

          {/* TAG */}
          <div className="inline-flex items-center gap-2 text-blue-600 mb-4">

            <HelpCircle className="w-5 h-5" />

            Frequently Asked Questions

          </div>

          {/* TITLE */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">

            Logistics FAQs for Businesses in {data.city}

          </h2>

          {/* SUBTEXT */}
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">

            Explore answers to common questions about freight forwarding,
            customs clearance, cargo movement, shipping timelines, and
            logistics support services.

          </p>

        </div>


        {/* FAQ LIST */}
        <div className="space-y-6">

          {data.faqs.map((faq, index) => {

            const isOpen = openIndex === index;

            return (

              <div
                key={faq.question}
                className="
                  group
                  rounded-[2rem]
                  border
                  border-slate-200
                  bg-white
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
              >

                {/* QUESTION */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-6
                    p-8
                    text-left
                  "
                >

                  <div>

                    <h3 className="
                      text-xl
                      md:text-2xl
                      font-semibold
                      text-slate-900
                      leading-snug
                    ">

                      {faq.question}

                    </h3>

                  </div>

                  {/* ICON */}
                  <div className="
                    shrink-0
                    w-12
                    h-12
                    rounded-2xl
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                  ">

                    <ChevronDown
                      className={`
                        w-6
                        h-6
                        transition-transform
                        duration-300
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />

                  </div>

                </button>


                {/* ANSWER */}
                <div
                  className={`
                    grid
                    transition-all
                    duration-500
                    ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >

                  <div className="overflow-hidden">

                    <div className="px-8 pb-8">

                      <div className="h-px bg-slate-200 mb-6" />

                      <p className="
                        text-lg
                        leading-relaxed
                        text-slate-600
                      ">

                        {faq.answer}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}