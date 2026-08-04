"use client";
import { useState } from "react";

export default function CompanyHistoryPanel({
  quotes = [],
  loading = false,
  onUseQuote,
}) {

  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="mt-4 rounded-xl border bg-white p-4">
        Loading previous quotations...
      </div>
    );
  }

  if (quotes.length === 0) {
    return null;
  }

  const filteredQuotes = quotes.filter((quote) => {
  const value = search.toLowerCase();

  return (
    quote.quoteNo?.toLowerCase().includes(value) ||
    quote.item?.toLowerCase().includes(value) ||
    quote.fromCountry?.toLowerCase().includes(value) ||
    quote.toCountry?.toLowerCase().includes(value) ||
    quote.fromCity?.toLowerCase().includes(value) ||
    quote.toCity?.toLowerCase().includes(value) ||
    quote.modeOfTransport?.toLowerCase().includes(value) ||
    quote.containerType?.toLowerCase().includes(value)
  );
});

  return (
    <div className="mt-4 rounded-xl border bg-white">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between border-b px-4 py-3 hover:bg-gray-50"  
      >
        <div className="font-semibold text-gray-900">
          📜 Previous Quotations ({quotes.length})
        </div>

        <div className="text-xl">
          {expanded ? "▲" : "▼"}
        </div>
      </button>
        
      {expanded && (
        
      <div className="divide-y">
         <div className="border-b p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by commodity, route, quote no..."
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {quotes.map((quote) => (
          <div
            key={quote._id}
            className="flex items-center justify-between px-4 py-4"
          >
            <div>
              <div className="font-medium">
                {quote.quoteNo}
              </div>

              <div className="mt-1 text-sm text-gray-600">
                {quote.item}
              </div>

              <div className="mt-1 text-sm text-gray-500">
                {quote.fromCountry} → {quote.toCountry}
              </div>

              <div className="mt-1 text-xs text-gray-400">
                {quote.modeOfTransport}
                {" • "}
                {quote.containerType || "N/A"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUseQuote?.(quote)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Use Quote
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}