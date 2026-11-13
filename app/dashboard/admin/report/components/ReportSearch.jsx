"use client";

import { useEffect, useState } from "react";

export default function ReportSearch({
  onSearch,
  loading = false,
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = value.trim();

      // Avoid searching for very short terms.
      onSearch(query.length >= 2 ? query : "");
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  function clearSearch() {
    setValue("");
    onSearch("");
  }

  return (
    <div className="mb-4 w-full">
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 h-5 w-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="search"
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          placeholder="Search jobs, quotes, companies, contacts, containers, vessels..."
          className="
            h-12 w-full rounded-xl
            border border-gray-200
            bg-white pl-12 pr-12
            text-sm text-gray-800
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-blue-400
            focus:ring-2 focus:ring-blue-100
          "
        />

        {value && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="
              absolute right-4
              text-gray-400
              hover:text-gray-700
            "
          >
            ✕
          </button>
        )}

        {loading && (
          <span
            className="
              absolute right-11
              h-4 w-4 animate-spin
              rounded-full border-2
              border-gray-300 border-t-blue-600
            "
          />
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-400">
        Search across job, quote, and technical quote details.
        Results respect your selected report filters.
      </p>
    </div>
  );
}