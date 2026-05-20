"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function FlashcardCard({
  card,
  featured = false,
}) {
  const [flipped, setFlipped] =
    useState(false);

  return (
    <div
      onClick={() =>
        setFlipped(!flipped)
      }
      className="
        group
        relative
        h-[250px]
        cursor-pointer
        perspective-[2000px]
      "
    >

      <div
        className={`
          relative
          h-full
          w-full
          duration-700
          [transform-style:preserve-3d]
          ${
            flipped
              ? "[transform:rotateY(180deg)]"
              : ""
          }
        `}
      >

        {/* FRONT */}
        <div
          className={`
            absolute
            inset-0
            overflow-hidden
            rounded-[30px]
            border
            p-6
            flex
            flex-col
            transition-all
            duration-300
            [backface-visibility:hidden]

            ${
              featured
                ? `
                  border-blue-100
                  bg-gradient-to-br
                  from-blue-50
                  to-white
                  shadow-[0_10px_40px_rgba(37,99,235,0.08)]
                `
                : `
                  border-[#E7ECF3]
                  bg-white
                  shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                `
            }

            hover:-translate-y-1
            hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          `}
        >

          {/* GLOW */}
          <div
            className="
              absolute
              inset-0
              opacity-0
              group-hover:opacity-100
              transition
              duration-500
              pointer-events-none
              bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_45%)]
            "
          />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col h-full">

            {/* TOP */}
            <div className="flex items-start justify-between mb-5">

              {/* CATEGORY */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D8E6FF]
                  bg-[#F4F8FF]
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-[#2563EB]
                "
              >

                <Sparkles className="w-3.5 h-3.5" />

                {card.category}

              </div>

              {/* DIFFICULTY */}
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400">

                <Clock3 className="w-3.5 h-3.5" />

                {card.difficulty}

              </div>

            </div>

            {/* QUESTION */}
            <div className="flex-1">

              <h3
                className="
                  text-[28px]
                  leading-[1.08]
                  tracking-[-0.05em]
                  font-bold
                  text-[#0F172A]
                  line-clamp-4
                  transition
                  group-hover:text-blue-600
                "
              >

                {card.question}

              </h3>

            </div>

            {/* FOOTER */}
            <div className="mt-5 flex items-center justify-between">

              <span
                className="
                  text-sm
                  font-medium
                  text-blue-600
                  flex
                  items-center
                  gap-1
                  group-hover:gap-2
                  transition-all
                "
              >

                Reveal Answer

                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

              </span>

              {card.featured && (
                <span
                  className="
                    text-xs
                    bg-blue-600
                    text-white
                    px-2.5
                    py-1
                    rounded-full
                  "
                >

                  Featured

                </span>
              )}

            </div>

          </div>

        </div>

        {/* BACK */}
        <div
          className="
            absolute
            inset-0
            overflow-hidden
            rounded-[30px]
            border
            border-[#D8E6FF]
            bg-gradient-to-br
            from-white
            to-[#F7FAFF]
            p-6
            flex
            flex-col
            shadow-[0_10px_40px_rgba(37,99,235,0.08)]
            [transform:rotateY(180deg)]
            [backface-visibility:hidden]
          "
        >

          {/* GLOW */}
          <div
            className="
              absolute
              inset-0
              pointer-events-none
              bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_45%)]
            "
          />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col h-full">

            {/* TOP */}
            <div className="flex items-center justify-between mb-5">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D8E6FF]
                  bg-[#EEF4FF]
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-[#2563EB]
                "
              >

                <Check className="w-3.5 h-3.5" />

                Answer

              </div>

              <span className="text-[13px] font-medium text-slate-400">
                Click to flip back
              </span>

            </div>

            {/* ANSWER */}
            <div className="flex-1 flex items-center">

              <p
                className="
                  text-[24px]
                  leading-[1.1]
                  tracking-[-0.05em]
                  font-bold
                  text-[#0F172A]
                  max-w-5xl
                "
              >

                {card.answer}

              </p>

            </div>

            {/* FOOTER */}
            <div className="mt-5 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-400">
                Open detailed explanation
              </span>

              <Link
                href={`/resources/flashcards/${card.slug}`}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D8E6FF]
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:bg-blue-50
                  transition
                  "
                >

                    Explain Further

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}