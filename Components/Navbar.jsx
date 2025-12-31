"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Book Appointment", path: "/book-appointment" },
    { name: "Contact Us", path: "/contact" },
    { name: "Request A Quote", path: "/request-quote" },
    { name: "Toll Free No. 1800-890-7365", path: "tel:18008907365" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[--color-background]/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ONS Logistics Logo"
            width={48}
            height={48}
            priority
          />
          <span className="hidden sm:block font-semibold text-gray-900">
            ONS Logistics India Pvt. Ltd.
          </span>
        </Link>

        {/* Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.path.startsWith("tel:") ? (
              <a
                key={item.name}
                href={item.path}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm transition ${
                  pathname === item.path
                    ? "font-semibold text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
