"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import HeroSearchDropdown from "./HeroSearchDropdown";

export default function HeroSearch({ articles, placeholder }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return articles
      .map((article) => {
        let score = 0;

        const title = article.title.toLowerCase();
        const description = article.description?.toLowerCase() || "";
        const answer = article.directAnswer?.toLowerCase() || "";

        if (title.startsWith(q)) score += 100;
        if (title.includes(q)) score += 80;

        if (
          article.tags?.some((tag) =>
            tag.toLowerCase().includes(q)
          )
        )
          score += 60;

        if (
          article.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(q)
          )
        )
          score += 50;

        if (description.includes(q)) score += 30;

        if (answer.includes(q)) score += 20;

        return {
          ...article,
          score,
        };
      })
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [articles, query]);

  function navigate(article) {
    router.push(article.href);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setActiveIndex((prev) =>
        prev >= results.length - 1 ? 0 : prev + 1
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setActiveIndex((prev) =>
        prev <= 0 ? results.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        navigate(results[activeIndex]);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <div className="flex items-center rounded-2xl border border-gray-300 bg-white shadow-lg transition focus-within:border-blue-600">
        <Search className="ml-5 h-5 w-5 text-gray-400" />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-4 text-base outline-none"
        />
      </div>

      {open && (
        <HeroSearchDropdown
          query={query}
          results={results}
          onSelect={navigate}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
}