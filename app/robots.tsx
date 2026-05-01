import { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://onslog.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Standard crawlers ──────────────────────────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/private/",
        ],
      },

      // ── AI / GEO crawlers — explicitly allowed for GEO visibility ──────
      // Allowing these means your content gets cited in ChatGPT, Perplexity,
      // Claude, and Bing Copilot answers. Do NOT block these if GEO matters.
      { userAgent: "GPTBot",          allow: "/" },   // ChatGPT / OpenAI
      { userAgent: "ClaudeBot",       allow: "/" },   // Claude / Anthropic
      { userAgent: "PerplexityBot",   allow: "/" },   // Perplexity AI
      { userAgent: "Googlebot",       allow: "/" },   // Google (incl. AI Overviews)
      { userAgent: "Bingbot",         allow: "/" },   // Bing Copilot
      { userAgent: "anthropic-ai",    allow: "/" },   // Anthropic crawler
      { userAgent: "cohere-ai",       allow: "/" },   // Cohere
      { userAgent: "YouBot",          allow: "/" },   // You.com AI
    ],

    // ── Sitemaps ─────────────────────────────────────────────────────────
    sitemap: `${baseUrl}/sitemap.xml`,

    // ── llms.txt — for AI systems that check this ────────────────────────
    // Place your llms.txt at /public/llms.txt so it serves at /llms.txt
    host: baseUrl,
  };
}