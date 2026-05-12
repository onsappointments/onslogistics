"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Workflow,
  MessagesSquare,
} from "lucide-react";

const learningItems = [
  {
    title: "Blogs",
    description:
      "Read detailed logistics guides covering shipping, customs, freight, export processes, and international trade.",
    href: "#articles",
    icon: BookOpen,
    active: true,
    badge: "Default",
  },
  {
    title: "Interactive Flowcharts",
    description:
      "Understand complex logistics processes visually through interactive step-by-step flowcharts.",
    href: "/resources/flowchart",
    icon: Workflow,
    badge: "Interactive",
  },
  {
    title: "FAQs",
    description:
      "Find quick answers to common questions about logistics, shipping timelines, customs, and freight costs.",
    href: "resources/faq",
    icon: MessagesSquare,
    badge: "Quick Answers",
  },
];

export default function LearningPaths() {
  return (
    <section className="relative mt-14">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fbff] to-white rounded-[32px]" />

      <div className="relative border border-gray-200/70 rounded-[32px] p-8 md:p-12 overflow-hidden bg-white/80 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.04)]">
        {/* GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

        {/* HEADER */}
        <div className="relative z-10 max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-700 text-sm font-medium mb-5">
            Logistics Learning Hub
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
            Learn Logistics Through
            <span className="block text-blue-600">
              Articles, Flowcharts & FAQs
            </span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg mt-4 leading-relaxed">
            Explore logistics in the format that works best for you —
            in-depth guides, interactive process maps, and quick
            answers for shipping, customs, freight, and exports.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {learningItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={item.href}>
                  <div
                    className={`
                      relative h-full rounded-[28px] border transition-all duration-300 overflow-hidden
                      ${
                        item.active
                          ? "border-blue-200 bg-gradient-to-b from-blue-50 to-white"
                          : "border-gray-200 bg-white hover:border-blue-200"
                      }
                    `}
                  >
                    {/* HOVER GRADIENT */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-50 via-transparent to-blue-100/40" />

                    {/* TOP BAR */}
                    <div className="absolute top-0 left-0 h-[3px] w-0 group-hover:w-full bg-blue-600 transition-all duration-500" />

                    <div className="relative p-7 flex flex-col h-full">
                      {/* ICON */}
                      <div
                        className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all
                          ${
                            item.active
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 group-hover:bg-blue-600 group-hover:text-white"
                          }
                        `}
                      >
                        <Icon size={26} />
                      </div>

                      {/* BADGE */}
                      <div className="mb-4">
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                          {item.badge}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {item.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-gray-600 leading-relaxed text-sm md:text-[15px] flex-grow">
                        {item.description}
                      </p>

                      {/* CTA */}
                      <div className="mt-8 flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-600">
                          Explore
                        </span>

                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-600 transition-all flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}