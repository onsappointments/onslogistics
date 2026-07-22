import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-8 py-20 text-center">
      <SearchX className="mx-auto h-12 w-12 text-gray-400" />

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        No matching schemes found
      </h3>

      <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
        Try searching with another keyword or browse all government
        schemes using the filters above.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {["MOOWR", "AEO", "EPCG", "RoDTEP"].map((term) => (
          <span
            key={term}
            className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}