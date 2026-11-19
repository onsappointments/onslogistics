"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = "/api/global-trade-intelligence/trade-flows";

const RANGES = [
  { label: "1Y", value: "1y" },
  { label: "3Y", value: "3y" },
  { label: "5Y", value: "5y" },
  { label: "All", value: "all" },
];

function formatBillions(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "—";
  }

  return `$${(Number(value) / 1_000_000_000).toFixed(1)}B`;
}

function formatAxisValue(value) {
  if (value === null || value === undefined) return "";

  return `$${(Number(value) / 1_000_000_000).toFixed(0)}B`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  return (
    <div className="min-w-44 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-3 text-xs font-semibold text-gray-500">{label}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-2 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Exports
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {formatBillions(point?.exports)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-2 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-sky-300" />
            Imports
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {formatBillions(point?.imports)}
          </span>
        </div>
      </div>

      {point?.complete === false && (
        <p className="mt-3 border-t border-gray-100 pt-2 text-xs text-amber-600">
          Incomplete or unavailable reporting period
        </p>
      )}
    </div>
  );
}

export default function MonthlyTradeActivity() {
  const [range, setRange] = useState("1y");
  const [monthlyData, setMonthlyData] = useState([]);
  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchChartData() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}?range=${range}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load monthly trade activity."
          );
        }

        if (controller.signal.aborted) return;

        setMonthlyData(result.monthlyData || []);
        setCoverage(result.coverage || null);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("[GTI Monthly Trade Activity]", err);
        setError(err.message || "Unable to load chart data.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchChartData();

    return () => controller.abort();
  }, [range]);

  const availableRecords = monthlyData.filter(
    (item) => item.importsAvailable || item.exportsAvailable
  );

  const hasChartData = availableRecords.length > 0;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-blue-600">TRADE ACTIVITY</p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Monthly imports and exports
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Compare India's merchandise imports and exports over time.
          </p>
        </div>

        {/* Independent range selector */}
        <div className="flex w-fit items-center gap-1 rounded-xl bg-gray-100 p-1">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              disabled={loading}
              aria-pressed={range === item.value}
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

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
          Exports
        </span>

        <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-300" />
          Imports
        </span>

        <span className="ml-auto text-xs text-gray-400">
          Values in USD
        </span>
      </div>

      {/* Chart */}
      <div className="relative mt-4 h-[320px] w-full sm:h-[370px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Updating chart...
            </div>
          </div>
        )}

        {error ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-red-50 px-5 text-center">
            <p className="text-sm font-medium text-red-700">
              Unable to load monthly trade activity
            </p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        ) : !hasChartData && !loading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">
              No monthly trade observations are available for this range.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 8, left: 8, bottom: 4 }}
              barGap={3}
              barCategoryGap="22%"
            >
              <CartesianGrid
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                tickMargin={12}
              />

              <YAxis
                tickFormatter={formatAxisValue}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={65}
                tickMargin={8}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F3F4F6" }}
              />

              <Legend content={() => null} />

              <Bar
                dataKey="exports"
                name="Exports"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                isAnimationActive={!loading}
                connectNulls={false}
              />

              <Bar
                dataKey="imports"
                name="Imports"
                fill="#7DD3FC"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                isAnimationActive={!loading}
                connectNulls={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col justify-between gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:flex-row">
        <span>
          {coverage
            ? `${coverage.completeMonths} complete of ${coverage.requestedMonths} requested months`
            : "Monthly reporting coverage"}
        </span>

        <span>Source: UN Comtrade</span>
      </div>
    </section>
  );
}