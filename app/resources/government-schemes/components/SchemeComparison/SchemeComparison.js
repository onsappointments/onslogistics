import comparison from "../../data/comparison";

import ComparisonTable from "./ComparisonTable";
import ComparisonCard from "./ComparisonCard";

export default function SchemeComparison() {
  return (
    <section
      id="scheme-comparison"
      aria-labelledby="scheme-comparison-heading"
      className="bg-gray-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Compare Government Schemes
          </span>

          <h2
            id="scheme-comparison-heading"
            className="mt-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl"
          >
            Compare India's Major Trade Schemes
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Every government scheme offers different advantages depending on
            your business model. Compare them side-by-side to understand which
            programme best matches your manufacturing, import, export or
            compliance requirements.
          </p>
        </div>

        {/* Desktop */}

        <div className="mt-16 hidden lg:block">
          <ComparisonTable schemes={comparison} />
        </div>

        {/* Mobile */}

        <div className="mt-12 grid gap-6 lg:hidden">
          {comparison.map((scheme) => (
            <ComparisonCard
              key={scheme.id}
              scheme={scheme}
            />
          ))}
        </div>

        {/* Disclaimer */}

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm leading-7 text-gray-700">
            <strong>Note:</strong> This comparison is intended as a quick
            reference. Eligibility, documentation, compliance obligations and
            financial benefits vary depending on your products, business
            structure and applicable DGFT and CBIC regulations. Read the
            detailed guides before making business decisions.
          </p>
        </div>
      </div>
    </section>
  );
}