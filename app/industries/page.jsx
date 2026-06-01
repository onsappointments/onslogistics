// app/industries/page.jsx
// ONS Logistics — Industries Listing Page

import Link from "next/link";
import Image from "next/image";
import {
  Building2, Factory, Shirt, Cpu, Car, PackageCheck,
  ArrowRight, ChevronRight, Globe, ShieldCheck, Clock,
  CheckCircle, Anchor, FileText, Headphones, TrendingUp,
  MapPin, Award, Users, ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "Industries We Serve | ONS Logistics Ludhiana",
  description:
    "ONS Logistics provides tailored freight, export, and supply chain solutions for textile exporters, bicycle manufacturers, industrial machinery, consumer goods, electronics, and automotive component businesses across Punjab and India.",
  alternates: { canonical: "https://onslog.com/industries" },
  openGraph: {
    title: "Industries We Serve | ONS Logistics",
    description:
      "Tailored logistics for textile, bicycle, machinery, FMCG, electronics, and automotive industries. Serving Ludhiana, Punjab and all of India.",
    type: "website",
    url: "https://onslog.com/industries",
  },
};

/* ── Data ─────────────────────────────────────────────────────── */
const ICONS = { Shirt, PackageCheck, Factory, Building2, Cpu, Car };

const industries = [
  {
    slug: "textile-exporters",
    icon: "Shirt",
    title: "Textile Exporters",
    tagline: "End-to-End Export Freight for Garment & Fabric Businesses",
    description:
      "Reliable freight forwarding, customs clearance, and export logistics for garment manufacturers and fabric exporters in Ludhiana and Punjab.",
    highlights: ["Sea & Air Freight", "ICD Ludhiana Handling", "GST Refund Docs"],
    color: "blue",
    stat: "₹500Cr+ cargo moved",
  },
  {
    slug: "bicycle-parts-manufacturers",
    icon: "PackageCheck",
    title: "Bicycle Parts",
    tagline: "Precision Cargo Handling for India's Cycle Component Exporters",
    description:
      "Specialised cargo handling and export logistics for bicycle component manufacturers — from bulk sea freight to anti-corrosion packaging.",
    highlights: ["Bulk Sea Freight", "VCI Packaging", "FTA Compliance"],
    color: "indigo",
    stat: "15+ export markets served",
  },
  {
    slug: "industrial-machinery",
    icon: "Factory",
    title: "Industrial Machinery",
    tagline: "Heavy-Lift & Project Cargo for Machinery Manufacturers",
    description:
      "ODC transport, flat-rack containers, and end-to-end project cargo logistics for industrial equipment and capital goods exporters.",
    highlights: ["ODC Transport", "Flat Rack & Break Bulk", "Marine Insurance"],
    color: "slate",
    stat: "500+ ODC consignments",
  },
  {
    slug: "consumer-goods",
    icon: "Building2",
    title: "Consumer Goods",
    tagline: "Scalable Logistics for FMCG & Consumer Product Brands",
    description:
      "Flexible freight and distribution solutions for FMCG companies, household product brands, and D2C exporters across India and international markets.",
    highlights: ["Primary Distribution", "Export Freight", "Retail-Ready Logistics"],
    color: "teal",
    stat: "Pan-India distribution",
  },
  {
    slug: "electronics",
    icon: "Cpu",
    title: "Electronics",
    tagline: "Secure, Fast Logistics for High-Value Electronic Cargo",
    description:
      "ESD-safe handling, air freight priority, and full regulatory compliance for electronics manufacturers and exporters.",
    highlights: ["ESD-Safe Handling", "Air Freight", "DG Battery Compliance"],
    color: "violet",
    stat: "Zero damage record",
  },
  {
    slug: "automotive-components",
    icon: "Car",
    title: "Automotive Components",
    tagline: "Supply Chain & Export Freight for Auto Parts Manufacturers",
    description:
      "JIT delivery, VCI packaging, and export customs support for OEM and aftermarket automotive component manufacturers.",
    highlights: ["JIT Delivery", "VCI Packaging", "Duty Drawback Filing"],
    color: "orange",
    stat: "OEM & aftermarket ready",
  },
];

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   badge: "bg-blue-100 text-blue-700",    border: "border-blue-100",   hover: "group-hover:bg-blue-600",   num: "text-blue-100",   accent: "bg-blue-600" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700", border: "border-indigo-100", hover: "group-hover:bg-indigo-600", num: "text-indigo-100", accent: "bg-indigo-600" },
  slate:  { bg: "bg-slate-100", icon: "text-slate-600",  badge: "bg-slate-100 text-slate-700",  border: "border-slate-200",  hover: "group-hover:bg-slate-700",  num: "text-slate-200",  accent: "bg-slate-700" },
  teal:   { bg: "bg-teal-50",   icon: "text-teal-600",   badge: "bg-teal-100 text-teal-700",    border: "border-teal-100",   hover: "group-hover:bg-teal-600",   num: "text-teal-100",   accent: "bg-teal-600" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700", border: "border-violet-100", hover: "group-hover:bg-violet-600", num: "text-violet-100", accent: "bg-violet-600" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700", border: "border-orange-100", hover: "group-hover:bg-orange-600", num: "text-orange-100", accent: "bg-orange-600" },
};

