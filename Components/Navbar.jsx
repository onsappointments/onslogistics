"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const services = [
    { name: "Freight Forwarding", href: "/services#freight" },
    { name: "Road Transportation", href: "/services#road" },
    { name: "Sea Cargo", href: "/services#sea" },
    { name: "Air Cargo", href: "/services#air" },
    { name: "Licensing", href: "/services#licensing" },
    { name: "Export / Import Consultation", href: "/services#export" },
    { name: "Custom Clearance", href: "/services#custom" },
  ];

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Book Appointment", path: "/book-appointment" },
    { label: "Contact Us", path: "/contact" },
    { label: "Request A Quote", path: "/request-quote" },
    { label: "Toll Free No. 1800-890-7365", path: "tel:18008907365" },
  ];

  const switchLanguage = (lang) => {
    const select = document.querySelector("select.goog-te-combo");
    if (!select) return;

    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  };

  return (
    <nav
      id="site-navbar"
      className="fixed top-0 left-0 z-50 w-full bg-[--color-background]/90 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-[1440px] mx-auto h-[64px] lg:h-[72px] px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="ONS Logistics Logo" width={44} height={44} />
          <span className="hidden sm:block text-2xl font-semibold text-black">
            ONS
          </span>
        </Link>

        {/* Nav Links (desktop & tablet only) */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-6 whitespace-nowrap">

          {/* Home */}
          <li>
            <Link
              href="/"
              className={`text-sm lg:text-md transition ${
                pathname === "/"
                  ? "font-semibold text-blue-600"
                  : "text-black font-semibold hover:text-blue-600"
              }`}
            >
              Home
            </Link>
          </li>

          {/* Services Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link
              href="/services"
              className={`inline-flex items-center gap-1 text-sm lg:text-md transition ${
                pathname.startsWith("/services")
                  ? "font-semibold text-blue-600"
                  : "text-black font-semibold hover:text-blue-600"
              }`}
            >
              Services
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            <div
              className={`absolute left-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-blue-600/20 overflow-hidden transition-all duration-200 z-50 ${
                isServicesOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
              }`}
            >
              {services.map((service, idx) => (
                <Link
                  key={idx}
                  href={service.href}
                  className="block px-4 py-2.5 text-sm text-black hover:bg-blue-600 hover:text-white"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </li>

          {/* Other Nav Items */}
          {navItems
            .filter((item) => item.label !== "Home" && item.label !== "Services")
            .map((item) =>
              item.path.startsWith("tel:") ? (
                <li key={item.label}>
                  <a
                    href={item.path}
                    className="text-sm lg:text-md text-black font-semibold hover:text-blue-600"
                  >
                    {item.label}
                  </a>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={`text-sm lg:text-md transition ${
                      pathname === item.path
                        ? "font-semibold text-blue-600"
                        : "text-black font-semibold hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="text-sm lg:text-md text-black font-semibold hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm lg:text-md text-white hover:bg-blue-700"
          >
            Register
          </Link>

          {/* Language dropdown only on large screens */}
          <select
            className="hidden lg:block ml-3 border border-gray-300 rounded px-3 py-1 text-sm"
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              switchLanguage(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="hi">Hindi</option>
            <option value="zh-CN">Chinese</option>
            <option value="ru">Russian</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
