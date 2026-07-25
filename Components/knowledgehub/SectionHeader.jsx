"use client";

import { Sparkles } from "lucide-react";

export default function SectionHeader() {
  return (
    <div className="mx-auto mb-20 max-w-4xl text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
        <Sparkles className="h-4 w-4" />
        Trade Knowledge Hub
      </div>

      {/* Heading */}
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        Everything You Need to Navigate
        <span className="mt-2 block text-blue-600">
          International Trade
        </span>
      </h2>

      {/* Description */}
      <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
        Explore expert resources on customs clearance, government
        schemes, imports, exports, documentation and interactive
        learning—all designed to simplify global trade.
      </p>

      {/* Decorative line */}
      <div className="mx-auto mt-6 h-px w-28 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
    </div>
  );
}