import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

export default function FinalCTA() {
  const situations = [
    "Importing raw materials",
    "Exporting finished goods",
    "Shipping through CONCOR Dhandari Kalan",
    "Working with GRFL",
    "Planning shipments via Pristine Logistics Park",
    "Preparing customs documentation",
    "Managing recurring import or export shipments",
    "Expanding into international markets",
  ];

  const services = [
    "Import Customs Clearance",
    "Export Customs Clearance",
    "Bill of Entry Filing",
    "Shipping Bill Filing",
    "Documentation Review",
    "HS Code Guidance",
    "ICEGATE Assistance",
    "Freight Coordination",
  ];

  return (
    <section className="overflow-hidden rounded-[40px] border border-slate-200 bg-slate-900 text-white">

      <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
          Customs Clearance • Ludhiana
        </span>

        <h2 className="mt-8 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
          Let's simplify your customs clearance.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
          Whether you're importing, exporting, or preparing your first
          international shipment, understanding the customs process early
          helps reduce avoidable delays and improves shipment planning.
          ONS Logistics supports businesses with customs documentation,
          shipment coordination and freight solutions throughout the
          clearance journey.
        </p>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          <div>

            <h3 className="text-xl font-semibold">
              We regularly assist businesses with:
            </h3>

            <ul className="mt-6 space-y-4">
              {situations.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-400" />

                  <span className="text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          <div>

            <h3 className="text-xl font-semibold">
              Common customs services
            </h3>

            <div className="mt-6 flex flex-wrap gap-3">
              {services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">

              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Request a Customs Clearance Quote

                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-8 py-4 font-semibold transition hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" />

                Talk to Our Team
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}