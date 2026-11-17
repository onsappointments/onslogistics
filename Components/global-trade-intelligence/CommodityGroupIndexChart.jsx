
"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = [
  { label: "1Y", value: "1y" },
  { label: "3Y", value: "3y" },
  { label: "5Y", value: "5y" },
  { label: "10Y", value: "10y" },
  { label: "All", value: "all" },
];

const LINE_COLORS = [
  "#2563EB",
  "#059669",
  "#D97706",
  "#7C3AED",
  "#DB2777",
  "#0891B2",
  "#DC2626",
  "#4F46E5",
];

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) return "—";

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

function IndexTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-48 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-3 text-xs font-semibold text-gray-500">
        {formatPeriod(label)}
      </p>

      <div className="space-y-2">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex min-w-0 items-center gap-2 text-xs text-gray-600">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.name}</span>
            </span>

            <span className="text-xs font-semibold tabular-nums text-gray-900">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommodityGroupIndexChart({
  series = [],
  chartData = [],
  range = "5y",
  onRangeChange,
  loading = false,
}) {
  const [visibleSeries, setVisibleSeries] = useState(null);

  const activeSeries = useMemo(() => {
    if (!series.length) return [];

    if (visibleSeries === null) return series;

    return series.filter((item) =>
      visibleSeries.includes(item.indicatorKey)
    );
  }, [series, visibleSeries]);

  const toggleSeries = (indicatorKey) => {
    setVisibleSeries((current) => {
      const currentlyVisible =
        current === null
          ? series.map((item) => item.indicatorKey)
          : current;

      const next = currentlyVisible.includes(indicatorKey)
        ? currentlyVisible.filter((key) => key !== indicatorKey)
        : [...currentlyVisible, indicatorKey];

      return next.length === series.length ? null : next;
    });
  };

  const hasData = chartData.length > 0 && series.length > 0;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-blue-600">
            COMMODITY SECTOR PERFORMANCE
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Commodity group indices
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Compare broad commodity market movements using World Bank
            benchmark indices.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-xl bg-gray-100 p-1">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onRangeChange?.(item.value)}
              disabled={loading}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                range === item.value
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {series.map((item, index) => {
          const isVisible = activeSeries.some(
            (active) => active.indicatorKey === item.indicatorKey
          );

          const color = LINE_COLORS[index % LINE_COLORS.length];

          return (
            <button
              key={item.indicatorKey}
              type="button"
              onClick={() => toggleSeries(item.indicatorKey)}
              aria-pressed={isVisible}
              className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                isVisible
                  ? "border-gray-200 bg-white text-gray-700"
                  : "border-transparent bg-gray-100 text-gray-400"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isVisible ? color : "#9CA3AF",
                }}
              />
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 h-[300px] w-full sm:h-[340px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Updating index data...
            </div>
          </div>
        )}

        {!hasData ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 px-5 text-center">
            <div>
              <p className="text-sm font-medium text-gray-700">
                No commodity group index data available
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Index observations will appear here after successful
                World Bank Monthly Indices ingestion.
              </p>
            </div>
          </div>
        ) : activeSeries.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 px-5 text-center">
            <p className="text-sm text-gray-500">
              Select at least one index group from the legend above.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 12, left: 8, bottom: 4 }}
            >
              <CartesianGrid
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatPeriod}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
                tickMargin={12}
              />

              <YAxis
                tickFormatter={formatNumber}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={55}
                tickMargin={8}
                domain={["auto", "auto"]}
              />

              <Tooltip
                content={<IndexTooltip />}
                labelFormatter={(value) => value}
                cursor={{
                  stroke: "#93C5FD",
                  strokeDasharray: "4 4",
                }}
              />

              {activeSeries.map((item) => {
                const originalIndex = series.findIndex(
                  (entry) =>
                    entry.indicatorKey === item.indicatorKey
                );

                return (
                  <Line
                    key={item.indicatorKey}
                    type="monotone"
                    dataKey={item.indicatorKey}
                    name={item.name}
                    stroke={
                      LINE_COLORS[
                        originalIndex % LINE_COLORS.length
                      ]
                    }
                    strokeWidth={2.2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                    connectNulls={false}
                    isAnimationActive={!loading}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 flex flex-col justify-between gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:flex-row">
        <span>
          {chartData.length} monthly observations · World Bank global indices
        </span>

        <span>
          Index base: 2010 = 100 · Higher values indicate a higher index
          relative to the base period.
        </span>
      </div>
    </section>
  );
}
