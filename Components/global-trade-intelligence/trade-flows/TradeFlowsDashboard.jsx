"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Globe2,
  RefreshCw,
  Scale,
} from "lucide-react";

import MonthlyTradeActivity from "./MonthlyTradeActivity";
import TradeBalanceTrend from "./TradeBalanceTrend";
import MonthlyTradeTable from "./MonthlyTradeTable";
import TradeFlowDataCoverage from "./TradeFlowDataCoverage";

const API_URL = "/api/global-trade-intelligence/trade-flows";
const DEFAULT_RANGE = "1y";

function formatCurrency(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function KpiCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName = "bg-blue-50 text-blue-600",
  valueClassName = "text-gray-900",
  loading,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>

        <div className={`rounded-xl p-2.5 ${iconClassName}`}>
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      {loading ? (
        <div className="mt-4 h-8 w-32 animate-pulse rounded-lg bg-gray-100" />
      ) : (
        <p
          className={`mt-4 text-2xl font-semibold tracking-tight sm:text-3xl ${valueClassName}`}
        >
          {value}
        </p>
      )}

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function TradeFlowsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestControllerRef = useRef(null);

  const fetchInitialData = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?range=${DEFAULT_RANGE}`,
        {
          method: "GET",
          signal,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load India trade flow data."
        );
      }

      setData(result);
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("[GTI Trade Flows Dashboard]", err);
      setError(err.message || "Unable to load trade flow data.");
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchInitialData(controller.signal);

    return () => {
      controller.abort();
      requestControllerRef.current?.abort();
    };
  }, [fetchInitialData]);

  const summary = data?.summary;
  const completeMonths = summary?.completeMonths ?? 0;

 const handleRefresh = () => {
  requestControllerRef.current?.abort();

  const controller = new AbortController();
  requestControllerRef.current = controller;

  fetchInitialData(controller.signal);
};

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Globe2 size={14} />
            GLOBAL TRADE INTELLIGENCE
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                India Trade Flows
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Explore India's merchandise imports, exports and trade
                balance through monthly trade data.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  India
                </span>

                <span>·</span>

                <span>Merchandise trade</span>

                <span>·</span>

                <span>Currency: USD</span>

                {data?.dataSource?.lastSuccessAt && (
                  <>
                    <span>·</span>
                    <span>
                      Last updated{" "}
                      {new Date(data.dataSource.lastSuccessAt).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh data
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load trade flow data
              </p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="w-fit rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* KPI cards */}
        <section aria-label="India trade summary" className="mb-8">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Trade summary
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Based on the latest available complete monthly observations.
              </p>
            </div>

            <span className="text-xs text-gray-500">
              {loading
                ? "Loading trade summary..."
                : `${completeMonths} complete months · Last 1 year`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={ArrowUpFromLine}
              label="Total exports"
              value={formatCurrency(summary?.totalExports)}
              description="Merchandise exported from India"
              iconClassName="bg-emerald-50 text-emerald-600"
              valueClassName="text-emerald-700"
              loading={loading && !data}
            />

            <KpiCard
              icon={ArrowDownToLine}
              label="Total imports"
              value={formatCurrency(summary?.totalImports)}
              description="Merchandise imported into India"
              iconClassName="bg-blue-50 text-blue-600"
              loading={loading && !data}
            />

            <KpiCard
              icon={Scale}
              label="Trade balance"
              value={formatCurrency(summary?.tradeBalance)}
              description="Exports minus imports"
              iconClassName="bg-amber-50 text-amber-600"
              valueClassName={
                Number(summary?.tradeBalance) < 0
                  ? "text-red-600"
                  : "text-emerald-700"
              }
              loading={loading && !data}
            />

            <KpiCard
              icon={Activity}
              label="Total trade"
              value={formatCurrency(summary?.totalTrade)}
              description="Combined merchandise imports and exports"
              iconClassName="bg-violet-50 text-violet-600"
              loading={loading && !data}
            />
          </div>
        </section>

        {/* Monthly trade activity */}
        <section className="mb-8">
          <MonthlyTradeActivity />
        </section> 

        {/* Trade balance trend */}
        <section className="mb-8">
          <TradeBalanceTrend />
        </section>
        {/* Monthly trade breakdown */}
        <section className="mb-8">
          <MonthlyTradeTable
            monthlyData={data?.monthlyData || []}
            loading={loading}
          />
        </section>
        {/* Data coverage and source */}
        <section className="mb-8">
          <TradeFlowDataCoverage
            coverage={data?.coverage}
            dataSource={data?.dataSource}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
}