import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import FlowchartExplorer from "@/Components/resources/FlowchartExplorer";

export const metadata = {
  title:
    "Interactive Logistics Flowcharts | ONS Logistics",

  description:
    "Explore interactive logistics flowcharts covering imports, exports, customs clearance, warehousing, freight forwarding, and shipping processes in India.",

  keywords: [
    "logistics flowchart",
    "import export process India",
    "customs clearance process",
    "freight forwarding guide",
    "warehousing process India",
    "shipping flowchart",
    "international logistics",
    "supply chain flowchart",
  ],
};

export default function FlowchartsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">

          <Link
            href="/resources"
            className="hover:text-blue-600 transition"
          >
            Resources
          </Link>

          <ChevronRight className="w-4 h-4" />

          <span className="font-medium text-slate-900">
            Interactive Flowcharts
          </span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white px-8 py-14 md:px-14 md:py-20">

          {/* BACKGROUND GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100/40" />

          {/* GLOW */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 blur-3xl rounded-full" />

          <div className="relative z-10 max-w-4xl">

            {/* TAG */}
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
              Interactive Logistics Knowledge System
            </div>

            {/* TITLE */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Learn Logistics Through
              <span className="block text-blue-600">
                Interactive Flowcharts
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
              Explore imports, exports,
              customs clearance,
              freight forwarding,
              warehousing,
              sea freight,
              and supply chain operations
              through interactive visual logistics maps.
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-4 mt-10">

              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-white font-medium hover:bg-blue-700 transition"
              >
                Explore Articles

                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/resources/faq"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Browse FAQs
              </Link>

            </div>
          </div>
        </section>

        {/* FLOWCHART */}
        <FlowchartExplorer fullPage />

        {/* RESOURCE NAVIGATION */}
        <section className="mt-16">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Explore More Resources
                </h2>

                <p className="text-slate-600 mt-2">
                  Continue learning through logistics
                  articles and frequently asked questions.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Articles

                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/resources/faq"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
                >
                  FAQs

                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-20 max-w-4xl">

          <div className="space-y-6 text-slate-600 leading-relaxed">

            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              Interactive Logistics Learning Platform
            </h2>

            <p>
              ONS Logistics provides interactive
              logistics flowcharts designed to help
              businesses understand import-export
              workflows, customs clearance,
              freight forwarding,
              warehousing operations,
              shipping documentation,
              and international logistics systems.
            </p>

            <p>
              These interactive logistics maps simplify
              complex supply chain operations and help
              importers, exporters, manufacturers,
              logistics teams,
              and business owners understand
              shipping processes visually.
            </p>

            <p>
              Explore logistics processes covering
              imports into India,
              exports from India,
              sea freight,
              customs compliance,
              warehousing,
              transportation,
              and international trade operations
              through expandable visual flowcharts.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}