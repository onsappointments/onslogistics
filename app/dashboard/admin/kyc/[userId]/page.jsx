"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminKycDetail({ params }) {
  const { userId } = React.use(params);

  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = useMemo(() => session?.user?.role === "admin", [session]);

  const [loading, setLoading] = useState(false);
  const [kyc, setKyc] = useState(null);
  const [err, setErr] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !isAdmin) router.push("/login");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) return;

    const fetchOne = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/admin/kyc/${userId}`, {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErr(data?.error || "Failed to fetch KYC");
          setKyc(null);
          return;
        }
        setKyc(data?.kyc || null);
      } catch (e) {
        console.error(e);
        setErr("Failed to fetch KYC");
        setKyc(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [status, isAdmin, userId]);

  const docByType = (t) => (kyc?.documents || []).find((d) => d.type === t);

  const preview = (doc) => {
    if (!doc?.fileUrl) return null;
    const url = doc.fileUrl;
    const isPdf = url.toLowerCase().endsWith(".pdf");

    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">{doc.type}</p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Open
          </a>
        </div>

        <div className="p-4">
          {isPdf ? (
            <iframe title={doc.type} src={url} className="w-full h-[420px] rounded-xl border border-gray-200" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={doc.type} className="w-full max-h-[520px] object-contain rounded-xl border border-gray-200" />
          )}
        </div>
      </div>
    );
  };

  const approve = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/kyc/${userId}/approve`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "Failed to approve");
        return;
      }
      router.push("/dashboard/admin/kyc?status=pending");
    } catch (e) {
      console.error(e);
      setErr("Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    if (actionLoading) return;

    const r = reason.trim();
    if (!r) {
      setErr("Rejection reason is required.");
      return;
    }

    setActionLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/kyc/${userId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: r }),
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "Failed to reject");
        return;
      }
      router.push("/dashboard/admin/kyc?status=pending");
    } catch (e) {
      console.error(e);
      setErr("Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <p className="text-center mt-20">Loading KYC...</p>;
  }

  if (err && !kyc) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <p className="text-red-700 font-semibold">{err}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const user = kyc?.user || {};
  const statusBadge =
    kyc?.status === "approved"
      ? "bg-green-100 text-green-700 border-green-200"
      : kyc?.status === "pending"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : kyc?.status === "rejected"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{user.fullName || "Client"}</h1>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            <p className="text-sm text-gray-500 truncate">{user.company || "-"}</p>

            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge}`}>
                {kyc?.status}
              </span>
              {kyc?.rejectionReason && (
                <p className="mt-2 text-sm text-red-700">
                  Reason: <span className="font-semibold">{kyc.rejectionReason}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold"
            >
              Back
            </button>

            <button
              onClick={approve}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
            >
              {actionLoading ? "Working..." : "Approve"}
            </button>
          </div>
        </div>

        {/* Reject box */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-4">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Rejection reason (required to reject)"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <button
            onClick={reject}
            disabled={actionLoading}
            className="md:col-span-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
          >
            Reject
          </button>
        </div>

        {err && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{err}</p>
          </div>
        )}
      </div>

      {/* Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {preview(docByType("aadhaar_front"))}
        {preview(docByType("aadhaar_back"))}
        {preview(docByType("pan"))}
      </div>
    </div>
  );
}
