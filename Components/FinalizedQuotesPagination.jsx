
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const PAGE_SIZES = ["10", "20", "30", "40", "50", "all"];

export default function FinalizedQuotesPagination({
  page,
  pageSize,
  totalPages,
  totalQuotes,
  showingFrom,
  showingTo,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function changePageSize(value) {
    updateParams({
      pageSize: value === "10" ? null : value,
      page: null,
    });
  }

  const isAll = pageSize === "all";

  return (
    <div
      className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
        isPending ? "opacity-60" : ""
      }`}
      aria-busy={isPending}
    >
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {showingFrom}–{showingTo}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {totalQuotes}
        </span>{" "}
        quotes
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Per page
          <select
            value={pageSize}
            onChange={(event) => changePageSize(event.target.value)}
            disabled={isPending}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size === "all" ? "All" : size}
              </option>
            ))}
          </select>
        </label>

        {!isAll && (
          <>
            <span className="whitespace-nowrap text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateParams({ page: page - 1 })}
                disabled={isPending || page <= 1}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => updateParams({ page: page + 1 })}
                disabled={isPending || page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
