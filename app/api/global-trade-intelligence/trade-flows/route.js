
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TradeFlow from "@/models/TradeFlow";
import DataSource from "@/models/DataSource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCE_KEY = "un-comtrade-india-monthly";
const INDIA_REPORTER_CODE = 699;
const WORLD_PARTNER_CODE = 0;

const ALLOWED_RANGES = ["1y", "3y", "5y", "all"];

function getMonthKey(date) {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return null;

  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getMonthStart(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, 1));
}

function generateMonths(startDate, endDate) {
  const months = [];
  const cursor = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1)
  );

  while (cursor <= endDate) {
    months.push(getMonthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
}

function getRangeStart(range) {
  if (range === "all") return null;

  const years = Number(range.replace("y", ""));
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear() - years, now.getUTCMonth(), 1)
  );
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function sumValues(values) {
  return values.reduce((total, value) => total + value, 0);
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const requestedRange = searchParams.get("range") || "1y";

    const range = ALLOWED_RANGES.includes(requestedRange)
      ? requestedRange
      : "1y";

    const rangeStart = getRangeStart(range);

    // --------------------------------------------------
    // 1. DATA SOURCE / COVERAGE
    // --------------------------------------------------

    const dataSource = await DataSource.findOne({
      key: SOURCE_KEY,
    })
      .select(
        "name websiteUrl dataUrl attribution updateFrequency sync.lastAttemptAt sync.lastSuccessAt sync.lastError sync.consecutiveFailures sync.coverage"
      )
      .lean();

    

    // --------------------------------------------------
    // 2. TRADE FLOW QUERY
    // --------------------------------------------------

    if (!dataSource) {
      return NextResponse.json(
        {
          success: false,
          message: "UN Comtrade India data source is not configured.",
        },
        { status: 503 }
      );
    }

    const match = {
      source: dataSource._id,
      reporterCode: INDIA_REPORTER_CODE,
      partnerCode: WORLD_PARTNER_CODE,
      frequency: "M",
      cmdCode: "TOTAL",
      flowCode: { $in: ["M", "X"] },
    };


    if (rangeStart) {
      match.periodStart = { $gte: rangeStart };
    }


    const tradeRecords = await TradeFlow.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          periodStart: 1,
        },
      },
      {
        $group: {
          _id: {
            period: "$period",
            flowCode: "$flowCode",
          },
          value: {
            $sum: "$primaryValue",
          },
          periodStart: {
            $first: "$periodStart",
          },
          flowName: {
            $first: "$flowName",
          },
        },
      },
      {
        $sort: {
          "_id.period": 1,
        },
      },
    ]);

    // --------------------------------------------------
    // 3. NORMALIZE MONTHLY DATA
    // --------------------------------------------------

    const monthlyMap = new Map();

    for (const record of tradeRecords) {
  const rawPeriod = String(record._id.period);

  // Convert UN Comtrade YYYYMM into YYYY-MM.
  const period =
    /^\d{6}$/.test(rawPeriod)
      ? `${rawPeriod.slice(0, 4)}-${rawPeriod.slice(4, 6)}`
      : rawPeriod;

      if (!monthlyMap.has(period)) {
        monthlyMap.set(period, {
          period,
          periodStart: record.periodStart,
          imports: null,
          exports: null,
          importsAvailable: false,
          exportsAvailable: false,
        });
      }

      const month = monthlyMap.get(period);

      if (record._id.flowCode === "M") {
        month.imports = record.value;
        month.importsAvailable = true;
      }

      if (record._id.flowCode === "X") {
        month.exports = record.value;
        month.exportsAvailable = true;
      }
    }

    const availableMonths = [...monthlyMap.values()]
      .sort((a, b) => a.period.localeCompare(b.period));

    // --------------------------------------------------
    // 4. MISSING / INCOMPLETE COVERAGE
    // --------------------------------------------------

    const coverageStart = rangeStart
      ? rangeStart
      : availableMonths.length
        ? availableMonths[0].periodStart
        : null;

    // Use the previous complete month as the endpoint.
    const now = new Date();

    const latestCompleteMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
    );

    const requestedMonths = coverageStart
      ? generateMonths(coverageStart, latestCompleteMonth)
      : [];

    const coverageMap = new Map(
      availableMonths.map((month) => [
        month.period,
        month,
      ])
    );

    const monthlyData = requestedMonths.map((period) => {
      const existing = coverageMap.get(period);

      return {
        period,
        label: formatMonth(period),
        periodStart: getMonthStart(period),

        imports: existing?.imports ?? null,
        exports: existing?.exports ?? null,

        importsAvailable: existing?.importsAvailable ?? false,
        exportsAvailable: existing?.exportsAvailable ?? false,

        // Only calculate balance when both flows are present.
        tradeBalance:
          existing?.importsAvailable &&
          existing?.exportsAvailable
            ? existing.exports - existing.imports
            : null,

        totalTrade:
          existing?.importsAvailable &&
          existing?.exportsAvailable
            ? existing.exports + existing.imports
            : null,

        complete:
          Boolean(existing?.importsAvailable) &&
          Boolean(existing?.exportsAvailable),
      };
    });

    const missingMonths = monthlyData
      .filter(
        (month) =>
          !month.importsAvailable &&
          !month.exportsAvailable
      )
      .map((month) => month.period);

    const incompleteMonths = monthlyData
      .filter(
        (month) =>
          month.importsAvailable !== month.exportsAvailable
      )
      .map((month) => month.period);

    const completeMonths = monthlyData
      .filter((month) => month.complete);

    // --------------------------------------------------
    // 5. KPI CALCULATIONS
    // --------------------------------------------------

    // Use only complete months for comparable totals.
    const totalExports = sumValues(
      completeMonths.map((month) => month.exports)
    );

    const totalImports = sumValues(
      completeMonths.map((month) => month.imports)
    );

    const tradeBalance = totalExports - totalImports;
    const totalTrade = totalExports + totalImports;

    // --------------------------------------------------
    // 6. COVERAGE SUMMARY
    // --------------------------------------------------

    const coverage = {
      requestedMonths: monthlyData.length,
      availableMonths: availableMonths.length,
      completeMonths: completeMonths.length,
      missingMonths,
      incompleteMonths,

      coveragePercentage:
        monthlyData.length > 0
          ? Number(
              (
                  (completeMonths.length / monthlyData.length) *
                  100
              ).toFixed(2)
            )
          : 0,

      status:
        monthlyData.length === 0
          ? "empty"
          : completeMonths.length === monthlyData.length
            ? "complete"
            : "partial",

      firstAvailablePeriod:
        availableMonths[0]?.period ?? null,

      latestAvailablePeriod:
        availableMonths[availableMonths.length - 1]?.period ?? null,
    };

    // --------------------------------------------------
    // 7. RESPONSE
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        range,

        currency: "USD",

        summary: {
          totalExports,
          totalImports,
          tradeBalance,
          totalTrade,
          completeMonths: completeMonths.length,
        },

        monthlyData,

        coverage,

        dataSource: {
          name: dataSource?.name ?? "UN Comtrade",
          websiteUrl: dataSource?.websiteUrl ?? null,
          dataUrl: dataSource?.dataUrl ?? null,
          attribution: dataSource?.attribution ?? null,
          updateFrequency:
            dataSource?.updateFrequency ?? "monthly",

          lastAttemptAt:
            dataSource?.sync?.lastAttemptAt ?? null,

          lastSuccessAt:
            dataSource?.sync?.lastSuccessAt ?? null,

          lastError:
            dataSource?.sync?.lastError ?? null,

          consecutiveFailures:
            dataSource?.sync?.consecutiveFailures ?? 0,
        },

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
    console.error("[GTI Trade Flows API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load India trade flow data.",
      },
      { status: 500 }
    );
  }
}
