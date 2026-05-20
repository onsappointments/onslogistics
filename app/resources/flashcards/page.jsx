// app/resources/flashcards/page.jsx

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Workflow,
  MessagesSquare,
  Sparkles,
} from "lucide-react";

import FlashcardsSection from "@/Components/resources/flashcards/FlashcardsSection";

export const metadata = {
  title:
    "Logistics Flashcards | ONS Logistics",

  description:
    "Learn freight forwarding, customs clearance, shipping terms, and international trade through interactive logistics flashcards.",

  alternates: {
    canonical:
      "https://onslog.com/resources/flashcards",
  },

  openGraph: {
    title:
      "Interactive Logistics Flashcards | ONS Logistics",

    description:
      "Master freight forwarding, customs clearance, shipping documentation, and logistics workflows through interactive flashcards.",

    url: "https://onslog.com/resources/flashcards",

    type: "website",
  },
};

export default function FlashcardsPage() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

      {/* HERO */}
      
      <section className="relative px-6 pt-24 pb-16">

        <div className="max-w-7xl mx-auto">

          {/* LABEL */}
          <div className="flex justify-center mb-8">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">

              <Sparkles className="w-4 h-4" />

              Logistics Knowledge Hub

            </div>

          </div>

          {/* TITLE */}
          <div className="max-w-5xl mx-auto text-center">

            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.06em] leading-[0.95] text-slate-900">

              Learn Logistics Through

              <span className="block text-blue-600">
                Interactive Flashcards
              </span>

            </h1>

            <p className="mt-8 text-xl leading-relaxed text-slate-600 max-w-3xl mx-auto">

              Master freight forwarding, customs clearance,
              shipping documentation, import-export workflows,
              and global trade concepts through AI-native
              interactive learning cards.

            </p>

          </div>

          {/* KNOWLEDGE HUB CTA */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">

            {/* ARTICLES */}
            <Link
              href="/resources"
              className="
                group relative overflow-hidden
                rounded-[32px]
                border border-slate-200
                bg-white
                p-8
                shadow-[0_10px_40px_rgba(15,23,42,0.04)]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all duration-300
              "
            >

              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

              <div className="relative">

                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mb-8">

                  <BookOpen className="w-7 h-7 text-blue-600" />

                </div>

                <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-5">

                  Logistics Articles

                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">

                  Deep-Dive Industry Resources

                </h2>

                <p className="mt-5 text-slate-600 leading-relaxed">

                  Explore detailed logistics articles,
                  customs procedures, freight forwarding
                  systems, shipping documentation, and
                  international trade guides.

                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-blue-600 font-semibold">

                  Explore Articles

                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />

                </div>

              </div>

            </Link>

            {/* FLOWCHART */}
            <Link
              href="/resources/flowchart"
              className="
                group relative overflow-hidden
                rounded-[32px]
                border border-slate-200
                bg-white
                p-8
                shadow-[0_10px_40px_rgba(15,23,42,0.04)]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all duration-300
              "
            >

              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-100/40 blur-3xl rounded-full pointer-events-none" />

              <div className="relative">

                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 mb-8">

                  <Workflow className="w-7 h-7 text-cyan-600" />

                </div>

                <div className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-5">

                  Interactive Systems

                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">

                  Visual Logistics Flowcharts

                </h2>

                <p className="mt-5 text-slate-600 leading-relaxed">

                  Understand international logistics through
                  expandable visual systems covering freight,
                  customs clearance, documentation, and
                  supply chain workflows.

                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-cyan-600 font-semibold">

                  Open Flowcharts

                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />

                </div>

              </div>

            </Link>

            {/* FAQ */}
            <Link
              href="/resources/faq"
              className="
                group relative overflow-hidden
                rounded-[32px]
                border border-slate-200
                bg-white
                p-8
                shadow-[0_10px_40px_rgba(15,23,42,0.04)]
                hover:-translate-y-1
                hover:shadow-xl
                transition-all duration-300
              "
            >

              <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-100/40 blur-3xl rounded-full pointer-events-none" />

              <div className="relative">

                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 mb-8">

                  <MessagesSquare className="w-7 h-7 text-indigo-600" />

                </div>

                <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-5">

                  AI-Optimized FAQs

                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">

                  Instant Trade Answers

                </h2>

                <p className="mt-5 text-slate-600 leading-relaxed">

                  Get quick answers to import-export,
                  freight forwarding, shipping timelines,
                  customs clearance, duties, and trade
                  compliance questions.

                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-indigo-600 font-semibold">

                  Browse FAQs

                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />

                </div>

              </div>

            </Link>

          </div>

        </div>

      </section>

      {/* FLASHCARDS */}
      <FlashcardsSection />

    </main>
  );
}