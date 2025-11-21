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
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[--color-background] bg-opacity-90 backdrop-blur-md shadow-sm z-50">
      {/* Reduced left/right padding */}
      <div className="w-full mx-auto px-3 md:px-6 py-2 flex justify-between items-center">

        {/* Logo + Nav */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ONS Logistics Logo"
              width={200}
              height={200}
              className="w-[50px] h-[50px] md:w-[60px] md:h-[60px]"
            />
          </Link>

          {/* ✅ Replace this part only */}
          <div className="hidden md:flex gap-4">
            {navItems.map((item) =>
              item.path.startsWith("/#") ? (
                // ✅ In-page scroll links (like About Us)
                <a
                  key={item.name}
                  href={item.path.replace("/", "")} // "/#about" → "#about"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {item.name}
                </a>
              ) : (
                // ✅ Normal route links
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-gray-700 hover:text-blue-600 transition ${
                    pathname === item.path ? "font-semibold text-blue-600" : ""
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Login / Register */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition font-medium text-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
