"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isContainersOpen, setIsContainersOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileContainersOpen, setIsMobileContainersOpen] = useState(false);

  // One timer ref per dropdown — cleared on every enter, fired on leave
  const servicesTimer = useRef(null);
  const containersTimer = useRef(null);

  const CLOSE_DELAY = 280; // ms — long enough to cross the gap comfortably

  useEffect(() => {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileContainersOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // ── Dropdown helpers ──────────────────────────────────────────────────────
  const handleServicesEnter = () => {
    clearTimeout(servicesTimer.current);
    setIsServicesOpen(true);
  };
  const handleServicesLeave = () => {
    servicesTimer.current = setTimeout(
      () => setIsServicesOpen(false),
      CLOSE_DELAY,
    );
  };

  const handleContainersEnter = () => {
    clearTimeout(containersTimer.current);
    setIsContainersOpen(true);
  };
  const handleContainersLeave = () => {
    containersTimer.current = setTimeout(
      () => setIsContainersOpen(false),
      CLOSE_DELAY,
    );
  };

  // ── Data ─────────────────────────────────────────────────────────────────
  const services = [
    { name: "Freight Forwarding", href: "/services#freight" },
    { name: "Road Transportation", href: "/services#road" },
    { name: "Sea Cargo", href: "/services#sea" },
    { name: "Air Cargo", href: "/services#air" },
    { name: "Licensing", href: "/services#licensing" },
    { name: "Export / Import Consultation", href: "/services#export" },
    { name: "Custom Clearance", href: "/services#custom" },
  ];

  const containerLinks = [
    { name: "Standard Containers", href: "/container-dimensions/standard" },
    { name: "Special Containers", href: "/container-dimensions/special" },
  ];

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Book Appointment", path: "/book-appointment" },
    { label: "Contact Us", path: "/contact" },
    { label: "Request A Quote", path: "/request-quote" },
    { label: "Track Your Shipment", path: "/tracking" },
  ];

  const switchLanguage = (lang) => {
    setSelectedLang(lang);
    try {
      const select = document.querySelector("select.goog-te-combo");
      if (!select) return;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } catch (e) {
      console.warn("Language switch failed:", e);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .nav-link {
          transition: color 0.2s ease;
        }

        .dropdown-animate {
          animation: slideDown 0.18s ease-out;
        }

        .service-item {
          transition:
            background 0.15s ease,
            color 0.15s ease,
            padding-left 0.15s ease;
        }
        .service-item:hover {
          padding-left: 20px;
        }

        .btn-shimmer {
          position: relative;
          overflow: hidden;
          transition:
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.15s ease;
        }
        .btn-shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent
          );
          transition: left 0.45s ease;
        }
        .btn-shimmer:hover::before {
          left: 100%;
        }
        .btn-shimmer:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }

        .logo-wrap {
          transition: transform 0.25s ease;
        }
        .logo-wrap:hover {
          transform: scale(1.04);
        }

        .lang-select {
          transition:
            box-shadow 0.2s ease,
            border-color 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          padding-right: 28px !important;
        }
        .lang-select:hover {
          border-color: #2563eb;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        }
        .lang-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .mobile-overlay {
          animation: fadeIn 0.2s ease;
        }
        .mobile-drawer {
          animation: slideDown 0.25s ease-out;
        }

        .phone-pill {
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }
        .phone-pill:hover {
          background: #1d4ed8;
        }

        /* Invisible bridge fills the gap between nav trigger and dropdown panel
           so the mouse never "leaves" the hover zone while crossing it */
        .dropdown-bridge {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 8px; /* matches pt-2 = 8px gap */
          background: transparent;
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          DESKTOP NAVBAR
      ══════════════════════════════════════════════ */}
      <nav
        id="site-navbar"
        className="fixed top-0 left-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-[1440px] mx-auto h-16 lg:h-[72px] px-4 sm:px-6 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 logo-wrap">
            <Image
              src="/logo.png"
              alt="ONS Logistics Logo"
              width={44}
              height={44}
              priority
            />
            <span className="hidden sm:block text-2xl font-semibold text-black hover:text-blue-600 transition-colors duration-300">
              ONS
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-3 lg:gap-5 whitespace-nowrap flex-1 justify-center">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={`nav-link text-sm font-semibold ${pathname === "/" ? "text-blue-600" : "text-gray-800 hover:text-blue-600"}`}
              >
                Home
              </Link>
            </li>

            {/* ── Services dropdown ──
                Key fix: handlers ONLY on the <li> wrapper.
                The dropdown div is a DOM child of the li, so mouse events
                inside the dropdown do NOT trigger the li's onMouseLeave.
                An invisible .dropdown-bridge div covers the 8px gap so the
                mouse never leaves the li while crossing from link → panel. */}
            <li
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <Link
                href="/services"
                className={`nav-link inline-flex items-center gap-1 text-sm font-semibold ${
                  pathname.startsWith("/services")
                    ? "text-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </Link>

              {/* Invisible bridge — keeps hover alive across the gap */}
              {isServicesOpen && <div className="dropdown-bridge" />}

              {isServicesOpen && (
                <div className="dropdown-animate absolute left-0 top-full pt-2 w-64 z-[100]">
                  <div className="bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden">
                    {services.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="service-item block px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-600 hover:text-white border-b border-gray-50 last:border-0"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* ── Container Dimensions dropdown ── same fix */}
            <li
              className="relative"
              onMouseEnter={handleContainersEnter}
              onMouseLeave={handleContainersLeave}
            >
              <button
                className={`nav-link inline-flex items-center gap-1 text-sm font-semibold bg-transparent border-0 cursor-pointer ${
                  pathname.startsWith("/container-dimensions")
                    ? "text-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                Container Dimensions
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isContainersOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isContainersOpen && <div className="dropdown-bridge" />}

              {isContainersOpen && (
                <div className="dropdown-animate absolute left-0 top-full pt-2 w-52 z-[100]">
                  <div className="bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden">
                    {containerLinks.map((c, i) => (
                      <Link
                        key={i}
                        href={c.href}
                        onClick={() => setIsContainersOpen(false)}
                        className="service-item block px-5 py-3 text-sm text-gray-700 hover:bg-blue-600 hover:text-white border-b border-gray-50 last:border-0"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* Other nav items */}
            {navItems
              .filter((item) => item.label !== "Home")
              .map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={`nav-link text-sm font-semibold ${pathname === item.path ? "text-blue-600" : "text-gray-800 hover:text-blue-600"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

            {/* Toll Free pill */}
            <li>
              <a
                href="tel:18008907365"
                className="phone-pill inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <Phone className="h-3 w-3" />
                1800-890-7365
              </a>
            </li>
          </ul>

          {/* Right section */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <Link
              href="/login"
              className="hidden md:block text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-shimmer hidden md:block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Register
            </Link>
            <select
              className="lang-select hidden lg:block border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 cursor-pointer bg-white"
              value={selectedLang}
              onChange={(e) => switchLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="hi">Hindi</option>
              <option value="zh-CN">Chinese</option>
              <option value="ru">Russian</option>
              <option value="ar">Arabic</option>
            </select>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          MOBILE MENU
      ══════════════════════════════════════════════ */}
      {isMobileOpen && (
        <>
          <div
            className="mobile-overlay fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="mobile-drawer fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-xl md:hidden max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/"
                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-50"}`}
              >
                Home
              </Link>

              {/* Services accordion */}
              <div>
                <button
                  onClick={() => setIsMobileServicesOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isMobileServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMobileServicesOpen && (
                  <div className="mt-1 ml-4 border-l-2 border-blue-100 pl-3 space-y-0.5">
                    {services.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Container Dimensions accordion */}
              <div>
                <button
                  onClick={() => setIsMobileContainersOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/container-dimensions")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Container Dimensions
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isMobileContainersOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMobileContainersOpen && (
                  <div className="mt-1 ml-4 border-l-2 border-blue-100 pl-3 space-y-0.5">
                    {containerLinks.map((c, i) => (
                      <Link
                        key={i}
                        href={c.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === c.href
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navItems
                .filter((item) => item.label !== "Home")
                .map((item) => (
                  <Link
                    key={item.label}
                    href={item.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

              <div className="h-px bg-gray-100 my-2" />

              <a
                href="tel:18008907365"
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Toll Free: 1800-890-7365
              </a>

              <div className="flex gap-3 px-4 pt-2 pb-3">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>

              <div className="px-4 pb-4">
                <select
                  className="lang-select w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
                  value={selectedLang}
                  onChange={(e) => switchLanguage(e.target.value)}
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
          </div>
        </>
      )}
    </>
  );
}
