"use client";

import { useState } from "react";

import Hero from "./components/Hero/Hero";
import HeroSearch from "./components/Hero/HeroSearch";

import heroData from "./data/hero";

import SchemeExplorer from "./components/SchemeExplorer/SchemeExplorer";
import SchemeComparison from "./components/SchemeComparison/SchemeComparison";
import SchemeLibrary from "./components/SchemeLibrary/SchemeLibrary";
import FAQConsultation from "./components/FAQConsultation/FAQConsultation";

import { articles } from "@/lib/data";

export default function GovernmentSchemesPage() {
  const [searchText, setSearchText] = useState("");

  const governmentSchemes = articles.filter(
    (article) => article.category === "Government Schemes"
  );

  return (
    <main className="bg-white">
      <Hero
        content={{
          eyebrow: heroData.eyebrow,
          title: heroData.title,
          description: heroData.description,
        }}
        search={{
          placeholder: heroData.searchPlaceholder,
          popularSearches: heroData.popularSearches,
          searchComponent: (
            <HeroSearch
              articles={governmentSchemes}
              placeholder={heroData.searchPlaceholder}
            />
          ),
        }}
        actions={heroData.actions}
        cards={heroData.dashboardCards}
      />

      <SchemeExplorer
        onSelect={setSearchText}
      />

      <SchemeComparison />

      <SchemeLibrary
        articles={governmentSchemes}
        initialSearch={searchText}
      />

      <FAQConsultation />
    </main>
  );
}