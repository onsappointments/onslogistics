
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TradeIndicator from "@/models/TradeIndicator";
import News from "@/models/News";
import DataSource from "@/models/DataSource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_INDICATOR = "world-bank-crude-oil-average";

const ALLOWED_RANGES = {
  "1y": 1,
  "5y": 5,
  "10y": 10,
  all: null,
};

const ALLOWED_INDEX_RANGES = {
  "1y": 1,
  "3y": 3,
  "5y": 5,
  "10y": 10,
  all: null,
};

const NEWS_CATEGORIES = [
  "customs-compliance",
  "freight-market",
  "trade-routes",
  "ports-logistics",
  "global-trade",
];

const MOVEMENT_PERIODS = {
  "3m": 3,
  "12m": 12,
};

const MOVERS_LIMIT = 5;
const STALE_AFTER_DAYS = 90;

function getMonthKey(date) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return null;

  return `${value.getUTCFullYear()}-${String(
    value.getUTCMonth() + 1
  ).padStart(2, "0")}`;
}

function getPreviousMonthKey(date, monthsBack) {
  const value = new Date(date);

  const target = new Date(
    Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth() - monthsBack,
      1
    )
  );

  return getMonthKey(target);
}

function calculateMarketMovers(observationGroups) {
  const result = {
    "3m": { gainers: [], losers: [] },
    "12m": { gainers: [], losers: [] },
  };

  const now = Date.now();
  const staleThreshold = STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;

  for (const group of observationGroups) {
    const observations = group.observations || [];
    const latest = observations[0];

    if (!latest) continue;

    const latestDate = new Date(latest.periodStart);

    if (
      Number.isNaN(latestDate.getTime()) ||
      now - latestDate.getTime() > staleThreshold
    ) {
      continue;
    }

    const latestValue = Number(latest.value);

    if (!Number.isFinite(latestValue)) continue;

    const observationsByMonth = new Map(
      observations.map((item) => [
        getMonthKey(item.periodStart),
        item,
      ])
    );

    for (const [period, monthsBack] of Object.entries(
      MOVEMENT_PERIODS
    )) {
      const referenceMonth = getPreviousMonthKey(
        latest.periodStart,
        monthsBack
      );

      const reference = observationsByMonth.get(referenceMonth);

      if (!reference) continue;

      // Never compare observations with different reporting units/currencies.
      if (
        String(reference.unit || "") !== String(latest.unit || "") ||
        String(reference.currency || "") !==
          String(latest.currency || "")
      ) {
        continue;
      }

      const referenceValue = Number(reference.value);

      if (
        !Number.isFinite(referenceValue) ||
        referenceValue === 0
      ) {
        continue;
      }

      const changePercent =
        ((latestValue - referenceValue) / Math.abs(referenceValue)) *
        100;

      if (!Number.isFinite(changePercent) || changePercent === 0) {
        continue;
      }

      const mover = {
        indicatorKey: group.indicatorKey,
        name: group.name,
        latestValue,
        unit: latest.unit,
        currency: latest.currency,
        latestPeriod: latest.periodStart,
        referencePeriod: reference.periodStart,
        changePercent: Number(changePercent.toFixed(2)),
      };

      if (changePercent > 0) {
        result[period].gainers.push(mover);
      } else {
        result[period].losers.push(mover);
      }
    }
  }

  for (const period of Object.keys(result)) {
    result[period].gainers.sort(
      (a, b) => b.changePercent - a.changePercent
    );

    result[period].losers.sort(
      (a, b) => a.changePercent - b.changePercent
    );

    result[period].gainers = result[period].gainers.slice(
      0,
      MOVERS_LIMIT
    );

    result[period].losers = result[period].losers.slice(
      0,
      MOVERS_LIMIT
    );
  }

  return result;
}

