"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NotificationBell from "./NotificationBell";




/* ---------------- MENU CONFIG ---------------- */

const ADMIN_MENU = [
  {
    name: "Search Clients",
    href: "/dashboard/admin",
    permission: "client:view",
  },
  {
    name: "View Quotes",
    href: "/dashboard/admin/quotes",
    permission: "quote:view",
  },
  {
    name: "View Finalized Quotes",
    href: "/dashboard/admin/finalized-quotes",
    permission: "quote:view_finalized",
  },
  {
    name: "Create a Job",
    href: "/dashboard/admin/jobs/create",
    permission: "job:create",
  },
  {
    name: "New Jobs",
    href: "/dashboard/admin/jobs/new",
    permission: "job:view_new",
  },
  {
    name: "Active Jobs",
    href: "/dashboard/admin/jobs/active",
    permission: "job:view_active",
  },
  {
    name: "Audit Logs",
    href: "/dashboard/admin/audit",
    permission: "audit_logs:view",
  },
  {
    name: "Create Admin",
    href: "/dashboard/admin/users/create",
    permission: "admin:create",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const permissions = session?.user?.permissions || [];
  const adminType = session?.user?.adminType || null;
  return (
    <aside className="w-64  bg-white/80 border-r border-gray-200 shadow-md p-6 flex flex-col">
      {/* HEADER */}
      <div className="text-xl font-semibold text-gray-900 mb-6">
        ONS Admin
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 flex-1">
        {ADMIN_MENU.filter((item) =>
          permissions.includes(item.permission)
        ).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-3 rounded-xl font-medium transition ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {
          adminType === "super_admin" && (
          <NotificationBell session={session} />
          )
        }

        {/* Fallback if no permissions */}
        {permissions.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">
            No menu access assigned
          </p>
        )}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className=" bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition font-medium shadow-md"
      >
        Logout
      </button>
    </aside>
  );
}
