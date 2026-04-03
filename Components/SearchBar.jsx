"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useRef, useState } from "react";

export default function SearchBar({ defaultValue = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleChange(e) {
    const val = e.target.value;
    setValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) params.set("search", val);
      else params.delete("search");

      startTransition(() => {
        router.replace(`?${params.toString()}`);
      });
    }, 400);
  }

  return (
    <div className="relative w-full max-w-sm">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by company or name…"
        className={`w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          isPending ? "opacity-60" : ""
        }`}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
