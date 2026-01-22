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

  // ✅ track hash for #support active state
  const [hash, setHash] = useState("");

  const isClient = useMemo(() => session?.user?.role === "client", [session]);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash || "");
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

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
      ...(hasJobs || checkingJobs
        ? [{ label: "My Jobs", path: "/dashboard/client/jobs", startsWith: true }]
        : []),
    ];
  }, [hasJobs, checkingJobs]);

  const isActive = (item) => {
    // hash-based active (Support)
    if (item.hash) {
      // active only when on dashboard page AND hash matches
      return pathname === "/dashboard/client" && hash === item.hash;
    }

    // startsWith-based active (Jobs + Profile)
    if (item.startsWith) {
      return pathname === item.path || pathname.startsWith(item.path + "/");
    }

    // exact match (Dashboard)
    if (item.exact) return pathname === item.path;

    return pathname === item.path;
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1d1d1f] font-['SF Pro Display']">
      {/* Sidebar */}
      <aside
        className="w-64 bg-white/70 backdrop-blur-2xl border-r border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between p-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-blue-600 mb-8">
            ONS Logistics
          </h1>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  isActive(item)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100/70 text-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700
          transition font-medium shadow-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
