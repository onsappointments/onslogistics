"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import FlashcardCard from "./FlashcardCard";

export default function FlashcardsStack({
  cards,
}) {
  const [index, setIndex] =
    useState(0);

  const nextCard = () => {
    setIndex(
      (prev) =>
        (prev + 1) %
        cards.length
    );
  };

  const prevCard = () => {
    setIndex(
      (prev) =>
        prev === 0
          ? cards.length - 1
          : prev - 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-10">

        <div>

          <div className="text-sm font-medium text-slate-400 mb-2">
            Interactive Learning Mode
          </div>

          <div className="text-2xl font-bold tracking-tight text-slate-900">
            Card {index + 1} of{" "}
            {cards.length}
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={prevCard}
            className="
              h-12 w-12 rounded-2xl
              border border-slate-200
              bg-white
              flex items-center justify-center
              hover:bg-slate-50
              transition
            "
          >

            <ChevronLeft className="w-5 h-5 text-slate-700" />

          </button>

          <button
            onClick={nextCard}
            className="
              h-12 w-12 rounded-2xl
              border border-blue-100
              bg-blue-50
              flex items-center justify-center
              hover:bg-blue-100
              transition
            "
          >

            <ChevronRight className="w-5 h-5 text-blue-700" />

          </button>

        </div>

      </div>

      {/* STACK */}
      <div className="relative h-[320px]">

        {/* BACK CARD */}
        <div className="
          absolute inset-0
          scale-[0.94]
          translate-y-5
          opacity-40
          pointer-events-none
        ">

          <FlashcardCard
            card={
              cards[
                (index + 1) %
                  cards.length
              ]
            }
          />

        </div>

        {/* MIDDLE CARD */}
        <div className="
          absolute inset-0
          scale-[0.97]
          translate-y-2
          opacity-70
          pointer-events-none
        ">

          <FlashcardCard
            card={
              cards[
                (index + 2) %
                  cards.length
              ]
            }
          />

        </div>

        {/* ACTIVE CARD */}
        <div className="relative z-10">

          <FlashcardCard
            card={cards[index]}
            featured
          />

        </div>

      </div>

    </div>
  );
}