// app/services/[slug]/page.jsx

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Clock3,
  MapPin,
  Building2,
} from "lucide-react";

import { servicesData } from "@/lib/servicesData";
import IndustriesSection from "@/components/services/IndustriesSection";
import GeoPresenceSection from "@/components/services/GeoPresenceSection";

export async function generateMetadata({ params }) {
  const service = servicesData[params.slug];

  if (!service) {
    return {};
  }

  return {
    title: service.seoTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.seoTitle,
      description: service.metaDescription,
      images: [service.heroImage],
    },
  };
}

export default function ServiceSlugPage({ params }) {
  const service = servicesData[params.slug];

  if (!service) {
    notFound();
  }

  return (
    <main className="bg-[#F5F7FA] overflow-hidden">
      {/* HERO */}
      <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden">
        {/* Background */}
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />

         <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent"></div>

        {/* Glow */}
        <div className="absolute top-32 right-20 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 mb-8">
              <CheckCircle2 className="w-4 h-4 text-blue-300" />

              <span className="text-sm text-white font-medium">
                International Logistics Solutions
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
              {service.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-lg md:text-2xl leading-relaxed text-blue-50 max-w-3xl">
              {service.subtitle}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/request-quote"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-blue-700 px-8 py-4 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-2xl"
              >
                Get Freight Quote
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white px-8 py-4 font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Book Consultation
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {service.stats.map((item) => (
                <div key={item.label}>
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {item.value}
                  </div>

                  <div className="text-sm text-blue-100 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
              <Globe className="w-5 h-5" />
              Logistics Expertise
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-8">
              {service.heading}
            </h2>

            <div className="space-y-6">
              {service.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4 mt-10">
              {service.benefits.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />

                  <p className="text-slate-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {service.features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Our Process
            </h2>

            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Efficient logistics coordination designed for smooth cargo
              movement and reliable shipment execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-8">
            {service.process.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl border border-slate-200 bg-[#F8FAFC] p-8"
              >
                {/* Number */}
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className="pt-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GeoPresenceSection />
      <IndustriesSection />

      {/* RELATED ARTICLES */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Related Logistics Resources
              </h2>

              <p className="mt-4 text-slate-600 text-lg">
                Explore shipping guides, freight insights, and logistics
                resources.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {service.relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group rounded-3xl border border-slate-200 bg-[#F8FAFC] overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8">
                  <div className="text-sm text-blue-600 font-medium mb-4">
                    Logistics Guide
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-900 leading-snug mb-4 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {article.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          {service.faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {faq.question}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-700 p-10 md:p-16 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                Need Logistics Support for Your Shipment?
              </h2>

              <p className="text-blue-100 text-lg leading-relaxed">
                Talk to ONS Logistics for freight forwarding, customs
                clearance, international shipping, and cargo coordination.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <Link
                href="/request-quote"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-blue-700 px-8 py-4 font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Request Quote
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white px-8 py-4 font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}