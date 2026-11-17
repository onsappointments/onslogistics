
"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = [
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
  { label: "10Y", value: "10y" },
  { label: "All", value: "all" },
];

const formatNumber = (value) =>
  Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

const formatPeriod = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

const getFreshness = (date) => {
  if (!date) {
    return {
      label: "Date unavailable",
      stale: true,
    };
  }

  const daysOld = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86400000
  );

  if (daysOld > 180) {
    return { label: "Older observation", stale: true };
  }

  if (daysOld > 90) {
    return { label: "Data may be outdated", stale: true };
  }

  return { label: "Recently reported", stale: false };
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 text-xs font-medium text-gray-500">
        {formatPeriod(point.timestamp)}
      </p>

      <p className="text-base font-semibold text-gray-900">
        {point.currency || "USD"} {formatNumber(point.value)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {point.unit}
      </p>
    </div>
  );
}

export default function CommodityPriceChart({
  commodities = [],
  selectedIndicator = null,
  chartData = [],
  range = "5y",
  onIndicatorChange,
  onRangeChange,
  loading = false,
}) {
  const freshness = useMemo(
    () => getFreshness(selectedIndicator?.latestPeriod),
    [selectedIndicator?.latestPeriod]
  );

  const periodChange = useMemo(() => {
    if (chartData.length < 2) return null;

    const first = Number(chartData[0].value);
    const last = Number(chartData[chartData.length - 1].value);

    if (!Number.isFinite(first) || first === 0 || !Number.isFinite(last)) {
      return null;
    }

    return ((last - first) / Math.abs(first)) * 100;
  }, [chartData]);

  if (!commodities.length) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Commodity price trends
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          No commodity observations are available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-blue-600">
            MARKET PULSE
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Commodity price trends
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track global benchmark commodity prices over time.
          </p>
        </div>

        <div className="w-full lg:w-64">
          <label
            htmlFor="gti-commodity-select"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Select commodity
          </label>

          <select
            id="gti-commodity-select"
            value={selectedIndicator?.indicatorKey || ""}
            onChange={(event) =>
              onIndicatorChange?.(event.target.value)
            }
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {commodities.map((commodity) => (
              <option
                key={commodity.indicatorKey}
                value={commodity.indicatorKey}
              >
                {commodity.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected commodity details */}
      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-gray-500">
            {selectedIndicator?.name || "Selected commodity"}
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-gray-900">
              {selectedIndicator?.latestValue != null
                ? formatNumber(selectedIndicator.latestValue)
                : "—"}
            </span>

            <span className="text-sm text-gray-500">
              {selectedIndicator?.unit || ""}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Latest observation:{" "}
            {formatPeriod(selectedIndicator?.latestPeriod)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
  This observation was fetched:{" "}
  {selectedIndicator?.latestFetchedAt
    ? formatPeriod(selectedIndicator.latestFetchedAt)
    : "Update time unavailable"}
</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {periodChange !== null && (
            <span
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                periodChange >= 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {periodChange >= 0 ? "+" : ""}
              {periodChange.toFixed(2)}% over selected period
            </span>
          )}

          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              freshness.stale
                ? "bg-amber-50 text-amber-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {freshness.label}
          </span>
        </div>
      </div>

      {/* Chart controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-700">
          Historical price
        </p>

        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onRangeChange?.(item.value)}
              disabled={loading}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
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

      {/* Chart */}
      <div className="relative mt-5 h-[300px] w-full sm:h-[360px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Updating chart...
            </div>
          </div>
        )}

        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">
              No historical observations are available for this selection.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 8, left: 8, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id="commodityPriceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563EB"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                tickMargin={12}
              />

              <YAxis
                tickFormatter={formatNumber}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={65}
                tickMargin={8}
                domain={["auto", "auto"]}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#93C5FD",
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#commodityPriceGradient)"
                activeDot={{
                  r: 5,
                  fill: "#2563EB",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                dot={false}
                connectNulls={false}
                isAnimationActive={!loading}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col justify-between gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:flex-row">
        <span>
          {chartData.length} observations · {selectedIndicator?.geography || "Global"} benchmark
        </span>

        <span>
          Values shown in the source reporting currency and unit.
        </span>
      </div>
    </section>
  );
}
