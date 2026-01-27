"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminKycPageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const sp = useSearchParams();

  const tab = (sp.get("status") || "pending").toLowerCase();
  const activeTab = TABS.some((t) => t.key === tab) ? tab : "pending";

  const [loading, setLoading] = useState(false);
  const [kycs, setKycs] = useState([]);
  const [err, setErr] = useState("");

  const isAdmin = useMemo(() => session?.user?.role === "admin", [session]);

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !isAdmin) {
      router.push("/login");
    }
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) return;

    const fetchKycs = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/admin/kyc?status=${activeTab}`, {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErr(data?.error || "Failed to fetch KYC requests");
          setKycs([]);
          return;
        }
        setKycs(Array.isArray(data?.kycs) ? data.kycs : []);
      } catch (e) {
        console.error(e);
        setErr("Failed to fetch KYC requests");
        setKycs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKycs();
  }, [status, isAdmin, activeTab]);

  const badge = (s) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";
    if (s === "approved") return `${base} bg-green-100 text-green-700 border-green-200`;
    if (s === "pending") return `${base} bg-yellow-100 text-yellow-700 border-yellow-200`;
    if (s === "rejected") return `${base} bg-red-100 text-red-700 border-red-200`;
    return `${base} bg-gray-100 text-gray-700 border-gray-200`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-sm text-gray-600 mt-1">Review client documents and approve/reject.</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="text-sm font-semibold text-gray-900">
            {session?.user?.fullName || session?.user?.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => router.push(`/dashboard/admin/kyc?status=${t.key}`)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              activeTab === t.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{err}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-900">Requests</p>
          {loading && <p className="text-sm text-gray-500">Loading…</p>}
        </div>

        {!loading && kycs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-700 font-semibold">No {activeTab} requests.</p>
            <p className="text-sm text-gray-500 mt-1">You’re all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {kycs.map((k) => {
              const u = k.user || {};
              return (
                <Link
                  key={k._id}
                  href={`/dashboard/admin/kyc/${u._id}`}
                  className="block hover:bg-blue-50/40 transition"
                >
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{u.fullName || "Unknown User"}</p>
                      <p className="text-sm text-gray-600 truncate">{u.email}</p>
                      <p className="text-xs text-gray-500 truncate">{u.company || "-"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={badge(k.status)}>{k.status}</span>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {k.updatedAt ? new Date(k.updatedAt).toLocaleString() : ""}
                      </p>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
