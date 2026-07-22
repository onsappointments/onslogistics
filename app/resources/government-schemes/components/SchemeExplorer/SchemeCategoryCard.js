"use client";

import { ArrowRight } from "lucide-react";

export default function SchemeCategoryCard({
  icon: Icon,
  title,
  description,
  schemes,
  search,
  onSelect,
}) {
  const handleClick = () => {
    onSelect(search);

    document
      .getElementById("scheme-library")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        group
        relative
        flex
        h-full
        w-full
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-7
        text-left
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
      "
    >
      {/* Background Gradient */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-blue-50/0
          via-white
          to-blue-50/60
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100">
          <Icon className="h-7 w-7 text-blue-600" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-4 flex-grow text-base leading-7 text-gray-600">
          {description}
        </p>

        {/* Related Schemes */}
        <div className="mt-6 flex flex-wrap gap-2">
          {schemes.map((scheme) => (
            <span
              key={scheme}
              className="
                rounded-full
                border
                border-blue-100
                bg-blue-50
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-700
              "
            >
              {scheme}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <span className="font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
            Explore Guides
          </span>

          <ArrowRight className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}