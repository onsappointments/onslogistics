"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  { key: "24h", label: "Last 24 Hours" },
  { key: "48h", label: "Last 48 Hours" },
  { key: "7d", label: "Last 7 Days" },
];

export default function AdminQuotesPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState("24h");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchQuotes = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/quotes?filter=${filter}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(data?.error || "Failed to fetch quotes");
        setQuotes([]);
        return;
      }

      setQuotes(Array.isArray(data) ? data : (data?.quotes || []));
    } catch (e) {
      console.error(e);
      setErr("Failed to fetch quotes");
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const approveQuote = async (id) => {
    try {
      const res = await fetch("/api/admin/quotes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "Failed to approve quote");
        return;
      }

      fetchQuotes();
    } catch (e) {
      console.error(e);
      setErr("Failed to approve quote");
    }
  };

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const counts = useMemo(() => {
    const pending = quotes.filter((q) => q.status === "pending").length;
    const approved = quotes.filter((q) => q.status === "approved").length;
    return { pending, approved, total: quotes.length };
  }, [quotes]);

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-8">
      {/* Header Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Client Quotes</h1>
            <p className="text-gray-600 mt-2">
              Review recent client quote requests and approve them quickly.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Pill label={`Pending: ${counts.pending}`} tone="warn" />
            </div>
          </div>

          <button
            type="button"
            onClick={fetchQuotes}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner />
                Refreshing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 8a8 8 0 00-14.828-2M4 16a8 8 0 0014.828 2" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Segmented Filters */}
        <div className="mt-6 w-full rounded-2xl border border-gray-200 bg-white p-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 min-w-max">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  filter === f.key ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {err && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-700 text-sm font-medium">{err}</p>
          </div>
        )}
      </section>

      {/* List */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/40 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Quotes</h2>
            <p className="text-sm text-gray-600 mt-1">Click a row to open quote details.</p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Spinner />
              <span className="text-sm font-semibold">Loading…</span>
            </div>
          )}
        </div>

        {!loading && quotes.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">No quotes found</p>
            <p className="text-sm text-gray-600 mt-1">Try a different time filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
          {quotes.map((q) => {
  const fullName =
    [q.firstName, q.lastName].filter(Boolean).join(" ") ||
    q.fullName ||
    q.name ||
    "Unknown Client";

  return (
    <div
      key={q._id}
      onClick={() => router.push(`/dashboard/admin/quotes/${q._id}`)}
      className="px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer hover:bg-blue-50/30 transition"
    >
      {/* Left */}
      <div className="min-w-0">
        <p className="font-bold text-gray-900 truncate">{fullName}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <IconMail />
            <span className="truncate">{q.email || "—"}</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <IconClock />
            {q.createdAt ? new Date(q.createdAt).toLocaleString() : "—"}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 justify-end">
        <StatusBadge status={q.status} />
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
})}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Small UI bits ---------- */

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize";
  if (s === "approved") return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>approved</span>;
  if (s === "pending") return <span className={`${base} bg-yellow-100 text-yellow-700 border-yellow-200`}>pending</span>;
  return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>{s}</span>;
}

function Pill({ label, tone = "neutral" }) {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";
  if (tone === "ok") return <span className={`${base} bg-green-50 text-green-700 border-green-200`}>{label}</span>;
  if (tone === "warn") return <span className={`${base} bg-yellow-50 text-yellow-700 border-yellow-200`}>{label}</span>;
  return <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>{label}</span>;
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
