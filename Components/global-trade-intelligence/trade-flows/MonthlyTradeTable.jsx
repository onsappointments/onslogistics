
"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

const PAGE_SIZE = 12;

const COLUMNS = [
  { key: "period", label: "Month", align: "left" },
  { key: "imports", label: "Imports", align: "right" },
  { key: "exports", label: "Exports", align: "right" },
  { key: "tradeBalance", label: "Trade balance", align: "right" },
  { key: "totalTrade", label: "Total trade", align: "right" },
];

function formatCurrency(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatCompactCurrency(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function SortIcon({ active, direction }) {
  if (!active) {
    return <ArrowDownUp size={13} className="text-gray-400" />;
  }

  return direction === "asc" ? (
    <ArrowUp size={13} className="text-blue-600" />
  ) : (
    <ArrowDown size={13} className="text-blue-600" />
  );
}

function AvailabilityValue({ value, available }) {
  if (!available || value === null || value === undefined) {
    return (
      <span className="text-xs font-medium text-gray-400">
        Unavailable
      </span>
    );
  }

  return (
    <span className="font-medium text-gray-800">
      {formatCurrency(value)}
    </span>
  );
}

function StatusBadge({ month }) {
  if (month.complete) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Complete
      </span>
    );
  }

  if (month.importsAvailable || month.exportsAvailable) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Incomplete
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      No data
    </span>
  );
}

export default function MonthlyTradeTable({
  monthlyData = [],
  loading = false,
}) {
  const [sortKey, setSortKey] = useState("period");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    return monthlyData.filter((month) => {
      if (statusFilter === "complete") return month.complete;

      if (statusFilter === "incomplete") {
        return (
          !month.complete &&
          (month.importsAvailable || month.exportsAvailable)
        );
      }

      if (statusFilter === "missing") {
        return !month.importsAvailable && !month.exportsAvailable;
      }

      return true;
    });
  }, [monthlyData, statusFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let first = a[sortKey];
      let second = b[sortKey];

      if (sortKey === "period") {
        first = String(first || "");
        second = String(second || "");
      } else {
        first = first == null ? Number.NEGATIVE_INFINITY : Number(first);
        second = second == null ? Number.NEGATIVE_INFINITY : Number(second);
      }

      if (first < second) return sortDirection === "asc" ? -1 : 1;
      if (first > second) return sortDirection === "asc" ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = sortedData.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const completeCount = monthlyData.filter((month) => month.complete).length;

  const missingCount = monthlyData.filter(
    (month) => !month.importsAvailable && !month.exportsAvailable
  ).length;

  const incompleteCount = monthlyData.filter(
    (month) =>
      !month.complete &&
      (month.importsAvailable || month.exportsAvailable)
  ).length;

  function handleSort(key) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection(key === "period" ? "desc" : "desc");
    }

    setCurrentPage(1);
  }

  function handleFilterChange(value) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function exportCsv() {
    const headers = [
      "Month",
      "Imports (USD)",
      "Exports (USD)",
      "Trade Balance (USD)",
      "Total Trade (USD)",
      "Status",
    ];

    const rows = sortedData.map((month) => [
      month.period,
      month.imports ?? "",
      month.exports ?? "",
      month.tradeBalance ?? "",
      month.totalTrade ?? "",
      month.complete
        ? "Complete"
        : month.importsAvailable || month.exportsAvailable
          ? "Incomplete"
          : "No data",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "india-monthly-trade-flows.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-blue-600">
            MONTHLY DATA
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Monthly trade breakdown
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Detailed monthly imports, exports and trade balance.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          disabled={!sortedData.length || loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50/70 p-3">
          <p className="text-xs font-medium text-emerald-700">
            Complete months
          </p>
          <p className="mt-1 text-xl font-semibold text-emerald-800">
            {completeCount}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50/70 p-3">
          <p className="text-xs font-medium text-amber-700">
            Incomplete months
          </p>
          <p className="mt-1 text-xl font-semibold text-amber-800">
            {incompleteCount}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-600">
            Months without data
          </p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {missingCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm font-medium text-gray-700">
          Trade records
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({filteredData.length} months)
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="trade-table-status" className="sr-only">
            Filter trade records by data status
          </label>

          <select
            id="trade-table-status"
            value={statusFilter}
            onChange={(event) => handleFilterChange(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All months</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
            <option value="missing">No data</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="relative mt-4 overflow-x-auto rounded-xl border border-gray-100">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Loading trade records...
            </div>
          </div>
        )}

        <table className="w-full min-w-[850px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className={`inline-flex items-center gap-1.5 transition hover:text-blue-600 ${
                      column.align === "right" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {column.label}
                    <SortIcon
                      active={sortKey === column.key}
                      direction={sortDirection}
                    />
                  </button>
                </th>
              ))}

              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {!loading && paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No monthly records match this filter.
                </td>
              </tr>
            ) : (
              paginatedData.map((month) => (
                <tr
                  key={month.period}
                  className="transition hover:bg-gray-50/70"
                >
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900">
                    {month.label || month.period}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <AvailabilityValue
                      value={month.imports}
                      available={month.importsAvailable}
                    />
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <AvailabilityValue
                      value={month.exports}
                      available={month.exportsAvailable}
                    />
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    {month.complete ? (
                      <span
                        className={`font-semibold ${
                          month.tradeBalance < 0
                            ? "text-red-600"
                            : month.tradeBalance > 0
                              ? "text-emerald-600"
                              : "text-gray-800"
                        }`}
                      >
                        {formatCurrency(month.tradeBalance)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Unavailable
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-right font-medium text-gray-800">
                    {month.complete
                      ? formatCurrency(month.totalTrade)
                      : "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <StatusBadge month={month} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-gray-500">
          {sortedData.length === 0
            ? "No records"
            : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                safePage * PAGE_SIZE,
                sortedData.length
              )} of ${sortedData.length} months`}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="min-w-20 text-center text-xs font-medium text-gray-600">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safePage === totalPages}
            aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-5 text-gray-400">
        All values are in USD. Trade balance is calculated as exports minus
        imports. Missing observations are displayed as unavailable and are
        never treated as zero.
      </p>
    </section>
  );
}
