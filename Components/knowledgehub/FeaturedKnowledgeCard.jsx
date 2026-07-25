"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedKnowledgeCard({
  title,
  description,
  badge,
  href,
  items,
  cta,
  icon: Icon,
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full min-h-[320px] overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 shadow-[0_16px_45px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(37,99,235,0.24)]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_45%)]" />

      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 grid h-full w-full gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        {/* LEFT */}
        <div className="flex h-full flex-col">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
            <Icon className="h-3.5 w-3.5" />
            {badge}
          </div>

          {/* Title */}
          <h3 className="mt-5 text-3xl font-bold leading-tight text-white">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-3 max-w-md text-[15px] leading-6 text-blue-100">
            {description}
          </p>

          {/* Pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition group-hover:bg-white/15"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Push CTA to bottom */}
          <div className="flex-1" />

          {/* CTA */}
          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-5">
            <span className="text-sm font-semibold text-white">
              {cta}
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/20">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center justify-center">
          {/* Replace with illustration later */}
          <div className="flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur">
            <Icon className="h-20 w-20 text-white/70" />
          </div>
        </div>
      </div>
    </Link>
  );
}