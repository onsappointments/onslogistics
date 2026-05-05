import { MetadataRoute } from "next";
import { articles } from "@/lib/data";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://onslog.com";

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

// ✅ FIXED: simple sync function
function getResourcePosts() {
  return articles.map((a) => ({
    slug: a.slug,
    updatedAt: new Date(),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const resourcePosts = getResourcePosts();

  return [
    // ── Core pages ─────────────────────────────
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

    // ── Containers ─────────────────────────────
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

    // ── Resources (IMPORTANT) ───────────────────
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    ...resourcePosts.map((post) => ({
      url: `${baseUrl}/resources/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // ── FAQ ────────────────────────────────────
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date("2025-04-20"),
      changeFrequency: "weekly",
      priority: 0.9,
    },

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