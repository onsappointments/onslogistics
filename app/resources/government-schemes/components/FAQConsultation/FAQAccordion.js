"use client";

import { useState } from "react";

import FAQItem from "./FAQItem";

export default function FAQAccordion({
  faqs,
}) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQItem
          key={faq.question}
          faq={faq}
          open={open === index}
          onClick={() =>
            setOpen(
              open === index ? -1 : index
            )
          }
        />
      ))}
    </div>
  );
}