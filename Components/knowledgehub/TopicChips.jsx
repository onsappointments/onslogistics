"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { popularTopics } from "./data";

export default function TopicChips() {
  return (
    <section className="mt-20">
      {/* Heading */}
      <div className="flex flex-col items-center text-center">
        <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
          Popular Resources
        </span>

        <h3 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          Explore Popular Topics
        </h3>

        <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
          Jump directly into the most searched customs, logistics and
          government scheme guides.
        </p>
      </div>

      {/* Chips */}
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-4">
        {popularTopics.map((topic) => (
          <Link
            key={topic.title}
            href={topic.href}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg"
          >
            <span>{topic.title}</span>

            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}