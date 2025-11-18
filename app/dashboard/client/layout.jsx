"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "My Shipments", path: "/dashboard/client" },
    { label: "Upload Documents", path: "/dashboard/client#upload" },
    { label: "Support", path: "/dashboard/client#support" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] text-[#1d1d1f] font-['SF Pro Display']">
      {/* Sidebar */}
      <aside
        className="w-64 bg-white/70 backdrop-blur-2xl border-r border-white/40 
        shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between p-6"
      >
        {/* Logo / Title */}
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
                  pathname === item.path
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
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
