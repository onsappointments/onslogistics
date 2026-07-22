import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

export default function SchemeCard({ article }) {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-7
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
      "
    >
      {/* Category */}

      <div className="flex flex-wrap gap-2">
        {(article.tags || []).slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}

      <h3 className="mt-5 text-2xl font-bold text-gray-900">
        {article.title}
      </h3>

      {/* Metadata */}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {article.readTime}
        </div>

        {article.lastUpdated && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {article.lastUpdated}
          </div>
        )}
      </div>

      {/* Description */}

      <p className="mt-6 flex-grow leading-7 text-gray-600">
        {article.description}
      </p>

      {/* Key Takeaways */}

      {article.keyTakeaways?.length > 0 && (
        <div className="mt-7 space-y-3">
          {article.keyTakeaways.slice(0, 3).map((item) => (
            <div
              key={item}
              className="flex items-start gap-2"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />

              <span className="text-sm text-gray-600">
                {item}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}

      <Link
        href={`/resources/${article.slug}`}
        className="mt-8 inline-flex items-center font-semibold text-blue-600 transition-colors hover:text-blue-700"
      >
        Read Complete Guide

        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}