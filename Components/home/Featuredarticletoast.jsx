"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { articles } from "@/lib/data";

const featuredArticles = articles.filter((a) => a.featured);
const AUTO_CYCLE_MS    = 7000;
const INITIAL_DELAY_MS = 2000;

export default function FeaturedArticleToast() {
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [idx,       setIdx]       = useState(0);
  const [progress,  setProgress]  = useState(0);
  const [paused,    setPaused]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), INITIAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || dismissed || paused || featuredArticles.length <= 1) return;

    const stepMs = AUTO_CYCLE_MS / 100;

    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, stepMs);

    const cycleTimer = setInterval(() => {
      setIdx((i) => (i + 1) % featuredArticles.length);
      setProgress(0);
    }, AUTO_CYCLE_MS);

    return () => {
      clearInterval(progressTimer);
      clearInterval(cycleTimer);
    };
  }, [visible, dismissed, paused]);

  const goTo = (dir) => {
    setIdx((i) => (i + dir + featuredArticles.length) % featuredArticles.length);
    setProgress(0);
  };

  if (dismissed || featuredArticles.length === 0) return null;

  const article = featuredArticles[idx];

  return (
    <div
      className={`
        absolute top-2 right-2 z-40 w-[300px]
        transition-all duration-500 ease-out
        ${visible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 pointer-events-none"
        }
      `}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-gray-200 bg-white">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#0f2a6e] to-[#1a4bc0] px-4 py-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 flex-1">
            Featured Article
          </span>

          {/* Nav arrows */}
          {featuredArticles.length > 1 && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => goTo(-1)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/15 transition-all"
                aria-label="Previous article"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => goTo(1)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/15 transition-all"
                aria-label="Next article"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/15 transition-all"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-[3px] bg-blue-50">
          <div
            className="h-full bg-gradient-to-r from-[#1a4bc0] to-blue-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Body ── */}
        <div key={idx} className="p-4 animate-in fade-in slide-in-from-bottom-1 duration-300">

          {/* Category + read time */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {article.category}
            </span>
            <span className="text-[10px] text-gray-400">{article.readTime} min read</span>
          </div>

          {/* Title */}
          <h3 className="text-[13.5px] font-semibold text-gray-900 leading-snug mb-2">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-[11.5px] text-gray-500 leading-relaxed line-clamp-2 mb-3.5">
            {article.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Link
              href={`/resources/${article.slug}`}
              className="group inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            >
              Read Guide
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Dot indicators */}
            {featuredArticles.length > 1 && (
              <div className="flex items-center gap-1">
                {featuredArticles.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIdx(i); setProgress(0); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === idx
                        ? "w-4 h-1.5 bg-blue-600"
                        : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Article ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}