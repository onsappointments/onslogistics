// app/resources/flashcards/[slug]/page.jsx

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Brain,
  Layers3,
} from "lucide-react";

import { flashcards } from "@/Components/resources/flashcards/flashcards-data";

// ─────────────────────────────────────────────────────────────
// STATIC PARAMS
// ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return flashcards.map((card) => ({
    slug: card.slug,
  }));
}

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const card = flashcards.find(
    (c) => c.slug === slug
  );

  if (!card) {
    return {
      title:
        "Flashcard Not Found | ONS Logistics",
    };
  }

  return {
    title: `${card.question} | Logistics Flashcards | ONS Logistics`,

    description:
      card.explanation,

    alternates: {
      canonical: `https://onslog.com/resources/flashcards/${card.slug}`,
    },

    openGraph: {
      title: card.question,

      description:
        card.explanation,

      url: `https://onslog.com/resources/flashcards/${card.slug}`,

      type: "article",
    },
  };
}

// ─────────────────────────────────────────────────────────────
// FAQ SCHEMA
// ─────────────────────────────────────────────────────────────

function buildSchema(card) {
  return {
    "@context":
      "https://schema.org",

    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",

        name: card.question,

        acceptedAnswer: {
          "@type": "Answer",

          text: `${card.answer} ${card.explanation}`,
        },
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default async function FlashcardPage({
  params,
}) {
  const { slug } = await params;

  const card = flashcards.find(
    (c) => c.slug === slug
  );

  if (!card) notFound();

  const relatedCards =
    flashcards
      .filter(
        (c) =>
          c.category ===
            card.category &&
          c.slug !== card.slug
      )
      .slice(0, 3);

  return (
    <>
      {/* SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildSchema(card)
          ),
        }}
      />

      <main className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen">

        {/* BG GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20">

          {/* BACK */}
          <Link
            href="/resources/flashcards"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Flashcards
          </Link>

          {/* HERO */}
          <div className="rounded-[40px] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.06)] overflow-hidden">

            {/* TOP */}
            <div className="p-10 md:p-14 border-b border-slate-100">

              <div className="flex flex-wrap items-center gap-3 mb-8">

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  <Sparkles className="w-4 h-4" />

                  {card.category}
                </div>

                <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                  {card.difficulty}
                </div>

              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-slate-900 max-w-5xl">
                {card.question}
              </h1>

            </div>

            {/* ANSWER */}
            <div className="p-10 md:p-14">

              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16">

                {/* LEFT */}
                <div>

                  {/* DIRECT ANSWER */}
                  <div className="mb-12">

                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
                      <Brain className="w-4 h-4" />
                      Direct Answer
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">
                      {card.answer}
                    </h2>

                  </div>

                  {/* EXPLANATION */}
                  <div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 mb-6">
                      <BookOpen className="w-4 h-4" />
                      Detailed Explanation
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none">

                      <p className="text-slate-600 leading-relaxed text-lg">
                        {card.explanation}
                      </p>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="space-y-8">

                  {/* RELATED LINKS */}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8">

                    <div className="flex items-center gap-2 mb-6">

                      <Layers3 className="w-5 h-5 text-blue-600" />

                      <h3 className="text-xl font-bold text-slate-900">
                        Related Resources
                      </h3>

                    </div>

                    <div className="space-y-4">

                      {card.relatedArticles?.map(
                        (item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:border-blue-200 hover:bg-blue-50/40 transition"
                          >
                            <span className="font-medium text-slate-700 group-hover:text-blue-700 transition">
                              {item.label}
                            </span>

                            <ArrowRight className="w-4 h-4 text-blue-600" />
                          </Link>
                        )
                      )}

                    </div>

                  </div>

                  {/* QUICK FACT */}
                  <div className="rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-8">

                    <div className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500 mb-4">
                      Knowledge Card
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      These interactive logistics flashcards
                      are designed to simplify international
                      trade concepts, freight forwarding,
                      customs clearance, and shipping
                      documentation for importers and exporters.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RELATED FLASHCARDS */}
          {relatedCards.length > 0 && (
            <section className="mt-20">

              <div className="flex items-center justify-between mb-10">

                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Continue Learning
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Explore more logistics knowledge cards.
                  </p>
                </div>

                <Link
                  href="/resources/flashcards"
                  className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                >
                  View All

                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>

              <div className="grid md:grid-cols-3 gap-8">

                {relatedCards.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/resources/flashcards/${item.slug}`}
                    className="group rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  >

                    <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-6">
                      {item.category}
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight leading-snug text-slate-900 group-hover:text-blue-700 transition">
                      {item.question}
                    </h3>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                      Open Card

                      <ArrowRight className="w-4 h-4" />
                    </div>

                  </Link>
                ))}

              </div>

            </section>
          )}

        </div>

      </main>
    </>
  );
}