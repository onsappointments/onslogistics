
import connectDB from "@/lib/mongodb";
import DataSource from "@/models/DataSource";
import TradeFlow from "@/models/TradeFlow";
import {
  fetchIndiaMonthlyTradeFlows,
} from "@/lib/trade-data/sources/un-comtrade";

const SOURCE_CONFIG = {
  key: "un-comtrade-india-monthly",
  name: "UN Comtrade — India Monthly Merchandise Trade",
  description:
    "India's monthly merchandise import and export totals, reported against the world partner aggregate.",
  websiteUrl: "https://comtradeplus.un.org/",
  dataUrl: "https://comtradeapi.un.org/data/v1/get/C/M/HS",
  providerType: "international-organization",
  status: "active",
  coverage: ["India"],
  dataCategories: ["trade-value", "trade-volume"],
  attribution: "United Nations Statistics Division — UN Comtrade Database.",
  licenseUrl: null,
  updateFrequency: "monthly",
};

const BATCH_SIZE = 500;

function stableSerialize(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(stableSerialize);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = stableSerialize(value[key]);
        return result;
      }, {});
  }

  return value;
}

function getIdentityKey(record, sourceId) {
  return JSON.stringify([
    String(sourceId),
    record.frequency,
    record.period,
    record.reporterCode,
    record.partnerCode,
    record.flowCode,
    record.classificationCode ?? null,
    record.cmdCode,
  ]);
}

function buildSourceUrl(record) {
  const url = new URL(
    "https://comtradeapi.un.org/data/v1/get/C/M/HS"
  );

  url.searchParams.set("reporterCode", String(record.reporterCode));
  url.searchParams.set("partnerCode", String(record.partnerCode));
  url.searchParams.set("partner2Code", "0");
  url.searchParams.set("period", record.period);
  url.searchParams.set("flowCode", record.flowCode);
  url.searchParams.set("cmdCode", record.cmdCode);

  return url.toString();
}


