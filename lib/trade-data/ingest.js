
import connectDB from "@/lib/mongodb";
import DataSource from "@/models/DataSource";
import TradeIndicator from "@/models/TradeIndicator";
import {
  fetchWorldBankCommodityPrices,
} from "@/lib/trade-data/sources/world-bank";

const SOURCE_CONFIG = {
  key: "world-bank-commodities",
  name: "World Bank Commodity Price Data (Pink Sheet)",
  description:
    "Monthly global benchmark commodity prices and commodity group indices from the World Bank Pink Sheet.",
  websiteUrl:
    "https://www.worldbank.org/en/research/commodity-markets",
  providerType: "international-organization",
  status: "active",
  coverage: ["Global"],
  dataCategories: ["commodity-price", "commodity-index"],
  attribution:
    "World Bank Commodity Price Data (The Pink Sheet).",
  licenseUrl:
    "https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets",
  updateFrequency: "monthly",
};

const BATCH_SIZE = 1000;


async function writeObservationBatch(
  sourceId,
  observations,
  workbookUrl
) {
  const existingRecords = await TradeIndicator.find({
    source: sourceId,
    $or: observations.map((item) => ({
      indicatorKey: item.indicatorKey,
      "geography.key": item.geography.key,
      "period.start": item.period.start,
    })),
  })
    .select(
      "indicatorKey geography.key period.start name category value unit currency metadata"
    )
    .lean();

  const existingMap = new Map(
    existingRecords.map((item) => [
      `${item.indicatorKey}|${item.geography.key}|${new Date(
        item.period.start
      ).getTime()}`,
      item,
    ])
  );

  const operations = [];
  const fetchedAt = new Date();

  for (const observation of observations) {
    const key = `${observation.indicatorKey}|${observation.geography.key}|${observation.period.start.getTime()}`;

    const existing = existingMap.get(key);

    const hasChanged =
      !existing ||
      existing.name !== observation.name ||
      existing.category !== observation.category ||
      existing.value !== observation.value ||
      existing.unit !== observation.unit ||
      existing.currency !== observation.currency ||
      JSON.stringify(existing.metadata || {}) !==
        JSON.stringify(observation.metadata || {});

    if (!hasChanged) continue;

    operations.push({
      updateOne: {
        filter: {
          source: sourceId,
          indicatorKey: observation.indicatorKey,
          "geography.key": observation.geography.key,
          "period.start": observation.period.start,
        },
        update: {
          $set: {
            name: observation.name,
            category: observation.category,
            value: observation.value,
            unit: observation.unit,
            currency: observation.currency,
            period: observation.period,
            geography: observation.geography,
            sourceUrl: workbookUrl,
            fetchedAt,
            status: "published",
            metadata: observation.metadata,
          },
          $setOnInsert: {
            source: sourceId,
          },
        },
        upsert: true,
      },
    });
  }

  if (!operations.length) {
    return {
      insertedCount: 0,
      modifiedCount: 0,
      unchangedCount: observations.length,
    };
  }

  const result = await TradeIndicator.bulkWrite(operations, {
    ordered: false,
  });

  return {
    insertedCount: result.upsertedCount || 0,
    modifiedCount: result.modifiedCount || 0,
    unchangedCount:
      observations.length - operations.length,
  };
}


export async function ingestWorldBankCommodityPrices() {
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
    const result = await fetchWorldBankCommodityPrices();

    const allObservations = [
  ...result.observations,
  ...result.indexObservations,
];

    let insertedCount = 0;
    let modifiedCount = 0;
    let unchangedCount = 0;

    for (
  let index = 0;
  index < allObservations.length;
  index += BATCH_SIZE
) {
  const batch = allObservations.slice(
    index,
    index + BATCH_SIZE
  );

  const writeResult = await writeObservationBatch(
    source._id,
    batch,
    result.workbookUrl
  );

  insertedCount += writeResult.insertedCount;
  modifiedCount += writeResult.modifiedCount;
  unchangedCount += writeResult.unchangedCount;
}

    await DataSource.updateOne(
      { _id: source._id },
      {
        $set: {
          dataUrl: result.workbookUrl,
          "sync.lastSuccessAt": new Date(),
          "sync.lastError": null,
          "sync.consecutiveFailures": 0,
          "sync.lastFetchedCount": allObservations.length,
          "sync.lastInsertedCount": insertedCount,
        },
      }
    );

    return {
  source: SOURCE_CONFIG.key,

  fetched: allObservations.length,
  inserted: insertedCount,
  updated: modifiedCount,
  unchanged: unchangedCount,

  priceSeries: result.seriesCount,
  priceObservations: result.observations.length,

  indexSeries: result.indexSeriesCount,
  indexObservations: result.indexObservations.length,

  workbookUrl: result.workbookUrl,
};
  } catch (error) {
    await DataSource.updateOne(
      { _id: source._id },
      {
        $set: {
          "sync.lastError": String(error.message || error).slice(
            0,
            2000
          ),
        },
        $inc: {
          "sync.consecutiveFailures": 1,
        },
      }
    );

    throw error;
  }
}
