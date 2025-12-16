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
    <nav className="sticky top-0 z-50 w-full bg-[--color-background]/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between px-3 py-2 md:px-6">

        {/* Logo + Nav Links */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ONS Logistics Logo"
              width={60}
              height={60}
              priority
              className="h-[50px] w-[50px] md:h-[60px] md:w-[60px]"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium text-gray-700 transition hover:text-blue-600 ${
                  pathname === item.path
                    ? "font-semibold text-blue-600"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