function calculateTradeCoverage(requestedPeriods, records) {
  const requested = [...new Set(requestedPeriods)].sort();

  const flowsByPeriod = new Map();

  for (const period of requested) {
    flowsByPeriod.set(period, {
      importsAvailable: false,
      exportsAvailable: false,
    });
  }

  for (const record of records) {
  const period = String(record.period);
  const flowCode = String(record.flowCode);

  // Coverage only tracks periods explicitly requested.
  if (!flowsByPeriod.has(period)) {
    continue;
  }

  const coverage = flowsByPeriod.get(period);

    // UN Comtrade flow codes:
    // M = Imports, X = Exports
    if (flowCode === "M") {
      coverage.importsAvailable = true;
    } else if (flowCode === "X") {
      coverage.exportsAvailable = true;
    }
  }

  const periodFlowCoverage = [...flowsByPeriod.entries()]
    .map(([period, flows]) => ({
      period,
      importsAvailable: flows.importsAvailable,
      exportsAvailable: flows.exportsAvailable,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const availablePeriods = periodFlowCoverage
    .filter(
      (item) =>
        item.importsAvailable || item.exportsAvailable
    )
    .map((item) => item.period);

  const missingPeriods = requested.filter(
    (period) => !availablePeriods.includes(period)
  );

  const incompletePeriods = periodFlowCoverage
    .filter(
      (item) =>
        (item.importsAvailable || item.exportsAvailable) &&
        (!item.importsAvailable || !item.exportsAvailable)
    )
    .map((item) => item.period);

  const fullyAvailablePeriods = periodFlowCoverage
    .filter(
      (item) =>
        item.importsAvailable && item.exportsAvailable
    )
    .map((item) => item.period);

  let coverageStatus;

  if (availablePeriods.length === 0) {
    coverageStatus = "empty";
  } else if (
  requested.length > 0 &&
  requested.every((period) =>
    fullyAvailablePeriods.includes(period)
  )
) {
  coverageStatus = "complete";
} else {
  coverageStatus = "partial";
}

  return {
    requestedPeriods: requested,
    availablePeriods,
    missingPeriods,
    incompletePeriods,
    periodFlowCoverage,
    coverageStatus,
    firstAvailablePeriod: availablePeriods[0] ?? null,
    latestAvailablePeriod:
      availablePeriods[availablePeriods.length - 1] ?? null,
    coverageUpdatedAt: new Date(),
  };
}


async function writeTradeFlowBatch(sourceId, records) {
  const fetchedAt = new Date();

  // 1. Deduplicate incoming records before querying MongoDB.
  const incomingByIdentity = new Map();
  let duplicateIncomingCount = 0;

  for (const record of records) {
    const identityKey = getIdentityKey(record, sourceId);

    if (incomingByIdentity.has(identityKey)) {
      const previous = incomingByIdentity.get(identityKey);

      const previousSerialized = JSON.stringify(
        stableSerialize(previous)
      );

      const currentSerialized = JSON.stringify(
        stableSerialize(record)
      );

      // Duplicate identities with different data indicate a
      // potential data integrity issue. Do not silently discard it.
      if (previousSerialized !== currentSerialized) {
        throw new Error(
          `Conflicting incoming TradeFlow records for identity: ${identityKey}`
        );
      }

      duplicateIncomingCount++;
      continue;
    }

    incomingByIdentity.set(identityKey, record);
  }

  const uniqueRecords = [...incomingByIdentity.values()];

  // 2. Build MongoDB identities.
  const identities = uniqueRecords.map((record) => ({
    source: sourceId,
    frequency: record.frequency,
    period: record.period,
    reporterCode: record.reporterCode,
    partnerCode: record.partnerCode,
    flowCode: record.flowCode,
    classificationCode: record.classificationCode ?? null,
    cmdCode: record.cmdCode,
  }));

  // 3. Fetch existing documents.
  const existingRecords = await TradeFlow.find({
    $or: identities,
  }).lean();

  const existingByIdentity = new Map();

  for (const existing of existingRecords) {
    existingByIdentity.set(
      getIdentityKey(existing, sourceId),
      existing
    );
  }

  const insertOperations = [];
  const updateOperations = [];

  let unchangedCount = 0;

  // 4. Compare incoming data with the existing database records.
  for (const record of uniqueRecords) {
    const identity = {
      source: sourceId,
      frequency: record.frequency,
      period: record.period,
      reporterCode: record.reporterCode,
      partnerCode: record.partnerCode,
      flowCode: record.flowCode,
      classificationCode: record.classificationCode ?? null,
      cmdCode: record.cmdCode,
    };

    const {
      frequency,
      period,
      reporterCode,
      partnerCode,
      flowCode,
      classificationCode,
      cmdCode,
      ...recordFields
    } = record;

    const expectedFields = {
      ...recordFields,
      sourceUrl: buildSourceUrl(record),
    };

    const identityKey = getIdentityKey(record, sourceId);
    const existing = existingByIdentity.get(identityKey);

    // 5. New record — insert using an upsert.
    if (!existing) {
      insertOperations.push({
        updateOne: {
          filter: identity,
          update: {
            $set: {
              ...expectedFields,
              lastFetchedAt: fetchedAt,
            },
            $setOnInsert: {
              ...identity,
              firstFetchedAt: fetchedAt,
            },
          },
          upsert: true,
        },
      });

      continue;
    }

    // 6. Compare stored values with incoming values.
    const existingFields = {};

    for (const field of Object.keys(expectedFields)) {
      existingFields[field] = existing[field];
    }

    const expectedSerialized = JSON.stringify(
      stableSerialize(expectedFields)
    );

    const existingSerialized = JSON.stringify(
      stableSerialize(existingFields)
    );

    // 7. Identical record — don't write to MongoDB.
    if (expectedSerialized === existingSerialized) {
      unchangedCount++;
      continue;
    }

    // 8. Existing record with changed data.
    updateOperations.push({
      updateOne: {
        filter: identity,
        update: {
          $set: {
            ...expectedFields,
            lastFetchedAt: fetchedAt,
          },
        },
      },
    });
  }

  // 9. Perform insert/upsert operations.
  let insertResult = null;

  if (insertOperations.length > 0) {
    insertResult = await TradeFlow.bulkWrite(
      insertOperations,
      { ordered: false }
    );
  }

  // 10. Perform changed-record updates separately.
  let updateResult = null;

  if (updateOperations.length > 0) {
    updateResult = await TradeFlow.bulkWrite(
      updateOperations,
      { ordered: false }
    );
  }

  // 11. Use actual MongoDB results, not predicted counts.
  return {
    inserted: insertResult?.upsertedCount || 0,
    updated: updateResult?.modifiedCount || 0,
    matched:
      (insertResult?.matchedCount || 0) +
      (updateResult?.matchedCount || 0),
    unchanged: unchangedCount,
    duplicateIncoming: duplicateIncomingCount,
  };
}

function chunkArray(items, chunkSize) {
  const chunks = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export async function ingestIndiaMonthlyTradeFlows({
  numberOfMonths = 12,
  periods,
} = {}) {
  await connectDB();

  const attemptedAt = new Date();

  const source = await DataSource.findOneAndUpdate(
    { key: SOURCE_CONFIG.key },
    {
      $set: {
        ...SOURCE_CONFIG,
        "sync.lastAttemptAt": attemptedAt,
        "sync.lastError": null,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  try {
    // Use explicit periods for historical backfills.
    // Normal scheduled ingestion continues to use numberOfMonths.
    const requestedPeriods = periods
      ? [...new Set(periods.map(String))].sort()
      : null;

    if (
      requestedPeriods &&
      (
        requestedPeriods.length === 0 ||
        requestedPeriods.some((period) => !/^\d{6}$/.test(period))
      )
    ) {
      throw new Error("Invalid historical backfill periods.");
    }

    // Request at most 12 monthly periods per UN Comtrade API call.
    const periodBatches = requestedPeriods
      ? chunkArray(requestedPeriods, 12)
      : [null];

    const allRecords = [];
    const batchResults = [];

    for (const batchPeriods of periodBatches) {
      const result = await fetchIndiaMonthlyTradeFlows(
        batchPeriods
          ? { periods: batchPeriods }
          : { numberOfMonths }
      );

      allRecords.push(...result.records);
      batchResults.push(result);
    }

    const finalRequestedPeriods =
      requestedPeriods || batchResults[0].requestedPeriods;

    const records = allRecords;

    const coverage = calculateTradeCoverage(
      finalRequestedPeriods,
      records
    );

    let insertedCount = 0;
    let updatedCount = 0;
    let matchedCount = 0;
    let unchangedCount = 0;
    let duplicateIncomingCount = 0;

    for (
      let index = 0;
      index < records.length;
      index += BATCH_SIZE
    ) {
      const batch = records.slice(
        index,
        index + BATCH_SIZE
      );

      const writeResult = await writeTradeFlowBatch(
        source._id,
        batch
      );

      insertedCount += writeResult.inserted;
      updatedCount += writeResult.updated;
      matchedCount += writeResult.matched;
      unchangedCount += writeResult.unchanged;
      duplicateIncomingCount += writeResult.duplicateIncoming;
    }

    await DataSource.updateOne(
      { _id: source._id },
      {
        $set: {
          "sync.lastSuccessAt": new Date(),
          "sync.lastError": null,
          "sync.consecutiveFailures": 0,
          "sync.lastFetchedCount": records.length,
          "sync.lastInsertedCount": insertedCount,
          "sync.coverage": coverage,
        },
      }
    );

    return {
      source: SOURCE_CONFIG.key,
      reporter: "India",
      reporterCode: 699,
      partner: "World",
      partnerCode: 0,
      frequency: "monthly",

      requestedPeriods: finalRequestedPeriods,
      batches: batchResults.length,
      coverage,

      fetched: records.length,
      inserted: insertedCount,
      updated: updatedCount,
      matched: matchedCount,
      unchanged: unchangedCount,
      duplicateIncoming: duplicateIncomingCount,

      reportedByApi: batchResults.reduce(
        (total, result) => total + (result.reportedCount || 0),
        0
      ),

      elapsedTime: batchResults.reduce(
        (total, result) => total + (Number(result.elapsedTime) || 0),
        0
      ),

      requestUrls: batchResults.map((result) => result.requestUrl),
    };
  } catch (error) {
    await DataSource.updateOne(
      { _id: source._id },
      {
        $set: {
          "sync.lastError": String(
            error.message || error
          ).slice(0, 2000),
        },
        $inc: {
          "sync.consecutiveFailures": 1,
        },
      }
    );

    throw error;
  }
}
