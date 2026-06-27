export default function TrustBar() {
  const trustItems = [
    "Import Documentation",
    "Export Documentation",
    "Bill of Entry",
    "Shipping Bill",
    "ICEGATE Assistance",
    "HS Code Guidance",
    "Business Support",
  ];

  const icds = [
    "CONCOR Dhandari Kalan",
    "GRFL",
    "Pristine Logistics Park",
  ];

  return (
    <section
      aria-labelledby="trust-heading"
      className="border-y border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr] lg:items-center">
          <div>
            <p
              id="trust-heading"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600"
            >
              Trusted Customs Clearance Support
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-blue-300 hover:text-blue-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Nearby ICD Coverage
            </p>

            <div className="mt-4 space-y-3">
              {icds.map((icd) => (
                <div
                  key={icd}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <span className="font-medium text-slate-800">{icd}</span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Nearby
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              ONS Logistics provides customs clearance and documentation support
              for businesses operating through Ludhiana and nearby inland
              container depot facilities. Availability and shipment routing
              depend on cargo type, customs requirements, and carrier schedules.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}