// lib/utils.js

// 🔹 FILTER ARTICLES (search + category)
export function filterArticles({ articles, search = "", category = "All" }) {
  return articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || a.category === category;

    return matchesSearch && matchesCategory;
  });
}

// 🔹 FEATURED ARTICLES
export function getFeaturedArticles(articles) {
  return articles.filter((a) => a.featured);
}

// 🔹 SORT (latest or best first)
export function getLatestArticles(articles) {
  return [...articles].sort((a, b) => {
    // fallback if readTime missing
    const aTime = a.readTime || 0;
    const bTime = b.readTime || 0;

    return bTime - aTime;
  });
}

// 🔹 RELATED ARTICLES (smart + fallback)
export function getRelatedArticles(current, articles) {
  const related = articles.filter(
    (a) =>
      a.slug !== current.slug &&
      a.category === current.category
  );

  // fallback if not enough in same category
  if (related.length < 3) {
    return articles
      .filter((a) => a.slug !== current.slug)
      .slice(0, 3);
  }

  return related.slice(0, 3);
}

// 🔹 GET ARTICLE BY SLUG
export function getArticleBySlug(slug, articles) {
  return articles.find((a) => a.slug === slug);
}

// 🔹 OPTIONAL: POPULAR CATEGORIES (for UI)
export function getPopularCategories(articles) {
  const map = {};

  articles.forEach((a) => {
    map[a.category] = (map[a.category] || 0) + 1;
  });

  return Object.keys(map);
}