"use client";

import { useRef } from "react";

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  const clearSearch = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">

      {/* INPUT WRAPPER */}
      <div className="flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 transition focus-within:ring-2 focus-within:ring-blue-500">

        {/* SEARCH ICON */}
        <svg
          className="w-5 h-5 text-gray-400 mr-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* INPUT */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search guides, customs, shipping..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none text-sm placeholder-gray-400"
        />

        {/* CLEAR BUTTON */}
        {value && (
          <button
            onClick={clearSearch}
            className="ml-3 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* OPTIONAL HELPER TEXT */}
      <p className="text-xs text-gray-400 mt-2 text-left">
        Try: customs clearance, FCL vs LCL, import duty
      </p>
    </div>
  );
}