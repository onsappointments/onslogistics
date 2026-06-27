import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  MessageCircle,
} from "lucide-react";

import { heroData } from "./hero.data";

const locations = [
  "CONCOR Dhandari Kalan",
  "GRFL ICD",
  "Pristine Logistics Park",
];

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col">

      {/* Breadcrumb */}

      <nav
        aria-label="Breadcrumb"
        className="mb-8"
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

          <li>
            <Link
              href="/"
              className="transition-colors hover:text-blue-600"
            >
              Home
            </Link>
          </li>

          <ChevronRight className="h-4 w-4" />

          <li>
            <Link
              href="/services"
              className="transition-colors hover:text-blue-600"
            >
              Services
            </Link>
          </li>

          <ChevronRight className="h-4 w-4" />

          <li
            className="font-medium text-slate-700"
            aria-current="page"
          >
            Customs Clearance Ludhiana
          </li>

        </ol>
      </nav>

      {/* Eyebrow */}

      <div className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
        <span className="text-sm font-semibold tracking-wide text-blue-700">
          {heroData.eyebrow}
        </span>
      </div>

      {/* Heading */}

      <h1 className="mt-8 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl xl:text-7xl">
        {heroData.title}
      </h1>

      {/* Description */}

      <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-600">
        {heroData.description}
      </p>

      {/* Nearby Infrastructure */}

      <div className="mt-8">

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Supporting businesses shipping through
        </p>

        <div className="flex flex-wrap gap-3">

          {locations.map((location) => (
            <div
              key={location}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
            >
              <MapPin className="h-4 w-4 text-blue-600" />

              {location}
            </div>
          ))}

        </div>

      </div>

      {/* CTA */}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

        <Link
          href={heroData.actions[0].href}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700"
        >
          {heroData.actions[0].label}

          <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          href={heroData.actions[1].href}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700"
        >
          <MessageCircle className="h-5 w-5" />

          {heroData.actions[1].label}
        </Link>

      </div>
            {/* Trust Cards */}

      <div className="mt-14 grid gap-5 sm:grid-cols-2">

        {heroData.trustItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Expertise
            </p>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900">
              {item.label}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Supporting businesses with customs documentation, shipment
              planning and compliance throughout the customs clearance process.
            </p>
          </div>
        ))}

      </div>

      {/* Capability Chips */}

      <div className="mt-12">

        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Customs Expertise
        </p>

        <div className="flex flex-wrap gap-3">

          {heroData.capabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <div
                key={capability.id}
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-4 w-4 text-blue-700" />
                </div>

                <span>
                  {capability.label}
                </span>
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}