const trustSignals = [
  { icon: Globe,       value: "50+",    label: "Export Destinations" },
  { icon: Clock,       value: "48 hrs", label: "Avg Customs Clearance" },
  { icon: Award,       value: "22+",    label: "Years of Experience" },
  { icon: Users,       value: "5,000+", label: "Happy Clients" },
  { icon: TrendingUp,   value: "10K+",  label: "Shipments" },
  { icon: Building2,   value: "6",      label: "Industries Served" },
];

const howItWorks = [
  {
    step: "01",
    icon: Headphones,
    title: "Tell Us Your Requirements",
    desc: "Speak to our industry specialist or fill our quick quote form. We understand your cargo, timelines, and compliance needs — no generic templates.",
  },
  {
    step: "02",
    icon: FileText,
    title: "Get a Tailored Plan",
    desc: "We design a freight solution specific to your industry — correct Incoterms, best routing, required certifications, and competitive pricing.",
  },
  {
    step: "03",
    icon: Anchor,
    title: "We Handle Everything",
    desc: "From factory pickup to customs clearance, port operations, and destination delivery — our team manages every checkpoint so you don't have to.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Track & Optimise",
    desc: "Real-time shipment updates and post-delivery analytics help you reduce costs, improve lead times, and plan future consignments smarter.",
  },
];

const capabilities = [
  {
    title: "ICD Ludhiana",
    desc: "Direct container stuffing under customs supervision — faster clearance, lower costs for Punjab exporters.",
    icon: MapPin,
  },
  {
    title: "Port Coverage",
    desc: "JNPT, Mundra, Chennai, ICD Ludhiana — we handle origin freight to all major Indian gateways.",
    icon: Anchor,
  },
  {
    title: "Documentation",
    desc: "In-house team manages shipping bills, certificates of origin, and full compliance paperwork.",
    icon: FileText,
  },
  {
    title: "Global Network",
    desc: "Agent partnerships in 50+ countries ensure smooth last-mile delivery at destination.",
    icon: Globe,
  },
  {
    title: "Industry Experts",
    desc: "Dedicated account managers with deep domain knowledge in your specific sector.",
    icon: Users,
  },
];

