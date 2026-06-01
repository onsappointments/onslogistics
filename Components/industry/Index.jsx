// components/industry/index.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Factory,
  Shirt,
  Cpu,
  Car,
  PackageCheck,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";

const ICONS = {
  Shirt,
  PackageCheck,
  Factory,
  Building2,
  Cpu,
  Car,
};
/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */

export function IndustryHero({ industry }) {
  const Icon = ICONS[industry.icon];
  if (!Icon) return null;

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* ── Background image ── */}
      <Image
        src={industry.heroImage ?? "/industry-hero-default.jpg"}
        alt={industry.title}
        fill
        className="object-cover object-center"
        priority
      />

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-blue-900/30" />

      {/* ── Blue glow accents ── */}
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-12 py-24">

        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-blue-200/70">
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-blue-400/50" />
          <Link href="/industries" className="hover:text-white transition-colors">
            Industries
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-blue-400/50" />
          <span className="text-white font-medium">{industry.title}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <div className="flex flex-col">

            {/* Badge */}
            <div className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <Icon className="h-4 w-4 flex-shrink-0" />
              {industry.title}
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl xl:text-6xl">
              {industry.tagline}
            </h1>

            {/* Description */}
            <p className="mb-8 text-lg leading-relaxed text-slate-300 max-w-xl">
              {industry.heroDescription}
            </p>

            {/* Trust bullets */}
            <ul className="mb-9 space-y-2.5">
              {[
                "Pan-India & international coverage",
                "Transparent pricing, zero hidden charges",
                "End-to-end shipment tracking",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            {/* Keywords */}
            <div className="mb-10 flex flex-wrap gap-2">
              {industry.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1 text-xs text-slate-300"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500 hover:-translate-y-0.5"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="tel:+919988887971"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </Link>
            </div>
          </div>

          {/* ── Right: icon card ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">

              {/* Main card */}
              <div className="relative flex flex-col items-center justify-center gap-6 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl px-10 py-10">

                {/* Icon circle */}
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/20 backdrop-blur-md">
                  <Icon className="h-14 w-14 text-blue-300" />
                </div>

                {/* Industry name */}
                <div className="text-center">
                  <p className="text-xl font-bold text-white mb-1">{industry.title}</p>
                  <p className="text-sm text-blue-200/70">Specialized Logistics</p>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-white/10" />

                {/* Mini stats row */}
                <div className="grid grid-cols-3 gap-4 w-full text-center">
                  {[
                    { value: "22+", label: "Years" },
                    { value: "10K+", label: "Shipments" },
                    { value: "5K+", label: "Clients" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <span className="text-lg font-extrabold text-white leading-none">{s.value}</span>
                      <span className="text-[11px] text-blue-200/60">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative corner pieces */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl border border-blue-500/10 bg-blue-500/5 backdrop-blur-sm -z-10" />
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-xl border border-blue-500/10 bg-blue-500/5 backdrop-blur-sm -z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   CONTENT SECTIONS
══════════════════════════════════════════════════════ */

// Minimal inline markdown parser (bold + bullets only)
function RichText({ text }) {
  const lines = text.split("\n").filter(Boolean);
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        // Bullet lines: "• **Title:** body"
        if (line.startsWith("•")) {
          const content = line.slice(1).trim();
          // Bold prefix detection
          const boldMatch = content.match(/^\*\*(.+?)\*\*[:\s]*(.*)/s);
          if (boldMatch) {
            return (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">
                    {boldMatch[1]}:
                  </span>{" "}
                  {boldMatch[2]}
                </p>
              </div>
            );
          }
          return (
            <div key={i} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <p className="text-slate-700 leading-relaxed">{content}</p>
            </div>
          );
        }
        // Regular paragraph
        return (
          <p key={i} className="text-slate-600 leading-relaxed text-[1.06rem]">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export function IndustryContent({ sections }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="space-y-20">
          {sections.map((section, idx) => (
            <div
              key={section.heading}
              className={`flex flex-col gap-10 lg:flex-row ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Section number + heading */}
              <div className="lg:w-2/5">
                <div className="sticky top-24">
                  <span className="mb-4 block text-5xl font-black text-slate-100 select-none">
                    0{idx + 1}
                  </span>
                  <h2 className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 h-1 w-16 rounded-full bg-blue-600" />
                </div>
              </div>

              {/* Body */}
              <div className="lg:w-3/5">
                <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8 shadow-sm">
                  <RichText text={section.body} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FAQs
══════════════════════════════════════════════════════ */
export function IndustryFAQs({ faqs, industryTitle }) {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Your {industryTitle} Logistics Questions,{" "}
            <span className="text-blue-600">Answered</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Everything you need to know before partnering with ONS Logistics for your industry's freight needs.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                open === i
                  ? "border-blue-200 bg-white shadow-md shadow-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-100 hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-start justify-between gap-4 p-6 text-left"
                aria-expanded={open === i}
              >
                <span
                  className={`text-base font-semibold leading-snug transition-colors ${
                    open === i ? "text-blue-700" : "text-slate-800"
                  }`}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all FAQs */}
        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all FAQs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   RELATED ARTICLES
══════════════════════════════════════════════════════ */
function ArticleCard({ article }) {
  const categoryColors = {
    "Export Guide": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Freight Tips": "bg-blue-50 text-blue-700 border-blue-200",
    Customs: "bg-amber-50 text-amber-700 border-amber-200",
    Compliance: "bg-purple-50 text-purple-700 border-purple-200",
    "Project Cargo": "bg-orange-50 text-orange-700 border-orange-200",
    "Export Strategy": "bg-teal-50 text-teal-700 border-teal-200",
    "Supply Chain": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Packaging: "bg-rose-50 text-rose-700 border-rose-200",
    Insurance: "bg-slate-50 text-slate-700 border-slate-200",
    "DG Cargo": "bg-red-50 text-red-700 border-red-200",
    "Trade Policy": "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  const colorClass =
    categoryColors[article.category] ||
    "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      {/* Category */}
      <span
        className={`mb-4 inline-block self-start rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
      >
        {article.category}
      </span>

      {/* Title */}
      <h3 className="mb-3 text-base font-bold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors">
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="mb-5 flex-1 text-sm text-slate-500 leading-relaxed">
        {article.excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          {article.readTime}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
          Read more
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export function IndustryArticles({ articles }) {
  if (!articles?.length) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <BookOpen className="h-4 w-4" />
              Featured Resources
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Continue Reading
            </h2>
          </div>
          <Link
            href="/resources"
            className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 md:flex transition-colors"
          >
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div
          className={`grid gap-6 ${
            articles.length === 1
              ? "md:grid-cols-1 max-w-md"
              : articles.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
          }`}
        >
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/resources"
            className="text-sm font-semibold text-blue-600"
          >
            Explore all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════════════════ */
export function IndustryCTA({ industry }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-8 py-16 text-center md:px-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

          <h2 className="relative mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Streamline Your{" "}
            <span className="text-blue-200">{industry.title}</span> Logistics?
          </h2>
          <p className="relative mx-auto mb-10 max-w-xl text-blue-200 text-lg">
            Talk to our freight specialists for a customised quote — no commitment required.
          </p>

          <div className="relative flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="mailto:info@onslogistics.com"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}