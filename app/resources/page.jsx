"use client";

import { useState } from "react";
import { articles } from "@/lib/data";
import {
  filterArticles,
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/utils";

import SearchBar from "@/Components/resources/SearchBar";
import CategoryTabs from "@/Components/resources/CategoryTabs";
import ArticleCard from "@/Components/resources/ArticleCard";
import CTASection from "@/Components/resources/CTASection";
import LearningPaths from "@/Components/resources/LearningPaths";

const categories = [
  "All",
  ...Array.from(
    new Set(articles.map((a) => a.category))
  ),
];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const filtered = filterArticles({
    articles,
    search,
    category: active,
  });

  const featured = filtered
  .filter((a) => a.featured)
  .slice(0, 3);

  const latest = filtered.filter(
    (a) => !a.featured
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">

      {/* HERO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Logistics Knowledge Hub
        </h1>

        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore expert insights on shipping, customs, pricing, and logistics across India.
        </p>

        <SearchBar value={search} onChange={setSearch} />
      </div>

      <LearningPaths />

      {/* CATEGORY FILTER */}
      <CategoryTabs
        categories={categories}
        active={active}
        setActive={setActive}
      />

      {/* FEATURED */}
      {featured.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Featured Guides
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((a) => (
              <ArticleCard key={a.slug} article={a} featured />
            ))}
          </div>
        </div>
      )}

      {/* ALL ARTICLES */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          All Articles
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {latest.map((a, i) => {
            console.log("ARTICLE:", i, a.slug);

            return (
              <ArticleCard
                key={a.slug || i}
                article={a}
              />
            );
          })}
        </div>

        {latest.length === 0 && (
          <p className="text-gray-500 mt-6">
            No articles found.
          </p>
        )}
      </div>

      {/* CTA */}
      <CTASection />
    </div>
  );
}