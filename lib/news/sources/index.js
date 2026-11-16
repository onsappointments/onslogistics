
import { fetchWtoArticles } from "@/lib/news/sources/wto";

// Register active news providers here.
// Every adapter must return articles in the same normalized format.
export const NEWS_SOURCE_ADAPTERS = [
  {
    key: "WTO",
    fetchArticles: fetchWtoArticles,
  },
];
