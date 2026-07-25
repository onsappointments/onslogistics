"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Landmark } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="relative mt-24 overflow-hidden rounded-[36px] border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 px-8 py-14 shadow-[0_25px_80px_rgba(37,99,235,0.18)] lg:px-14">
      {/* Decorative Glow */}
      <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur">
            Continue Learning
          </span>

          <h3 className="mt-6 text-4xl font-bold tracking-tight text-white">
            Ready to Explore the Complete
            <span className="block">
              Trade Knowledge Hub?
            </span>
          </h3>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            Discover expert articles, government schemes,
            customs guidance, interactive learning tools,
            and practical resources built to simplify
            international trade.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/resources"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <BookOpen className="h-5 w-5" />

            Explore Knowledge Hub

            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/resources/government-schemes"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
          >
            <Landmark className="h-5 w-5" />

            Government Schemes
          </Link>
        </div>
      </div>
    </section>
  );
}