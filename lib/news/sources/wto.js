
import Parser from "rss-parser";
import { createHash } from "node:crypto";

const WTO_FEED_URL =
  "https://www.wto.org/library/rss/latest_news_e.xml";

const WTO_SOURCE = "World Trade Organization (WTO)";

const parser = new Parser();

function canonicalizeUrl(value) {
  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    parsed.hash = "";

    for (const key of [...parsed.searchParams.keys()]) {
      const normalizedKey = key.toLowerCase();

      if (
        normalizedKey.startsWith("utm_") ||
        ["fbclid", "gclid"].includes(normalizedKey)
      ) {
        parsed.searchParams.delete(key);
      }
    }

    parsed.hostname = parsed.hostname.toLowerCase();

    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function makeSlug(title, hash) {
  const base = String(title || "wto-update")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);

  return `${base || "wto-update"}-${hash.slice(0, 8)}`;
}

function parsePublicationDate(item) {
  const value = item.isoDate || item.pubDate;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function fetchWtoArticles() {
  console.info("[WTO] Fetching latest news...");

  const response = await fetch(WTO_FEED_URL, {
    method: "GET",
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent":
        "ONS-Global-Trade-Intelligence/1.0 (https://onslog.com)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `WTO RSS request failed: HTTP ${response.status}. ${body.slice(0, 300)}`
    );
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("xml")) {
    throw new Error(
      `WTO returned an unexpected content type: ${contentType}`
    );
  }

  const xml = await response.text();

  if (!xml.trim()) {
    throw new Error("WTO returned an empty RSS response.");
  }

  const feed = await parser.parseString(xml);

  if (!feed || !Array.isArray(feed.items)) {
    throw new Error("WTO returned an invalid RSS feed.");
  }

  const seenHashes = new Set();
  const articles = [];

  for (const item of feed.items) {
    const title = String(item.title || "").trim();
    const url = canonicalizeUrl(item.link || "");
    const publishedAt = parsePublicationDate(item);

    if (!title || !url || !publishedAt) {
      continue;
    }

    const canonicalUrlHash = createHash("sha256")
      .update(url)
      .digest("hex");

    if (seenHashes.has(canonicalUrlHash)) {
      continue;
    }

    seenHashes.add(canonicalUrlHash);

    const imageUrl = item.enclosure?.url
      ? canonicalizeUrl(item.enclosure.url)
      : null;

    articles.push({
      title,
      slug: makeSlug(title, canonicalUrlHash),
      url,
      canonicalUrlHash,
      source: WTO_SOURCE,
      sourceDomain: "wto.org",
      category: "global-trade",
      status: "published",
      publishedAt,
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      imageUrl,
      language: "en",
      sourceCountry: "Global",
    });
  }

  console.info("[WTO] Feed processed:", {
    feedTitle: feed.title,
    totalItems: feed.items.length,
    validArticles: articles.length,
  });

  return articles;
}
