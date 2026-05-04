"use client";

import { useRef, useEffect } from "react";

export default function CategoryTabs({
  categories,
  active,
  setActive,
}) {
  const containerRef = useRef(null);

  // 🔹 auto scroll active tab into view
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(
      `[data-active="true"]`
    );

    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  return (
    <div className="mt-6">

      {/* SCROLL WRAPPER */}
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
      >
        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              data-active={isActive}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 border
              
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* OPTIONAL: Divider */}
      <div className="mt-4 border-b border-gray-100" />
    </div>
  );
}