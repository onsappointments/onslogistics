"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NotificationBell from "./NotificationBell";
import { useEffect, useMemo, useState } from "react";

/* ---------------- MENU CONFIG ---------------- */

const ADMIN_MENU = [
  { name: "Search Clients", href: "/dashboard/admin", permission: "client:view" },
  { name: "View Requested Quotes", href: "/dashboard/admin/quotes", permission: "quote:view" },
  {
    name: "View Finalized Quotes",
    href: "/dashboard/admin/finalized-quotes",
    permission: "quote:view_finalized",
  },
  { name: "Create a Job", href: "/dashboard/admin/jobs/create", permission: "job:create" },
  { name: "New Jobs", href: "/dashboard/admin/jobs/new", permission: "job:view_new" },
  { name: "Active Jobs", href: "/dashboard/admin/jobs/active", permission: "job:view_active" },
  { name: "Couriers", href: "/dashboard/admin/reception/dispatch", permission: "couriers:view" },
  { name: "Audit Logs", href: "/dashboard/admin/audit", permission: "audit_logs:view" },

  { name: "KYC Verification", href: "/dashboard/admin/kyc?status=pending", permission: "kyc:view" },

  { name: "Create Admin", href: "/dashboard/admin/users/create", permission: "admin:create" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const permissions = session?.user?.permissions || [];
  const adminType = session?.user?.adminType || null;

  const isSuperAdmin = adminType === "super_admin";

  // ✅ super admin can always see approval bell too
  const canSeeApprovalBell =
    isSuperAdmin || permissions.includes("approvals:permission");

  // ✅ permission checks
  const canSeeKyc = isSuperAdmin || permissions.includes("kyc:view");

  // ✅ super admin sees everything; others only what they have permission for
  const visibleMenu = isSuperAdmin
    ? ADMIN_MENU
    : ADMIN_MENU.filter((item) => permissions.includes(item.permission));

  // ✅ FIX: active check for nested routes
  const isActive = (href) => {
    // ignore query params for active matching
    const cleanHref = href.split("?")[0];
    return pathname === cleanHref || pathname.startsWith(cleanHref + "/admin");
  };

  // ✅ pending badge count (only if can see KYC)
  const [pendingKyc, setPendingKyc] = useState(0);

  useEffect(() => {
    if (!canSeeKyc) return;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/kyc/pending-count", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        setPendingKyc(Number(data?.count || 0));
      } catch {
        // ignore
      }
    };

    fetchCount();
  }, [canSeeKyc]);

  return (
    <aside className="w-64 bg-white/80 border-r border-gray-200 shadow-md p-6 flex flex-col overflow-x-hidden shrink-0">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold text-gray-900">ONS Admin</div>
        {isSuperAdmin && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 font-semibold text-blue-700">
            Super Admin
          </span>
        )}
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1 flex-1">
        {visibleMenu.map((item) => {
          const active = isActive(item.href);
          const isKycItem = item.permission === "kyc:view";

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`px-4 py-3 rounded-xl font-medium  flex items-center justify-between active:scale-[0.98] transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <span>{item.name}</span>

              {/* ✅ badge only on KYC item */}
              {isKycItem && canSeeKyc && pendingKyc > 0 && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-red-100 text-red-700"
                  }`}
                >
                  {pendingKyc}
                </span>
              )}
            </Link>
          );
        })}

        {/* approvals bell */}
        {canSeeApprovalBell && <NotificationBell />}

        {/* fallback only for NON super admin */}
        {!isSuperAdmin && permissions.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">No menu access assigned</p>
        )}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition font-medium shadow-md"
      >
        Logout
      </button>
    </aside>
  );
}
