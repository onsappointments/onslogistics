import FAQAccordion from "./FAQAccordion";
import ConsultationCard from "./ConsultationCard";

import faqs from "../../data/faq";

export default function FAQConsultation() {
  return (
    <section id="faq-consultation"
    className="bg-slate-50 py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.6fr_0.9fr] lg:px-8">
        <div>
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Answers to Common Questions
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Learn more about India's major government trade
            schemes, eligibility requirements, documentation
            and compliance before making a decision.
          </p>

          <div className="mt-12">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>

        <ConsultationCard />
      </div>
    </section>
  );
}