const faqs = [
  {
    q: "Which industries does ONS Logistics specialise in?",
    a: "ONS Logistics has deep expertise in six key industries: textile & garment exporters, bicycle parts manufacturers, industrial machinery, consumer goods & FMCG, electronics, and automotive components. Each vertical has a dedicated logistics framework with industry-specific documentation, packaging, and compliance support.",
  },
  {
    q: "Can ONS Logistics handle export shipments from Ludhiana?",
    a: "Yes. We are based in Ludhiana and have direct access to ICD Ludhiana (Sahnewal), which allows container stuffing under customs supervision. This means faster clearance, lower trucking costs to the port, and end-to-end visibility for exporters in Punjab.",
  },
  {
    q: "Do you provide door-to-door logistics for international shipments?",
    a: "Absolutely. Our services cover the entire supply chain — factory pickup in Punjab, ICD or port handling, customs clearance, sea/air freight, destination customs, and last-mile delivery. We work with agent partners in 50+ countries for seamless international coverage.",
  },
  {
    q: "What is the typical customs clearance time for export shipments?",
    a: "For well-documented shipments processed through ICD Ludhiana or major ports, customs clearance typically takes 24–48 hours. Our in-house documentation team ensures all paperwork (shipping bills, CoO, packing lists) is accurate and submitted ahead of schedule to avoid delays.",
  },
  {
    q: "Does ONS Logistics provide marine insurance for cargo?",
    a: "Yes. We offer marine cargo insurance for all shipment types, including ODC and project cargo. We recommend all-risk cover and can arrange it as part of your freight solution. Our team assists with claims documentation if required.",
  },
  {
    q: "How do I get a freight quote from ONS Logistics?",
    a: "You can request a quote through our Contact page, call us directly at +91-99888-87971, or email info@onslog.com. Our team typically responds within 2 hours during business hours (Mon–Sat, 9 AM–6 PM).",
  },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function IndustriesPage() {
  return (
    <main className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screenflex items-center">
        <Image
          src="/industry/industries-hero.png"
          alt="Industries We Serve — ONS Logistics"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-blue-900/30" />
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-12 py-16 md:py-22">
          <nav className="mb-10 flex items-center gap-2 text-sm text-blue-200/70">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="h-3.5 w-3.5 text-blue-400/50" />
            <span className="text-white font-medium">Industries</span>
          </nav>

          {/* Two-col hero layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <Building2 className="h-4 w-4 flex-shrink-0" />
                Industries We Support
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl xl:text-6xl">
                Logistics Built for{" "}
                <span className="text-blue-400">Your Industry</span>
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
                ONS Logistics delivers tailored freight, export, and supply chain solutions
                for manufacturers and exporters across Punjab and India — with deep expertise
                in six key industries.
              </p>

              <ul className="mb-10 space-y-2.5 ">
                {[
                  "Industry-specific documentation & compliance",
                  "ICD Ludhiana access — faster, cheaper clearance",
                  "50+ export destinations covered",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>

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
                  Call Us Now
                </Link>
              </div>
            </div>

            {/* Right: industry quick-links floating card */}
            <div className="hidden lg:block">
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-7">
                <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-5">
                  Jump to an Industry
                </p>
                <div className="space-y-2">
                  {industries.map((ind) => {
                    const Icon = ICONS[ind.icon];
                    const c = colorMap[ind.color];
                    return (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/10"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg} ${c.icon} flex-shrink-0`}>
                          {Icon && <Icon className="h-4 w-4" />}
                        </div>
                        <span className="flex-1 text-sm font-medium text-white">{ind.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-blue-300/50 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-300" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-3 divide-x divide-blue-500/30 md:grid-cols-6">
            {trustSignals.map(({ icon: Icon, value, label }) => (
              <div key={label} className="px-4 py-7 text-center">
                <Icon className="mx-auto mb-2 h-4 w-4 text-blue-200" />
                <p className="text-xl font-extrabold text-white md:text-2xl">{value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-blue-200 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY GRID ─────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Six Specialisations
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Deep Expertise Across Every Sector
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Each industry page contains tailored service breakdowns, export guides,
              compliance checklists, FAQs, and featured resources — built specifically for your business type.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((industry, idx) => {
              const Icon = ICONS[industry.icon];
              const c = colorMap[industry.color];
              return (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Coloured header strip */}
                  <div className={`relative flex items-start justify-between p-7 pb-5 ${c.bg}`}>
                    <span className={`pointer-events-none absolute right-5 top-3 select-none text-7xl font-black ${c.num}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ${c.icon} transition-all duration-300 ${c.hover} group-hover:text-white`}>
                      {Icon && <Icon className="h-7 w-7" />}
                    </div>
                    {/* Stat pill */}
                    <span className={`relative z-10 self-end rounded-full border ${c.border} ${c.badge} px-3 py-1 text-[11px] font-semibold`}>
                      {industry.stat}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-7 pt-5">
                    <h3 className="mb-1.5 text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {industry.title}
                    </h3>
                    <p className="mb-4 text-xs font-medium text-slate-400 leading-snug">
                      {industry.tagline}
                    </p>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                      {industry.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {industry.highlights.map((h) => (
                        <span key={h} className={`rounded-full border px-3 py-1 text-xs font-medium ${c.badge} ${c.border}`}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-xs text-slate-400">Services · FAQs · Resources</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all group-hover:gap-2">
                        Explore <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Simple Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How ONS Logistics Works for You
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              From first enquiry to final delivery — a streamlined, transparent process
              designed around your industry's specific needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  {/* Connector line */}
                  {idx < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(100%-1rem)] w-8 h-px bg-gradient-to-r from-blue-200 to-blue-100 z-10" />
                  )}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7 h-full hover:border-blue-100 hover:bg-blue-50/40 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-3xl font-black text-blue-100 leading-none">{step.step}</span>
                    </div>
                    <h3 className="mb-2 text-base font-bold text-slate-900">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY ONS — CAPABILITIES GRID ───────────────────────────── */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            {/* Left: copy */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Why ONS Logistics
              </p>
              <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                One Partner for Every{" "}
                <span className="text-blue-400">Stage of Your Supply Chain</span>
              </h2>
              <p className="mb-6 text-slate-400 leading-relaxed">
                Based in Ludhiana — the heart of Punjab's manufacturing belt — ONS Logistics
                has built freight corridors to every major Indian port and onward to 50+ global
                markets. Whether you need a single LCL shipment or a fully managed 3PL solution,
                we scale to fit.
              </p>
              <p className="mb-8 text-slate-400 leading-relaxed">
                Our industry specialists don't just move cargo — they understand the nuances
                of your sector: the export documentation for textile GST refunds, the VCI
                packaging requirements for bicycle components, the ESD handling protocols for
                electronics. That domain knowledge is what separates ONS from a generic freight broker.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500"
              >
                Talk to a Specialist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: capability cards */}
            <div className="grid grid-cols-2 gap-4">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.title} className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 hover:border-blue-500/40 hover:bg-slate-800 transition-all duration-300">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
                      <Icon className="h-4.5 w-4.5 text-blue-400" />
                    </div>
                    <h3 className="mb-2 font-bold text-white text-sm">{cap.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-400">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT BLOCK ─────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">About Our Services</p>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Freight & Export Logistics for Punjab's Key Industries
              </h2>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Ludhiana's Trusted Freight Partner</h3>
                <p>
                  Ludhiana is India's largest industrial city and the hub of Punjab's manufacturing economy.
                  ONS Logistics was founded here with a mission to give local manufacturers and exporters
                  access to world-class freight forwarding — without the middlemen, delays, or hidden charges
                  that plague the industry.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">ICD Ludhiana — Your Competitive Edge</h3>
                <p>
                  Our proximity to ICD Ludhiana (Sahnewal) gives exporters a significant advantage.
                  Containers can be stuffed and sealed under customs supervision right here in Punjab,
                  reducing port trucking costs and clearing formalities days faster than shipping
                  unstuffed cargo to JNPT or Mundra.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Compliance You Can Count On</h3>
                <p>
                  Every industry has its own regulatory landscape. Our in-house documentation team
                  handles shipping bills, certificates of origin, packing lists, RCMC coordination,
                  duty drawback filings, and FTA-origin declarations — ensuring zero compliance
                  surprises at the border.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Scalable for Every Business Size</h3>
                <p>
                  Whether you're a first-time exporter shipping a single LCL consignment or an
                  established manufacturer moving FCL containers monthly, ONS Logistics scales
                  to your volume. Our pricing is transparent and our SLAs are committed in writing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Common Questions
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Everything you need to know about our industry-specific logistics services.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-7 py-5 text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-7 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            Have a question not listed here?{" "}
            <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
              Contact our team →
            </Link>
          </p>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-8 py-16 md:px-16">
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-3">Ready to Ship?</p>
                <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
                  Don't See Your Industry?
                </h2>
                <p className="text-blue-200 leading-relaxed">
                  We work with businesses across all manufacturing and trading sectors.
                  Tell us your requirements and we'll build a logistics solution that fits
                  your cargo, your timelines, and your budget — no generic packages.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Get a Custom Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}