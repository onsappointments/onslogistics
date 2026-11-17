
"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

function formatNumber(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "—";
  }

  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatPeriod(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function MoverSection({
  title,
  items = [],
  direction,
  selectedIndicator,
  onSelect,
}) {
  const isGainer = direction === "up";
  const Icon = isGainer ? TrendingUp : TrendingDown;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          {title}
        </h3>

        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            isGainer ? "text-green-700" : "text-red-700"
          }`}
        >
          <Icon size={14} />
          {isGainer ? "Rising" : "Falling"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-gray-50 px-3 py-4 text-center text-xs text-gray-500">
          No reliable movements available for this period.
        </p>
      ) : (
        <div className="space-y-1">
          {items.map((item) => {
            const selected =
              selectedIndicator === item.indicatorKey;

            return (
              <button
                key={item.indicatorKey}
                type="button"
                onClick={() => onSelect?.(item.indicatorKey)}
                aria-pressed={selected}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  selected
                    ? "border-blue-200 bg-blue-50"
                    : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.currency || "USD"}{" "}
                      {formatNumber(item.latestValue)}
                      {" · "}
                      {item.unit || ""}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {formatPeriod(item.latestPeriod)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      isGainer ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {item.changePercent > 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CommodityMarketWatchlist({
  marketMovers,
  selectedIndicator,
  onSelect,
  loading = false,
}) {
  const [period, setPeriod] = useState("3m");

  const movers = marketMovers?.[period] || {
    gainers: [],
    losers: [],
  };

  return (
    <aside className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-blue-600">
              MARKET SCANNER
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
              Market movers
            </h2>
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-500">
            Global
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
          {[
            { label: "3 Months", value: "3m" },
            { label: "12 Months", value: "12m" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
                period === option.value
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="mt-2 text-[11px] text-gray-400">
          Percentage change over the selected period
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {loading && !marketMovers ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading market movements...
          </div>
        ) : (
          <>
            <MoverSection
              title="Top gainers"
              items={movers.gainers}
              direction="up"
              selectedIndicator={selectedIndicator}
              onSelect={onSelect}
            />

            <div className="border-t border-gray-100" />

            <MoverSection
              title="Top losers"
              items={movers.losers}
              direction="down"
              selectedIndicator={selectedIndicator}
              onSelect={onSelect}
            />
          </>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-3">
        <p className="text-[10px] leading-4 text-gray-500">
          Based on available global benchmark observations. Rankings
          exclude stale data and commodities without a matching
          reference month.
        </p>
      </div>
    </aside>
  );
}
