"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Workflow,
  HelpCircle,
  Globe,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function KnowledgeHubGateway() {
  return (
    <section className="relative px-6 pt-6 pb-24 overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-white" />

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-100/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-16">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            <Sparkles className="w-4 h-4" />
            Logistics Knowledge Ecosystem
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Learn Logistics Through
            <span className="block text-blue-600">
              Interactive Knowledge Systems
            </span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Explore logistics operations, customs clearance,
            freight forwarding, import-export workflows,
            shipping documentation, and global trade systems
            through articles, interactive flowcharts, and FAQs.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ARTICLES */}
          <Link
            href="/resources"
            className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]"
          >

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <BookOpen className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-4">
                <TrendingUp className="w-4 h-4" />
                Logistics Articles
              </div>

              <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                In-Depth
                <span className="block">
                  Trade Guides
                </span>
              </h3>

              <p className="mt-5 text-slate-600 leading-relaxed">
                Explore expert-written articles on freight forwarding,
                shipping costs, customs clearance, container logistics,
                warehousing, and international trade operations.
              </p>

              {/* MINI PREVIEW */}
              <div className="mt-8 space-y-3">

                {[
                  "How Customs Clearance Works in India",
                  "Sea Freight vs Air Freight",
                  "Documents Required for Export",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </div>
                ))}

              </div>

              <div className="mt-10 flex items-center gap-2 font-semibold text-blue-600">
                Explore Articles

                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

            </div>
          </Link>

          {/* FLOWCHART */}
          <Link
            href="/resources/flowchart"
            className="group relative overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-8 shadow-[0_20px_60px_rgba(37,99,235,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(37,99,235,0.28)]"
          >

            {/* GLOW */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_40%)]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-blue-100 mb-6">
                <Globe className="w-3 h-3" />
                Interactive Experience
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8 backdrop-blur-sm">
                <Workflow className="w-7 h-7" />
              </div>

              <h3 className="text-3xl font-bold text-white leading-tight">
                Interactive
                <span className="block text-blue-100">
                  Logistics Explorer
                </span>
              </h3>

              <p className="mt-5 text-blue-100 leading-relaxed">
                Navigate complex logistics systems visually through
                expandable flowcharts, connected workflows,
                and AI-style logistics knowledge panels.
              </p>

              {/* MINI FLOWCHART */}
              <div className="relative mt-10 h-[220px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">

                {/* CONNECTORS */}
                <div className="absolute top-12 left-1/2 w-[2px] h-12 bg-white/20 -translate-x-1/2" />

                <div className="absolute top-24 left-[25%] right-[25%] h-[2px] bg-white/20" />

                <div className="absolute top-24 left-[25%] w-[2px] h-10 bg-white/20" />

                <div className="absolute top-24 right-[25%] w-[2px] h-10 bg-white/20" />

                {/* ROOT */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white text-blue-700 px-5 py-3 text-sm font-bold shadow-xl">
                  Logistics
                </div>

                {/* CHILDREN */}
                <div className="absolute bottom-10 left-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white">
                  Freight
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white">
                  Customs
                </div>

                <div className="absolute bottom-10 right-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white">
                  Export
                </div>

              </div>

              <div className="mt-10 flex items-center gap-2 font-semibold text-white">
                Open Flowcharts

                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

            </div>
          </Link>

          {/* FAQ */}
          <Link
            href="/resources/faq"
            className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <HelpCircle className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-4">
                <Sparkles className="w-4 h-4" />
                Logistics FAQs
              </div>

              <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                Instant
                <span className="block">
                  Trade Answers
                </span>
              </h3>

              <p className="mt-5 text-slate-600 leading-relaxed">
                Find expert answers on shipping timelines,
                customs duties, freight pricing,
                documentation, import-export regulations,
                and logistics operations.
              </p>

              {/* FAQ PREVIEW */}
              <div className="mt-8 space-y-4">

                {[
                  "How long does customs clearance take?",
                  "What documents are needed for export?",
                  "Sea freight or air freight?",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-600" />

                    <span className="text-sm font-medium text-slate-700 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

              <div className="mt-10 flex items-center gap-2 font-semibold text-blue-600">
                Browse FAQs

                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

            </div>
          </Link>

        </div>

        {/* BOTTOM CTA */}
        <div className="mt-16 text-center">

          <Link
            href="/resources"
            className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-5 text-white font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1"
          >
            Explore the Logistics Knowledge Hub

            <ArrowRight className="w-5 h-5" />
          </Link>

        </div>

      </div>
    </section>
  );
}