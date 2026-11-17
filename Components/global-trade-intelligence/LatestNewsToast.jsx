
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X,
  Newspaper,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const AUTO_CYCLE_MS = 7000;
const INITIAL_DELAY_MS = 2000;

function formatPublishedDate(date) {
  if (!date) return "Recently published";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatCategory(category) {
  if (!category) return "Trade update";

  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function LatestNewsToast({ news = [] }) {
  const articles = news.filter(
    (article) =>
      article &&
      article.title &&
      article.url &&
      /^https?:\/\//i.test(article.url)
  );

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setVisible(true),
      INITIAL_DELAY_MS
    );

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (
      !visible ||
      dismissed ||
      paused ||
      articles.length <= 1
    ) {
      return;
    }

    const progressTimer = window.setInterval(() => {
      setProgress((current) =>
        current >= 100 ? 100 : current + 100 / (AUTO_CYCLE_MS / 70)
      );
    }, 70);

    const cycleTimer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % articles.length);
      setProgress(0);
    }, AUTO_CYCLE_MS);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(cycleTimer);
    };
  }, [visible, dismissed, paused, index, articles.length]);

  const goTo = useCallback(
    (direction) => {
      if (!articles.length) return;

      setIndex(
        (current) =>
          (current + direction + articles.length) % articles.length
      );
      setProgress(0);
    },
    [articles.length]
  );

  if (dismissed || articles.length === 0) {
    return null;
  }

  const article = articles[index];

  if (!article) return null;

  return (
    <aside
      aria-label="Latest global trade news"
      className={`
        fixed bottom-5 right-5 z-[80]
        w-[min(360px,calc(100vw-2rem))]
        transition-all duration-500 ease-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0 pointer-events-none"
        }
      `}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-slate-900/15">
        {/* Header */}
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#0f2a6e] to-[#1a4bc0] px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <Newspaper className="h-4 w-4 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">
              Latest Trade Update
            </p>
            <p className="text-xs font-medium text-white">
              Global Trade Intelligence
            </p>
          </div>

          {articles.length > 1 && (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => goTo(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-white/75 transition hover:bg-white/15 hover:text-white"
                aria-label="Previous article"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => goTo(1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-white/75 transition hover:bg-white/15 hover:text-white"
                aria-label="Next article"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/70 transition hover:bg-white/15 hover:text-white"
            aria-label="Dismiss latest news"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-[3px] bg-blue-50">
          <div
            className="h-full bg-blue-600 transition-[width] duration-75 ease-linear"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Article */}
        <div
          key={article.slug || article.url}
          className="p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
              {formatCategory(article.category)}
            </span>

            <span className="shrink-0 text-[10px] text-gray-400">
              {formatPublishedDate(article.publishedAt)}
            </span>
          </div>

          <h3 className="mb-2 text-sm font-semibold leading-snug text-gray-900">
            {article.title}
          </h3>

          <div className="mb-4 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="font-medium text-gray-700">
              {article.source || "Trade news source"}
            </span>
            {article.sourceDomain && (
              <>
                <span>·</span>
                <span className="truncate">{article.sourceDomain}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
            >
              Read full article
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            {articles.length > 1 && (
              <div className="flex items-center gap-1">
                {articles.map((item, itemIndex) => (
                  <button
                    key={item._id || item.slug || item.url}
                    type="button"
                    onClick={() => {
                      setIndex(itemIndex);
                      setProgress(0);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      itemIndex === index
                        ? "w-4 bg-blue-600"
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Show article ${itemIndex + 1}`}
                    aria-current={itemIndex === index ? "true" : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-4 py-2">
          <span className="text-[10px] text-gray-400">
            {index + 1} of {articles.length} updates
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
            <ExternalLink className="h-3 w-3" />
            Original source
          </span>
        </div>
      </div>
    </aside>
  );
}
