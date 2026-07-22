import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";

export default function HeroContent({
  content,
  search,
  actions,
}) {
  return (
    <div className="flex flex-col">
      {/* Eyebrow */}
      <div className="mb-5 inline-flex w-fit items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
        <BookOpen className="mr-2 h-4 w-4 text-blue-700" />

        <span className="text-sm font-semibold tracking-wide text-blue-700">
          {content.eyebrow}
        </span>
      </div>

      {/* Heading */}
      <h1
        id="government-schemes-heading"
        className="max-w-3xl text-4xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
      >
        {content.title}
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-600">
        {content.description}
      </p>

      {/* Shared Resources Search */}
      <div className="mt-6">
        {search.searchComponent}
      </div>

      {/* Popular Searches */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />

          <p className="text-sm font-medium text-gray-500">
            Popular Searches
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {search.popularSearches.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row">
        <Link
          href={actions.primary.href}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
        >
          {actions.primary.label}

          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>

        <Link
          href={actions.secondary.href}
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-800 transition-all duration-200 hover:border-blue-600 hover:text-blue-700"
        >
          {actions.secondary.label}
        </Link>
      </div>

      {/* Trust Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-5 border-t border-gray-200 pt-6 sm:grid-cols-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">10+</p>

          <p className="mt-1 text-sm text-gray-600">
            Government Trade Schemes
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900">CBIC</p>

          <p className="mt-1 text-sm text-gray-600">
            Customs Programmes
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900">DGFT</p>

          <p className="mt-1 text-sm text-gray-600">
            Export Promotion
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900">100%</p>

          <p className="mt-1 text-sm text-gray-600">
            Practical Guides
          </p>
        </div>
      </div>
    </div>
  );
}