export async function GET(request) {
  try {
    await connectDB();



const tradeDataSource = await DataSource.findOne({
  key: "world-bank-commodities",
})
  .select("sync.lastSuccessAt sync.lastAttemptAt sync.lastError sync.consecutiveFailures")
  .lean();

const dataUpdatedAt =
  tradeDataSource?.sync?.lastSuccessAt || null;

const dataSync = {
  lastSuccessAt: tradeDataSource?.sync?.lastSuccessAt || null,
  lastAttemptAt: tradeDataSource?.sync?.lastAttemptAt || null,
  lastError: tradeDataSource?.sync?.lastError || null,
  consecutiveFailures:
    tradeDataSource?.sync?.consecutiveFailures || 0,
};



    const { searchParams } = new URL(request.url);

    const requestedIndicator =
      searchParams.get("indicator") || DEFAULT_INDICATOR;

    const requestedRange = searchParams.get("range") || "5y";

    const requestedIndexRange =
  searchParams.get("indexRange") || "5y";

const indexRange = Object.hasOwn(
  ALLOWED_INDEX_RANGES,
  requestedIndexRange
)
  ? requestedIndexRange
  : "5y";

    const range = Object.hasOwn(ALLOWED_RANGES, requestedRange)
      ? requestedRange
      : "5y";

    // --------------------------------------------------
    // 1. AVAILABLE COMMODITY SERIES
    // --------------------------------------------------

    const commoditySeries = await TradeIndicator.aggregate([
      {
        $match: {
          category: "commodity-price",
          status: "published",
          "geography.key": "global",
        },
      },
      {
        $sort: {
          "period.start": -1,
        },
      },
      {
        $group: {
          _id: "$indicatorKey",
          name: { $first: "$name" },
          unit: { $first: "$unit" },
          currency: { $first: "$currency" },
          latestValue: { $first: "$value" },
          latestPeriod: { $first: "$period.start" },
          latestFetchedAt: { $first: "$fetchedAt" },
          geography: { $first: "$geography.name" },
          
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $project: {
          _id: 0,
          indicatorKey: "$_id",
          name: 1,
          unit: 1,
          currency: 1,
          latestValue: 1,
          latestPeriod: 1,
          latestFetchedAt: 1,
          geography: 1,
        },
      },
    ]);

    // --------------------------------------------------
// 1B. COMMODITY MARKET MOVERS
// --------------------------------------------------

const moverObservations = await TradeIndicator.aggregate([
  {
    $match: {
      category: "commodity-price",
      status: "published",
      "geography.key": "global",
    },
  },
  {
    $setWindowFields: {
      partitionBy: "$indicatorKey",
      sortBy: {
        "period.start": -1,
      },
      output: {
        observationRank: {
          $documentNumber: {},
        },
      },
    },
  },
  {
    $match: {
      observationRank: { $lte: 13 },
    },
  },
  {
    $sort: {
      indicatorKey: 1,
      observationRank: 1,
    },
  },
  {
    $group: {
      _id: "$indicatorKey",
      name: { $first: "$name" },
      observations: {
        $push: {
          value: "$value",
          unit: "$unit",
          currency: "$currency",
          periodStart: "$period.start",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      indicatorKey: "$_id",
      name: 1,
      observations: 1,
    },
  },
]);

const marketMovers = calculateMarketMovers(moverObservations);

    if (!commoditySeries.length) {
      return NextResponse.json({
        success: true,
        commodities: [],
        selectedIndicator: null,
        chartData: [],
        news: [],
        newsCategories: [],
        marketMovers: {
         "3m": { gainers: [], losers: [] },
         "12m": { gainers: [], losers: [] },
         },
        message: "No commodity observations are available yet.",
      });
    }

    const selectedCommodity =
      commoditySeries.find(
        (item) => item.indicatorKey === requestedIndicator
      ) || commoditySeries.find(
        (item) => item.indicatorKey === DEFAULT_INDICATOR
      ) || commoditySeries[0];

    // --------------------------------------------------
    // 2. HISTORICAL COMMODITY OBSERVATIONS
    // --------------------------------------------------

    const chartFilter = {
      indicatorKey: selectedCommodity.indicatorKey,
      category: "commodity-price",
      status: "published",
      "geography.key": "global",
    };

    if (ALLOWED_RANGES[range] !== null) {
      const startDate = new Date();
      startDate.setUTCFullYear(
        startDate.getUTCFullYear() - ALLOWED_RANGES[range]
      );

      chartFilter["period.start"] = {
        $gte: startDate,
      };
    }

    const chartData = await TradeIndicator.find(chartFilter)
      .select(
        "indicatorKey name value unit currency period.start period.end period.label sourceUrl fetchedAt"
      )
      .sort({
        "period.start": 1,
      })
      .lean();

    // --------------------------------------------------
// 2B. WORLD BANK COMMODITY GROUP INDICES
// --------------------------------------------------

const indexFilter = {
  category: "commodity-index",
  status: "published",
  "geography.key": "global",
};

if (ALLOWED_INDEX_RANGES[indexRange] !== null) {
  const indexStartDate = new Date();

  indexStartDate.setUTCFullYear(
    indexStartDate.getUTCFullYear() -
      ALLOWED_INDEX_RANGES[indexRange]
  );

  indexFilter["period.start"] = {
    $gte: indexStartDate,
  };
}

const indexObservations = await TradeIndicator.find(indexFilter)
  .select(
    "indicatorKey name value unit currency period.start period.label fetchedAt metadata"
  )
  .sort({
    "period.start": 1,
    indicatorKey: 1,
  })
  .lean();

// Build metadata for the chart legend and line controls.
const indexSeriesMap = new Map();

const indexChartRows = new Map();

for (const item of indexObservations) {
  const key = item.indicatorKey;

  if (!indexSeriesMap.has(key)) {
    indexSeriesMap.set(key, {
      indicatorKey: key,
      name: item.name,
      unit: item.unit,
      indexBase: item.metadata?.indexBase || 100,
      indexBaseYear: item.metadata?.indexBaseYear || 2010,
    });
  }

  const timestamp = new Date(item.period.start).getTime();

  if (!Number.isFinite(timestamp)) continue;

  if (!indexChartRows.has(timestamp)) {
    indexChartRows.set(timestamp, {
      timestamp,
      date: item.period.label || "",
    });
  }

  indexChartRows.get(timestamp)[key] = item.value;
}

const indexSeries = Array.from(indexSeriesMap.values());

const indexChartData = Array.from(indexChartRows.values()).sort(
  (a, b) => a.timestamp - b.timestamp
);

    // --------------------------------------------------
    // 3. LATEST TRADE NEWS
    // --------------------------------------------------

    const news = await News.find({
      status: "published",
    })
      .select(
        "title slug url source sourceDomain category publishedAt imageUrl"
      )
      .sort({
        publishedAt: -1,
        _id: -1,
      })
      .limit(6)
      .lean();

    // --------------------------------------------------
    // 4. NEWS CATEGORY DISTRIBUTION
    // --------------------------------------------------

    const categoryResults = await News.aggregate([
      {
        $match: {
          status: "published",
          category: { $in: NEWS_CATEGORIES },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryCountMap = new Map(
      categoryResults.map((item) => [
        item._id,
        item.count,
      ])
    );

    const newsCategories = NEWS_CATEGORIES.map((category) => ({
      category,
      count: categoryCountMap.get(category) || 0,
    }));

    return NextResponse.json(
      {
        success: true,

        commodities: commoditySeries,

        selectedIndicator: {
          indicatorKey: selectedCommodity.indicatorKey,
          name: selectedCommodity.name,
          unit: selectedCommodity.unit,
          currency: selectedCommodity.currency,
          latestValue: selectedCommodity.latestValue,
          latestPeriod: selectedCommodity.latestPeriod,
          latestFetchedAt: selectedCommodity.latestFetchedAt,
          geography: selectedCommodity.geography,
        },

        range,
        indexRange,
        dataUpdatedAt,
        dataSync,

        chartData: chartData.map((item) => ({
         date: item.period.label,
         timestamp: item.period.start,
         value: item.value,
         unit: item.unit,
         currency: item.currency,
         fetchedAt: item.fetchedAt,
       })),

        news,

        newsCategories,
        indexSeries,
        indexChartData,
        marketMovers,

        generatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[GTI Overview API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load Global Trade Intelligence data.",
      },
      { status: 500 }
    );
  }
}
