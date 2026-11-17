
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Globe2,
  Newspaper,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import CommodityPriceChart from "./CommodityPriceChart";
import LatestNewsToast from "@/Components/global-trade-intelligence/LatestNewsToast";
import CommodityMarketWatchlist from "./CommodityMarketWatchlist";
import CommodityGroupIndexChart from "./CommodityGroupIndexChart";

const DEFAULT_INDEX_RANGE = "5y";

const API_URL = "/api/global-trade-intelligence/overview";
const DEFAULT_INDICATOR = "world-bank-crude-oil-average";
const DEFAULT_RANGE = "5y";


function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}


function formatTimeAgo(date) {
  if (!date) return "Update time unavailable";

  const timestamp = new Date(date).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Update time unavailable";
  }

  const difference = Math.max(0, Date.now() - timestamp);

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDate(date);
}


function formatNumber(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "—";
  }

  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function NewsPreview({ articles = [] }) {
  if (!articles.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Latest trade developments
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          No published trade news is available at the moment.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            TRADE DEVELOPMENTS
          </p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            Latest global trade news
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Recent updates from international trade sources.
          </p>
        </div>

        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {articles.length} recent articles
        </span>
      </div>

      <div className="mt-5 divide-y divide-gray-100">
        {articles.map((article) => (
          <article
            key={article._id || article.slug}
            className="py-4 first:pt-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
              <span className="font-medium text-blue-600">
                {article.source || "Trade source"}
              </span>
              <span>·</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              {article.category && (
                <>
                  <span>·</span>
                  <span className="capitalize">
                    {article.category.replaceAll("-", " ")}
                  </span>
                </>
              )}
            </div>

            <h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
              {article.title}
            </h3>

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-800"
              >
                Read original report
                <ArrowUpRight size={15} />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function GlobalTradeIntelligenceDashboard() {
  const [data, setData] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(
    DEFAULT_INDICATOR
  );
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setClock] = useState(Date.now());
  const requestIdRef = useRef(0);
  const [indexRange, setIndexRange] = useState(
  DEFAULT_INDEX_RANGE
);

  const fetchOverview = useCallback(
  async (
    indicator,
    selectedRange,
    selectedIndexRange = DEFAULT_INDEX_RANGE
  ) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        indicator,
        range: selectedRange,
        indexRange: selectedIndexRange,
      });

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Unable to load trade intelligence data."
        );
      }

      // Ignore an older response if the user has already changed selection.
      if (requestId !== requestIdRef.current) return;

      setData(result);

      if (result.selectedIndicator?.indicatorKey) {
        setSelectedIndicator(result.selectedIndicator.indicatorKey);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      console.error("[GTI Dashboard]", err);
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchOverview(DEFAULT_INDICATOR, DEFAULT_RANGE, DEFAULT_INDEX_RANGE);

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchOverview]);

  useEffect(() => {
  const interval = setInterval(() => {
    setClock(Date.now());
  }, 60000);

  return () => clearInterval(interval);
}, []);

  const handleIndicatorChange = (indicator) => {
    setSelectedIndicator(indicator);
    fetchOverview(indicator, range, indexRange);
  };

  const handleRangeChange = (nextRange) => {
    setRange(nextRange);
    fetchOverview(selectedIndicator, nextRange, indexRange);
  };

  const handleIndexRangeChange = (nextRange) => {
  setIndexRange(nextRange);
  fetchOverview(selectedIndicator, range, nextRange);
};

  const commodities = data?.commodities || [];
  const chartData = data?.chartData || [];
  const news = data?.news || [];
  const currentIndicator = data?.selectedIndicator || null;

  const latestNewsDate = news[0]?.publishedAt;

  const commodityCount = commodities.length;
  const latestObservation = currentIndicator?.latestPeriod;

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
        <LatestNewsToast news={data?.news || []} />
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
                Global Trade Intelligence
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Explore global commodity markets and trade developments
                through data-backed insights for importers, exporters and
                businesses involved in international trade.
              </p>
            </div>


<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500">
  <span className="inline-flex items-center gap-1.5">
    <span
      className={`h-2 w-2 rounded-full ${
        data?.dataUpdatedAt
          ? "bg-green-500"
          : "bg-amber-500"
      }`}
    />

    {data?.dataUpdatedAt
      ? `Market data last updated ${formatTimeAgo(data.dataUpdatedAt)}`
      : "Market data update time unavailable"}
  </span>

  {data?.dataUpdatedAt && (
    <span
      title={new Date(data.dataUpdatedAt).toLocaleString("en-IN")}
      className="text-gray-400"
    >
      Updated on {formatDate(data.dataUpdatedAt)}
    </span>
  )}

  {loading && (
    <span className="text-blue-600">
      Refreshing...
    </span>
  )}
</div>


            <button
              type="button"
              onClick={() => fetchOverview(selectedIndicator, range, indexRange)}
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
                Unable to load the latest intelligence data
              </p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => fetchOverview(selectedIndicator, range, indexRange)}
              className="w-fit rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Overview cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Activity}
            label="Tracked commodities"
            value={loading && !data ? "—" : commodityCount}
            description="Available global benchmark series"
          />

          <StatCard
            icon={TrendingUp}
            label="Selected benchmark"
            value={
              currentIndicator
                ? `${currentIndicator.currency || ""} ${formatNumber(
                    currentIndicator.latestValue
                  )}`
                : "—"
            }
            description={
              currentIndicator
                ? `${currentIndicator.name} · ${currentIndicator.unit || ""}`
                : "Latest available commodity value"
            }
          />

          <StatCard
            icon={Newspaper}
            label="Recent trade articles"
            value={loading && !data ? "—" : news.length}
            description="Published articles in the latest feed"
          />

          <StatCard
            icon={Globe2}
            label="Latest market observation"
            value={formatDate(latestObservation)}
            description="Reporting period of selected benchmark"
          />
        </div>

     {/* Commodity watchlist and charts */}
<div className="mb-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(270px,0.78fr)_minmax(0,1.8fr)]">
  {/* Left: Market watchlist */}
  <CommodityMarketWatchlist
    marketMovers={data?.marketMovers}
    selectedIndicator={currentIndicator?.indicatorKey}
    onSelect={handleIndicatorChange}
    loading={loading}
  />

  {/* Right: Both charts */}
  <div className="min-w-0 space-y-5">
    <CommodityPriceChart
      commodities={commodities}
      selectedIndicator={currentIndicator}
      chartData={chartData}
      range={range}
      onIndicatorChange={handleIndicatorChange}
      onRangeChange={handleRangeChange}
      loading={loading}
    />

    <CommodityGroupIndexChart
      series={data?.indexSeries || []}
      chartData={data?.indexChartData || []}
      range={indexRange}
      onRangeChange={handleIndexRangeChange}
      loading={loading}
    />
  </div>
</div>

        {/* Latest news */}
        <div className="mb-8">
          <NewsPreview articles={news} />
        </div>

        {/* Data information */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
              <Globe2 size={20} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Understanding the data
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Commodity prices are global benchmark observations. They
                provide market context and should not be interpreted as
                country-specific import prices, customs values, freight
                quotations or landed costs.
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Dashboard response generated:{" "}
                {formatDate(data?.generatedAt)}
                {latestNewsDate
                  ? ` · Latest news published: ${formatDate(latestNewsDate)}`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
