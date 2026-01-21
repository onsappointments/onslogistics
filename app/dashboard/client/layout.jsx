"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [hasJobs, setHasJobs] = useState(true); // default true to avoid flicker
  const [checkingJobs, setCheckingJobs] = useState(false);

  const isClient = useMemo(() => session?.user?.role === "client", [session]);

  // Check if client has any jobs (ongoing OR any—choose what you want)
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    const check = async () => {
      setCheckingJobs(true);
      try {
        // If you want "any jobs ever", add ?scope=all and implement it in API
        const res = await fetch("/api/client/jobs", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // Don’t hide jobs button on error—keep it visible
          setHasJobs(true);
          return;
        }

        const jobs = Array.isArray(data.jobs) ? data.jobs : [];
        setHasJobs(jobs.length > 0);
      } catch (e) {
        // On network errors, keep it visible
        setHasJobs(true);
      } finally {
        setCheckingJobs(false);
      }
    };

    check();
  }, [status, isClient]);

  const menuItems = useMemo(() => {
    const items = [
      { label: "Dashboard", path: "/dashboard/client" },
      // show only if jobs exist (or while checking to prevent jumpy UI)
      ...(hasJobs || checkingJobs
        ? [{ label: "My Jobs", path: "/dashboard/client/jobs" }]
        : []),
      { label: "Support", path: "/dashboard/client#support" },
      { label: "My Profile", path: "/dashboard/client/profile" },
    ];
    return items;
  }, [hasJobs, checkingJobs]);

  const isActive = (path) => {
    const basePath = path.split("#")[0];
    if (pathname === basePath) return path.includes("#");
    return pathname === path;
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
                  isActive(item.path)
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
