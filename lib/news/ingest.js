
import connectDB from "@/lib/mongodb";
import News from "@/models/News";
import { NEWS_SOURCE_ADAPTERS } from "@/lib/news/sources";

async function ingestArticlesFromSource(adapter) {
  if (
    !adapter ||
    typeof adapter.key !== "string" ||
    typeof adapter.fetchArticles !== "function"
  ) {
    throw new Error("Invalid news source adapter configuration.");
  }

  console.info(`[News Ingestion] Fetching articles from ${adapter.key}...`);

  const articles = await adapter.fetchArticles();

  if (!Array.isArray(articles)) {
    throw new Error(
      `${adapter.key} adapter returned an invalid response.`
    );
  }

  if (articles.length === 0) {
    return {
      source: adapter.key,
      fetched: 0,
      inserted: 0,
      alreadyKnown: 0,
    };
  }

  const operations = articles.map((article) => {
    if (
      !article ||
      typeof article.canonicalUrlHash !== "string" ||
      !article.canonicalUrlHash.trim()
    ) {
      throw new Error(
        `${adapter.key} returned an article without a valid canonicalUrlHash.`
      );
    }

    const { lastSeenAt, ...insertFields } = article;

    return {
      updateOne: {
        filter: {
          canonicalUrlHash: article.canonicalUrlHash,
        },
        update: {
          $set: {
            lastSeenAt: new Date(),
          },
          $setOnInsert: insertFields,
        },
        upsert: true,
      },
    };
  });

  const result = await News.bulkWrite(operations, {
    ordered: false,
  });

  return {
    source: adapter.key,
    fetched: articles.length,
    inserted: result.upsertedCount || 0,
    alreadyKnown: result.matchedCount || 0,
  };
}

export async function ingestGlobalTradeNews() {
  await connectDB();

  if (
    !Array.isArray(NEWS_SOURCE_ADAPTERS) ||
    NEWS_SOURCE_ADAPTERS.length === 0
  ) {
    throw new Error("No news source adapters have been registered.");
  }

  const sourceResults = [];

  // Process providers sequentially.
  // This also lets the next provider detect articles inserted by
  // an earlier provider during the same ingestion run.
  for (const adapter of NEWS_SOURCE_ADAPTERS) {
    const result = await ingestArticlesFromSource(adapter);
    sourceResults.push(result);
  }

  const summary = {
    source:
      sourceResults.length === 1
        ? sourceResults[0].source
        : "multiple",
    sources: sourceResults,
    fetched: sourceResults.reduce(
      (total, item) => total + item.fetched,
      0
    ),
    inserted: sourceResults.reduce(
      (total, item) => total + item.inserted,
      0
    ),
    alreadyKnown: sourceResults.reduce(
      (total, item) => total + item.alreadyKnown,
      0
    ),
  };

  console.info("[News Ingestion] Completed:", summary);

  return summary;
}
