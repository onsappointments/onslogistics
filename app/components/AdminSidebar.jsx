"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();


  const links = [
    { name: "Search Clients", href: "/dashboard/admin" },
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
        <Link href="/dashboard/admin/quotes">
  <button className="w-full my-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
    View Quotes
  </button>
</Link>
<Link href="/dashboard/admin/jobs/new">
  <button className="w-full my-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
    New Jobs 
  </button>
</Link>
<Link href="/dashboard/admin/jobs/active">
  <button className="w-full my-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
    Active Jobs 
  </button>
</Link>
      </nav>
       <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 
          transition font-medium shadow-md"
        >
          Logout
        </button>
    </aside>
  );
}
