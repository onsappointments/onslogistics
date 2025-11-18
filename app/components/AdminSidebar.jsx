"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Search Clients", href: "/dashboard/admin" },
    { name: "Shipments", href: "/dashboard/admin/shipments" },
    { name: "Documents", href: "/dashboard/admin/documents" },
    { name: "Support", href: "/dashboard/admin/support" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white/80 border-r border-gray-200 shadow-md p-6 space-y-6">
      <div className="text-xl font-semibold text-gray-900">ONS Admin</div>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-3 rounded-xl font-medium transition ${
              pathname === link.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
