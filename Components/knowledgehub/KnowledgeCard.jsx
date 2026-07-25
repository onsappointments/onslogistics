"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function KnowledgeCard({
  title,
  description,
  href,
  icon: Icon,
  items = [],
  cta,
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              {title}
            </h3>

            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 transition-all duration-300 group-hover:border-blue-100 group-hover:bg-white ${
                items.length % 2 === 1 &&
                index === items.length - 1
                  ? "col-span-2"
                  : ""
              }`}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="truncate text-[13px] font-medium text-slate-700">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Push footer to bottom */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-sm font-semibold text-blue-600">
            {cta}
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 transition-all duration-300 group-hover:bg-blue-600">
            <ArrowRight className="h-4 w-4 text-blue-600 transition-colors duration-300 group-hover:text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}