"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [hasJobs, setHasJobs] = useState(true);
  const [checkingJobs, setCheckingJobs] = useState(false);

  // ✅ hash active state
  const [hash, setHash] = useState("");

  const isClient = useMemo(() => session?.user?.role === "client", [session]);

  // ✅ KYC state (sidebar)
  const [kycLoading, setKycLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState("not_submitted"); // not_submitted | pending | approved | rejected

  const kycApproved = kycStatus === "approved";

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash || "");
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // ✅ fetch KYC status for sidebar badge + locks
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    const fetchKyc = async () => {
      setKycLoading(true);
      try {
        const res = await fetch("/api/kyc/status", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setKycStatus("not_submitted");
          return;
        }
        setKycStatus(data?.status || "not_submitted");
      } catch {
        setKycStatus("not_submitted");
      } finally {
        setKycLoading(false);
      }
    };

    fetchKyc();
  }, [status, isClient]);

  // jobs check (your existing)
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    const check = async () => {
      setCheckingJobs(true);
      try {
        const res = await fetch("/api/client/jobs", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setHasJobs(true);
          return;
        }

        const jobs = Array.isArray(data.jobs) ? data.jobs : [];
        setHasJobs(jobs.length > 0);
      } catch {
        setHasJobs(true);
      } finally {
        setCheckingJobs(false);
      }
    };

    check();
  }, [status, isClient]);

  const menuItems = useMemo(() => {
    return [
      { label: "Dashboard", path: "/dashboard/client", exact: true },

      // ✅ KYC shortcut (hash link)
      { label: "ID Verification", path: "/dashboard/client#kyc", hash: "#kyc" },

      ...(hasJobs || checkingJobs
        ? [
            {
              label: "My Jobs",
              path: "/dashboard/client/jobs",
              startsWith: true,
              // ✅ lock until KYC approved (soft lock)
              locked: !kycApproved,
            },
          ]
        : []),
    ];
  }, [hasJobs, checkingJobs, kycApproved]);

  const isActive = (item) => {
    if (item.hash) {
      return pathname === "/dashboard/client" && hash === item.hash;
    }
    if (item.startsWith) {
      return pathname === item.path || pathname.startsWith(item.path + "/");
    }
    if (item.exact) return pathname === item.path;
    return pathname === item.path;
  };

  const kycBadge = () => {
    if (kycLoading) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Checking ID…
        </span>
      );
    }

    if (kycStatus === "approved") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          ID Verified
        </span>
      );
    }

    if (kycStatus === "pending") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          Under Review
        </span>
      );
    }

    // rejected or not_submitted
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Action Needed
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1d1d1f] font-['SF Pro Display']">
      {/* Sidebar */}
      <aside
        className="w-64 bg-white/70 backdrop-blur-2xl border-r border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between p-6"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-8">
            <h1 className="text-2xl font-semibold text-blue-600">ONS Logistics</h1>
          </div>

          {/* ✅ KYC badge block */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-2">VERIFICATION</p>
            {kycBadge()}
          </div>

          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const active = isActive(item);
              const locked = item.locked;

              // If locked, prevent navigation (soft lock)
              if (locked) {
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      // if not on dashboard, take them to dashboard KYC
                      window.location.href = "/dashboard/client#kyc";
                    }}
                    className={`text-left px-4 py-2 rounded-xl text-md font-medium transition flex items-center justify-between
                      ${active ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}
                    `}
                    title="Complete ID Verification to unlock"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 border border-gray-200">
                      Locked
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-xl text-md font-medium transition
                    ${active ? "bg-blue-600 text-white" : "hover:bg-blue-100/70 text-gray-800"}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-8 bg-blue-600 text-white w-full py-2 rounded-full hover:bg-blue-700
            transition font-medium shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
