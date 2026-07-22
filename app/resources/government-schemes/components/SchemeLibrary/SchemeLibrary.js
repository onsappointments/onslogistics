"use client";

import { useEffect, useMemo, useState } from "react";

import SearchBar from "@/Components/resources/SearchBar.jsx";

import SchemeFilters from "./SchemeFilters";
import SchemeGrid from "./SchemeGrid";
import EmptyState from "./EmptyState";

const FILTERS = [
  "All",
  "Manufacturing",
  "Export",
  "Import",
  "Compliance",
  "Warehousing",
];

export default function SchemeLibrary({
  articles = [],
  initialSearch = "",
}) {
  const [search, setSearch] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const terms = query.split(/\s+/).filter(Boolean);

        const matchesSearch =
  terms.length === 0 ||
  terms.some((term) =>
    article.title?.toLowerCase().includes(term) ||
    article.description?.toLowerCase().includes(term) ||
    article.directAnswer?.toLowerCase().includes(term) ||
    article.tags?.some((tag) =>
      tag.toLowerCase().includes(term)
    ) ||
    article.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(term)
    )
  );

      const matchesFilter =
        activeFilter === "All" ||
        article.tags?.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [articles, search, activeFilter]);

  return (
    <section
      id="scheme-library"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Government Scheme Library
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900 lg:text-5xl">
            Explore Detailed Scheme Guides
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Browse in-depth guides covering India's major government trade
            schemes, eligibility, documentation, compliance requirements,
            benefits and practical implementation.
          </p>
        </div>

        {/* Statistics */}

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <Stat
            value={`${articles.length}+`}
            label="Government Schemes"
          />

          <Stat
            value={`${articles.reduce(
              (total, article) =>
                total + (article.faqs?.length || 0),
              0
            )}+`}
            label="FAQs"
          />

          <Stat
            value={`${articles.reduce(
              (total, article) =>
                total + (article.keyTakeaways?.length || 0),
              0
            )}+`}
            label="Key Insights"
          />

          <Stat
            value="Weekly"
            label="Content Updates"
          />
        </div>

        {/* Search */}

        <div className="mx-auto mt-14 max-w-3xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search MOOWR, AEO, EPCG, RoDTEP..."
          />
        </div>

        {/* Filters */}

        <div className="mt-8">
          <SchemeFilters
            filters={FILTERS}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Results */}

        <div className="mt-12">
          {filteredArticles.length > 0 ? (
            <SchemeGrid articles={filteredArticles} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center transition-all duration-300 hover:shadow-lg">
      <div className="text-3xl font-bold text-gray-900">
        {value}
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {label}
      </div>
    </div>
  );
}