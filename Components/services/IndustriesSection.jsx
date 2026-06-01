"use client";

import Link from "next/link";
import {
  Building2,
  Factory,
  Shirt,
  Cpu,
  Car,
  PackageCheck,
  ChevronRight,
} from "lucide-react";

const ICONS = {
  Shirt,
  PackageCheck,
  Factory,
  Building2,
  Cpu,
  Car,
};

const industries = [
  { slug: "textile-exporters", title: "Textile Exporters", icon: "Shirt", description: "Reliable export logistics and freight solutions for garment and textile businesses." },
  { slug: "bicycle-parts-manufacturers", title: "Bicycle Parts Manufacturers", icon: "PackageCheck", description: "Efficient cargo handling and shipment coordination for bicycle component exporters." },
  { slug: "industrial-machinery", title: "Industrial Machinery", icon: "Factory", description: "Heavy cargo movement and industrial equipment transportation support." },
  { slug: "consumer-goods", title: "Consumer Goods", icon: "Building2", description: "Scalable logistics solutions for FMCG and consumer product businesses." },
  { slug: "electronics", title: "Electronics", icon: "Cpu", description: "Secure and fast logistics support for electronics and high-value cargo." },
  { slug: "automotive-components", title: "Automotive Components", icon: "Car", description: "End-to-end supply chain and transportation services for automotive industries." },
];

export default function IndustriesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-5">
            <Building2 className="w-4 h-4" />
            Industries We Support
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5">
            Logistics Solutions for
            <span className="text-blue-600"> Diverse Industries</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
            ONS Logistics supports manufacturers, exporters, and growing businesses across
            multiple industries with tailored freight, transportation, and shipping solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {industries.map((industry) => {
            const Icon = ICONS[industry.icon]; // ← resolve string to component

            return (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group relative rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {Icon && <Icon className="w-8 h-8" />}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {industry.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {industry.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-80 group-hover:opacity-100 transition-all">
                    Learn More
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}