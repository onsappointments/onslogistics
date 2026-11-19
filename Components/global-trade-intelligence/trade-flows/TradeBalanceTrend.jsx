
"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
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

  const billions = Number(value) / 1_000_000_000;

  return `${billions < 0 ? "-" : ""}$${Math.abs(billions).toFixed(2)}B`;
}

function formatAxisValue(value) {
  const billions = Number(value) / 1_000_000_000;

  return `${billions < 0 ? "-" : ""}$${Math.abs(billions).toFixed(0)}B`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  const balance = point?.tradeBalance;

  return (
    <div className="min-w-48 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-3 text-xs font-semibold text-gray-500">{label}</p>

      <p
        className={`text-base font-semibold ${
          balance < 0 ? "text-red-600" : "text-emerald-600"
        }`}
      >
        {formatBillions(balance)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {balance < 0
          ? "Trade deficit"
          : balance > 0
            ? "Trade surplus"
            : "Balanced trade"}
      </p>

      <div className="mt-3 space-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
        <div className="flex justify-between gap-4">
          <span>Exports</span>
          <span className="font-medium text-gray-700">
            {formatBillions(point?.exports)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span>Imports</span>
          <span className="font-medium text-gray-700">
            {formatBillions(point?.imports)}
          </span>
        </div>
      </div>

      {point?.complete === false && (
        <p className="mt-3 border-t border-gray-100 pt-2 text-xs text-amber-600">
          Reporting period unavailable or incomplete
        </p>
      )}
    </div>
  );
}

export default function TradeBalanceTrend() {
  const [range, setRange] = useState("1y");
  const [monthlyData, setMonthlyData] = useState([]);
  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBalanceData() {
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
            result.message || "Unable to load trade balance data."
          );
        }

        if (controller.signal.aborted) return;

        setMonthlyData(result.monthlyData || []);
        setCoverage(result.coverage || null);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("[GTI Trade Balance Trend]", err);
        setError(err.message || "Unable to load trade balance data.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBalanceData();

    return () => controller.abort();
  }, [range]);

  const availableMonths = monthlyData.filter(
    (month) =>
      month.complete &&
      Number.isFinite(Number(month.tradeBalance))
  );

  const hasChartData = availableMonths.length > 0;

  const latestBalance =
    availableMonths.length > 0
      ? availableMonths[availableMonths.length - 1]
      : null;

  const deficitMonths = availableMonths.filter(
    (month) => month.tradeBalance < 0
  ).length;

  const surplusMonths = availableMonths.filter(
    (month) => month.tradeBalance > 0
  ).length;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-blue-600">
            TRADE BALANCE
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Monthly trade balance trend
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track India's monthly merchandise trade surplus and deficit.
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

      {/* Latest balance and legend */}
      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-gray-500">
            Latest available monthly balance
          </p>

          <p
            className={`mt-1 text-3xl font-semibold tracking-tight ${
              latestBalance?.tradeBalance < 0
                ? "text-red-600"
                : "text-emerald-600"
            }`}
          >
            {formatBillions(latestBalance?.tradeBalance)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {latestBalance?.label || "No complete observation available"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
            Trade deficit
          </span>

          <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            Trade surplus
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-5 h-[320px] w-full sm:h-[370px]">
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
              Unable to load trade balance
            </p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        ) : !hasChartData && !loading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">
              No complete trade balance observations are available for this range.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 8, left: 8, bottom: 4 }}
              barCategoryGap="28%"
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
                width={75}
                tickMargin={8}
              />

              <ReferenceLine
                y={0}
                stroke="#6B7280"
                strokeWidth={1.2}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F3F4F6" }}
              />

              <Bar
                dataKey="tradeBalance"
                name="Trade balance"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
                isAnimationActive={!loading}
              >
                {monthlyData.map((month) => (
                  <Cell
                    key={month.period}
                    fill={
                      !month.complete ||
                      !Number.isFinite(Number(month.tradeBalance))
                        ? "transparent"
                        : month.tradeBalance < 0
                          ? "#EF4444"
                          : "#10B981"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-gray-500">Complete observations</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {availableMonths.length}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Deficit months</p>
          <p className="mt-1 text-lg font-semibold text-red-600">
            {deficitMonths}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Surplus months</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">
            {surplusMonths}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-2 text-xs text-gray-500 sm:flex-row">
        <span>
          {coverage
            ? `${coverage.completeMonths} complete of ${coverage.requestedMonths} requested months`
            : "Monthly reporting coverage"}
        </span>

        <span>Balance = Exports − Imports · Source: UN Comtrade</span>
      </div>
    </section>
  );
}
