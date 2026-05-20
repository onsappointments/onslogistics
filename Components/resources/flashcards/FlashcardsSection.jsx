"use client";

import { useState } from "react";

import FlashcardsGrid from "./FlashcardsGrid";
import FlashcardsStack from "./FlashcardsStack";

import { flashcards } from "./flashcards-data";

export default function FlashcardsSection() {

  const [mode, setMode] =
    useState("grid");

  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            Interactive Logistics Learning
          </div>

          <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Learn Logistics Through

            <span className="block text-blue-600">
              Interactive Knowledge Cards
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Explore freight forwarding,
            customs clearance,
            shipping documentation,
            and international trade concepts
            through interactive learning cards.
          </p>

        </div>

        {/* MODE TOGGLE */}
        <div className="flex justify-center mb-16">

          <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">

            <button
              onClick={() =>
                setMode("grid")
              }
              className={`
                px-6 py-3 rounded-xl text-sm font-semibold transition
                ${
                  mode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >

              Grid Mode

            </button>

            <button
              onClick={() =>
                setMode("stack")
              }
              className={`
                px-6 py-3 rounded-xl text-sm font-semibold transition
                ${
                  mode === "stack"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >

              Stack Mode

            </button>

          </div>

        </div>

        {/* CONTENT */}
        {mode === "grid" ? (

          <FlashcardsGrid
            cards={flashcards}
          />

        ) : (

          <FlashcardsStack
            cards={flashcards}
          />

        )}

      </div>

    </section>
  );
}