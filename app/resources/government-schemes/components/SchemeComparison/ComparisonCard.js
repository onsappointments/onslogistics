import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

function Rating({ value }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < value
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ComparisonCard({ scheme }) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {scheme.scheme}
        </h3>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {scheme.complexity}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Best For
          </p>

          <p className="mt-1 text-gray-700">
            {scheme.bestFor}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Import Duty Benefit
          </p>

          <div className="mt-2">
            <Rating value={scheme.importDuty} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Export Benefit
          </p>

          <div className="mt-2">
            <Rating value={scheme.exportBenefit} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Ideal Business
          </p>

          <p className="mt-1 text-gray-700">
            {scheme.ideal}
          </p>
        </div>
      </div>

      <Link
        href={scheme.href}
        className="mt-6 inline-flex items-center font-semibold text-blue-600"
      >
        Read Complete Guide

        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </article>
  );
}