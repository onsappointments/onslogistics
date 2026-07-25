"use client";

import { stats } from "./data";

export default function StatsStrip() {
  return (
    <section className="mt-20 overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="grid divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center px-8 py-10 text-center"
          >
            <div className="text-4xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </div>

            <div className="mt-3 text-sm font-medium uppercase tracking-wider text-slate-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}