import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

function Rating({ value }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < value
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function ComplexityBadge({ value }) {
  const styles = {
    Low: "bg-green-50 text-green-700 border-green-200",
    Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    High: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[value] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {value}
    </span>
  );
}

export default function ComparisonTable({ schemes }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="sticky top-0 bg-gray-50">
          <tr className="border-b border-gray-200">
            <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
              Scheme
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
              Best For
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
              Import Duty Benefit
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
              Export Benefit
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
              Complexity
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">
              Ideal Business
            </th>

            <th className="px-6 py-5 text-right text-sm font-semibold text-gray-900">
            </th>
          </tr>
        </thead>

        <tbody>
          {schemes.map((scheme) => (
            <tr
              key={scheme.id}
              className="border-b border-gray-100 transition-colors hover:bg-blue-50/40"
            >
              <td className="px-6 py-6">
                <div className="font-semibold text-gray-900">
                  {scheme.scheme}
                </div>
              </td>

              <td className="px-6 py-6 text-gray-600">
                {scheme.bestFor}
              </td>

              <td className="px-6 py-6">
                <Rating value={scheme.importDuty} />
              </td>

              <td className="px-6 py-6">
                <Rating value={scheme.exportBenefit} />
              </td>

              <td className="px-6 py-6">
                <ComplexityBadge value={scheme.complexity} />
              </td>

              <td className="px-6 py-6 text-gray-600">
                {scheme.ideal}
              </td>

              <td className="px-6 py-6 text-right">
                <Link
                  href={scheme.href}
                  className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  Read Guide

                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}