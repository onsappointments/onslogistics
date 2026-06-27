"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";

import { ChallengeItem } from "./types";

interface Props {
  items: ChallengeItem[];
}

export default function ChallengeAccordion({
  items,
}: Props) {
  const [openId, setOpenId] = useState(items[0]?.id);

  return (
    <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">

      {items.map((item, index) => {
        const open = openId === item.id;

        return (
          <section
            key={item.id}
            className={
              index !== items.length - 1
                ? "border-b border-slate-200"
                : ""
            }
          >
            {/* Header */}

            <button
              type="button"
              onClick={() =>
                setOpenId(open ? "" : item.id)
              }
              aria-expanded={open}
              className="flex w-full items-center justify-between px-8 py-7 text-left transition-colors hover:bg-slate-50 lg:px-12"
            >
              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Customs Challenge
                </p>

                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-3xl text-slate-600">
                  {item.shortDescription}
                </p>

              </div>

              <ChevronDown
                className={`h-6 w-6 shrink-0 text-slate-500 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Content */}

            <div
              className={`grid overflow-hidden transition-all duration-500 ${
                open
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">

                <div className="grid gap-8 border-t border-slate-200 bg-slate-50 p-8 lg:grid-cols-2 lg:p-12">

                  {/* LEFT */}

                  <div className="space-y-8">

                    <section>

                      <div className="flex items-center gap-2">

                        <CircleHelp className="h-5 w-5 text-blue-600" />

                        <h4 className="font-semibold text-slate-900">
                          Why This Happens
                        </h4>

                      </div>

                      <p className="mt-3 leading-8 text-slate-600">
                        {item.whyItHappens}
                      </p>

                    </section>

                    <section>

                      <div className="flex items-center gap-2">

                        <AlertTriangle className="h-5 w-5 text-amber-600" />

                        <h4 className="font-semibold text-slate-900">
                          Business Impact
                        </h4>

                      </div>

                      <p className="mt-3 leading-8 text-slate-600">
                        {item.businessImpact}
                      </p>

                    </section>

                    <section>

                      <div className="flex items-center gap-2">

                        <Lightbulb className="h-5 w-5 text-emerald-600" />

                        <h4 className="font-semibold text-slate-900">
                          How to Prepare
                        </h4>

                      </div>

                      <p className="mt-3 leading-8 text-slate-600">
                        {item.howToPrepare}
                      </p>

                    </section>

                  </div>

                  {/* RIGHT */}

                  <div className="space-y-8">

                    <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">

                      <div className="flex items-center gap-2">

                        <ShieldCheck className="h-5 w-5 text-blue-700" />

                        <h4 className="font-semibold text-blue-900">
                          How ONS Logistics Can Help
                        </h4>

                      </div>

                      <p className="mt-4 leading-8 text-slate-700">
                        {item.onsSupport}
                      </p>

                    </section>

                    <section>

                      <h4 className="font-semibold text-slate-900">
                        Related Topics
                      </h4>

                      <div className="mt-5 flex flex-wrap gap-2">

                        {item.relatedTopics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                          >
                            {topic}
                          </span>
                        ))}

                      </div>

                    </section>

                    <Link
                      href={item.learnMoreHref}
                      className="inline-flex items-center gap-2 font-semibold text-blue-700 transition-all hover:gap-3"
                    >
                      Read Detailed Guide

                      <ArrowRight className="h-4 w-4" />

                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </section>
        );
      })}

    </div>
  );
}