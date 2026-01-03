"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [gtReady, setGtReady] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Book Appointment", path: "/book-appointment" },
    { label: "Contact Us", path: "/contact" },
    { label: "Request A Quote", path: "/request-quote" },
    { label: "Toll Free No. 1800-890-7365", path: "tel:18008907365" },
  ];

  /* ---------------- Google Translate Ready ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const select = document.querySelector("select.goog-te-combo");
      if (select) {
        setGtReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- NAVBAR DROP FIX ---------------- */
  useEffect(() => {
    const navbar = document.getElementById("site-navbar");
    if (!navbar) return;

    const updateNavbarPosition = () => {
      const isTranslated =
        document.documentElement.classList.contains("translated-ltr") ||
        document.documentElement.classList.contains("translated-rtl");

      navbar.style.transform = isTranslated
        ? "translateY(0px)"
        : "translateY(0px)";
    };

    updateNavbarPosition();

    const observer = new MutationObserver(updateNavbarPosition);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ---------------- Language Switch (UNCHANGED) ---------------- */
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
      className="fixed top-0 left-0 z-50 w-full bg-[--color-background]/90 backdrop-blur-md border-b border-gray-200 transition-transform duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ONS Logistics Logo" width={48} height={48} />
          <span className="hidden sm:block font-semibold text-gray-900">
            ONS Logistics
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.path.startsWith("tel:") ? (
              <a key={item.label} href={item.path} className="text-sm text-gray-700 hover:text-blue-600">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.path}
                className={`text-sm transition ${
                  pathname === item.path
                    ? "font-semibold text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Right */}
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

          {/* Language Dropdown */}
          <select
            className="ml-3 border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100"
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
          </select>
        </div>
      </div>
    </nav>
  );
}
