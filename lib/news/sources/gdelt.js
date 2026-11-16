import { createHash } from "node:crypto";

const GDELT_ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";

const SEARCH_QUERY =
  '(customs OR tariff OR tariffs OR "import duty" OR "export duty" OR "trade policy" OR "trade agreement" OR "global trade" OR "international trade" OR "freight rate" OR "freight rates" OR "container rate" OR "shipping cost" OR "ocean freight" OR "air freight" OR "port congestion" OR "port strike" OR "shipping route" OR "trade route" OR "Red Sea" OR "Suez Canal" OR "Panama Canal" OR "supply chain" OR "container shipping" OR "export" OR "import" OR "shipping disruption")';

const CATEGORY_RULES = [
  {
    category: "customs-compliance",
    terms: [
      "customs",
      "tariff",
      "tariffs",
      "import duty",
      "export duty",
      "customs duty",
      "customs clearance",
      "trade policy",
      "trade regulation",
      "sanction",
      "sanctions",
      "export control",
      "import restriction",
    ],
  },
  {
    category: "trade-routes",
    terms: [
      "red sea",
      "suez canal",
      "panama canal",
      "strait of hormuz",
      "shipping route",
      "trade route",
      "route disruption",
      "shipping disruption",
      "rerouting",
      "diversion",
      "chokepoint",
    ],
  },
  {
    category: "freight-market",
    terms: [
      "freight rate",
      "freight rates",
      "container rate",
      "shipping cost",
      "ocean freight",
      "air freight",
      "bunker fuel",
      "fuel surcharge",
      "container shipping rate",
      "shipping rates",
    ],
  },
  {
    category: "ports-logistics",
    terms: [
      "port congestion",
      "port strike",
      "port closure",
      "container terminal",
      "shipping port",
      "vessel",
      "logistics",
      "supply chain",
      "shipping",
      "container",
    ],
  },
  {
    category: "global-trade",
    terms: [
      "global trade",
      "international trade",
      "trade agreement",
      "trade deal",
      "trade talks",
      "trade war",
      "world trade",
      "export",
      "import",
      "wto",
    ],
  },
];

function canonicalizeUrl(value) {
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;

    parsed.hash = "";

    for (const key of [...parsed.searchParams.keys()]) {
      if (
        key.toLowerCase().startsWith("utm_") ||
        ["fbclid", "gclid", "mc_cid", "mc_eid", "ref", "source"].includes(
          key.toLowerCase()
        )
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

function parseGdeltDate(value) {
  if (!value || typeof value !== "string") return new Date();

  const compact = value.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
  );

  if (compact) {
    const [, year, month, day, hour, minute, second] = compact;
    const parsed = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
    );
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function classifyArticle(title) {
  const normalized = String(title || "").toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((term) => normalized.includes(term))) {
      return rule.category;
    }
  }

  return null;
}

function makeSlug(title, urlHash) {
  const base = String(title || "trade-update")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);

  return `${base || "trade-update"}-${urlHash.slice(0, 8)}`;
}

export async function fetchGdeltArticles() {
  const params = new URLSearchParams({
    query: SEARCH_QUERY,
    mode: "ArtList",
    format: "json",
    maxrecords: "250",
    timespan: "1d",
    sort: "DateDesc",
  });

  const response = await fetch(`${GDELT_ENDPOINT}?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "ONS-Global-Trade-Intelligence/1.0 (https://onslog.com)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`GDELT request failed with HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("json")) {
    const body = (await response.text()).slice(0, 300);
    throw new Error(
      `GDELT returned a non-JSON response: ${body || "empty response"}`
    );
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.articles)) {
    throw new Error("GDELT response did not contain an articles array");
  }

  const seenHashes = new Set();
  const normalizedArticles = [];

  for (const article of payload.articles) {
    const title = String(article.title || "").trim();
    const url = canonicalizeUrl(article.url || "");
    const category = classifyArticle(title);

    if (!title || !url || !category) continue;

    const canonicalUrlHash = createHash("sha256").update(url).digest("hex");
    if (seenHashes.has(canonicalUrlHash)) continue;
    seenHashes.add(canonicalUrlHash);

    let sourceDomain = article.domain || null;
    if (!sourceDomain) {
      try {
        sourceDomain = new URL(url).hostname.replace(/^www\./, "");
      } catch {
        sourceDomain = null;
      }
    }

    const imageUrl = canonicalizeUrl(article.socialimage || "");

    normalizedArticles.push({
      title,
      slug: makeSlug(title, canonicalUrlHash),
      url,
      canonicalUrlHash,
      source: "GDELT",
      sourceDomain,
      category,
      status: "published",
      publishedAt: parseGdeltDate(article.seendate),
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      imageUrl,
      language: article.language || null,
      sourceCountry: article.sourcecountry || null,
    });
  }

  return normalizedArticles;
}
