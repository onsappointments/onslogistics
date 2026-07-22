import { articles } from "@/lib/data";

/**
 * Government Scheme Article Slugs
 *
 * These determine:
 * - Hero cards
 * - Featured scheme cards
 * - Popular searches
 *
 * The article itself remains the source of truth.
 */

const FEATURED_SCHEME_SLUGS = [
  "what-is-moowr-scheme",
  "authorised-economic-operator-aeo-guide",
  "epcg-scheme-guide",
  "advance-authorization-scheme-guide",
  "rodtep-scheme-guide",
  "duty-drawback-scheme-guide",
];

/**
 * Returns featured Government Scheme articles.
 */
export function getFeaturedSchemes() {
  return FEATURED_SCHEME_SLUGS.map((slug) =>
    articles.find((article) => article.slug === slug)
  ).filter(Boolean);
}

/**
 * Returns search chips for Hero.
 */
export function getPopularSearches() {
  return getFeaturedSchemes().map((article) => ({
    label: article.title
      .replace("Guide", "")
      .replace("Scheme", "")
      .trim(),

    href: `/resources/${article.slug}`,
  }));
}

/**
 * Finds a Government Scheme article.
 */
export function getScheme(slug) {
  return articles.find((article) => article.slug === slug);
}

/**
 * Returns every Government Scheme article.
 *
 * This can later be expanded using:
 * category === "Government Schemes"
 */
export function getAllGovernmentSchemes() {
  return articles.filter((article) =>
    FEATURED_SCHEME_SLUGS.includes(article.slug)
  );
}

/**
 * Hero dashboard cards.
 *
 * Small wrapper around article data so UI
 * doesn't need to know article structure.
 */
export function getHeroCards() {
  return getFeaturedSchemes()
    .slice(0, 4)
    .map((article, index) => ({
      id: article.slug,

      title: article.title,

      description: article.description,

      href: `/resources/${article.slug}`,

      badge:
        index === 0
          ? "Popular"
          : index === 1
          ? "Trusted"
          : index === 2
          ? "Capital Goods"
          : "Export",

      badgeColor:
        index === 0
          ? "green"
          : index === 1
          ? "blue"
          : index === 2
          ? "orange"
          : "purple",
    }));
}