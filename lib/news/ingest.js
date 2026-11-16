
import connectDB from "@/lib/mongodb";
import News from "@/models/News";
import { fetchWtoArticles } from "@/lib/news/sources/wto";

export async function ingestGlobalTradeNews() {
  await connectDB();

  const articles = await fetchWtoArticles();

  if (!Array.isArray(articles)) {
    throw new Error("WTO adapter returned an invalid response.");
  }

  if (articles.length === 0) {
    return {
      source: "WTO",
      fetched: 0,
      inserted: 0,
      alreadyKnown: 0,
    };
  }

  const operations = articles.map((article) => {
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

  const summary = {
    source: "WTO",
    fetched: articles.length,
    inserted: result.upsertedCount || 0,
    alreadyKnown: result.matchedCount || 0,
  };

  console.info("[News Ingestion] Completed:", summary);

  return summary;
}
