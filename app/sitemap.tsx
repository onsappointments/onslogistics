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

// ─────────────────────────────────────────────────────────────────────────────
// Fetch your actual published resource/blog posts at build time.
// Replace this with your real CMS call, DB query, or fs.readdir() —
// whatever generates your /resources/[slug] pages.
//
// Example if you use a headless CMS:
//   const res = await fetch("https://your-cms.io/api/posts");
//   const posts = await res.json();
//
// Example if you use local MDX files:
//   import fs from "fs";
//   const slugs = fs.readdirSync("content/resources").map(f => f.replace(/\.mdx?$/, ""));
//
// The shape returned must be: Array<{ slug: string; updatedAt: Date }>
// ─────────────────────────────────────────────────────────────────────────────
async function getResourcePosts(): Promise<{ slug: string; updatedAt: Date }[]> {
  // TODO: replace with your real data source
  // Returning an empty array is safe — it just means no resource pages
  // appear in the sitemap until you wire this up.
  return [];

  // Example hardcoded list until your CMS is connected:
  // return [
  //   { slug: "how-to-get-iec-code-india",          updatedAt: new Date("2025-03-10") },
  //   { slug: "fcl-vs-lcl-which-is-better",         updatedAt: new Date("2025-04-01") },
  //   { slug: "customs-clearance-ludhiana-guide",   updatedAt: new Date("2025-04-20") },
  //   { slug: "india-uae-cepa-export-benefits",     updatedAt: new Date("2025-05-01") },
  // ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch real resource posts — each gets its own real URL + real date
  const resourcePosts = await getResourcePosts();

  return [
    // ── Core pages ────────────────────────────────────────────────────────
    // Use real last-modified dates, not `new Date()`.
    // `new Date()` = "I changed this page today, every build day" → Google
    // stops trusting this signal. Use the date you actually last edited the page.
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2025-05-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date("2025-04-15"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // ❌ REMOVED: `${baseUrl}#about`
    // Hash fragments are client-side anchors, not pages.
    // Google ignores #fragments — this was a duplicate of the homepage.
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tracking`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/request-quote`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-appointment`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ── Container dimensions ──────────────────────────────────────────────
    // Parent page was missing — added.
    {
      url: `${baseUrl}/container-dimensions`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/container-dimensions/standard`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/container-dimensions/special`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Resources / Blog ──────────────────────────────────────────────────
    // Index page — was missing entirely.
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date("2025-05-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Individual resource pages — fetched dynamically above.
    // Each entry is a REAL URL, not a route pattern like "/resources/:slug".
    // Priority: resources/blog posts are high-value SEO content.
    ...resourcePosts.map((post) => ({
      url: `${baseUrl}/resources/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // ── FAQ index ─────────────────────────────────────────────────────────
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date("2025-04-20"),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ── FAQ category pages ────────────────────────────────────────────────
    // "pricing" and "services" are highest priority (commercial intent).
    // "comparison" and "time" are next (informational → conversion).
    // The rest are standard reference pages.
    ...faqCategories.map((slug) => ({
      url: `${baseUrl}/faq/${slug}`,
      lastModified: new Date("2025-04-20"),
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