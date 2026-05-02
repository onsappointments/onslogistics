import { MetadataRoute } from "next";

// Centralise the base URL with a guaranteed fallback so you never get
// "undefined/services" if the env var is missing during build.
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://onslog.com";

// All FAQ category slugs — keep in sync with faq-data.js
const faqCategories = [
  "pricing",
  "services",
  "time",
  "comparison",
  "basics",
  "customs",
  "docs",
  "duties",
  "logistics",
  "india",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // ── Core pages ────────────────────────────────────────────────────────
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}#about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/container-dimensions/standard`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/container-dimensions/special`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tracking`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
     {
      url: `${baseUrl}/request-quote`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-appointment`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ── FAQ index ─────────────────────────────────────────────────────────
    // High priority — this is a major GEO/SEO asset
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ── FAQ category pages ────────────────────────────────────────────────
    // Each gets its own URL, title, and schema — treat them as first-class pages.
    // "pricing" and "services" are highest priority (commercial intent).
    // "comparison" and "time" are next (informational → conversion).
    // The rest are standard reference pages.
    ...faqCategories.map((slug) => ({
      url: `${baseUrl}/faq/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority:
        slug === "pricing" || slug === "services"
          ? 0.9
          : slug === "comparison" || slug === "time"
          ? 0.8
          : 0.7,
    })),
  ];
}