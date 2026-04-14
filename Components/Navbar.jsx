"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Phone, Globe } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isContainersOpen, setIsContainersOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileContainersOpen, setIsMobileContainersOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const servicesTimer = useRef(null);
  const containersTimer = useRef(null);
  const moreTimer = useRef(null);
  const CLOSE_DELAY = 250;

  useEffect(() => {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileContainersOpen(false);
    setIsMobileMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const makeHandlers = (setOpen, timer) => ({
    onMouseEnter: () => {
      clearTimeout(timer.current);
      setOpen(true);
    },
    onMouseLeave: () => {
      timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
    },
  });

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

  // Primary nav — visible on desktop
  const primaryNav = [
    { label: "Book Appointment", path: "/book-appointment" },
    { label: "Track Shipment", path: "/tracking" },
    { label: "Request Quote", path: "/request-quote" },
  ];

  // Secondary nav — tucked into "More" dropdown
  const moreNav = [
    { label: "FAQ", path: "/faq" },
    { label: "Contact Us", path: "/contact" },
  ];

  const allMobileNav = [...primaryNav, ...moreNav];

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

  const langOptions = [
    { value: "en", label: "EN" },
    { value: "hi", label: "HI" },
    { value: "es", label: "ES" },
    { value: "zh-CN", label: "ZH" },
    { value: "ru", label: "RU" },
    { value: "ar", label: "AR" },
  ];

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
        .dropdown-animate {
          animation: slideDown 0.16s ease-out;
        }
        .nav-link {
          transition: color 0.18s ease;
        }
        .service-item {
          transition:
            background 0.12s ease,
            color 0.12s ease,
            padding-left 0.12s ease;
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
          transition: left 0.4s ease;
        }
        .btn-shimmer:hover::before {
          left: 100%;
        }
        .btn-shimmer:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
        }
        .logo-wrap {
          transition: transform 0.22s ease;
        }
        .logo-wrap:hover {
          transform: scale(1.04);
        }
        .dropdown-bridge {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 8px;
          background: transparent;
        }
        .mobile-overlay {
          animation: fadeIn 0.18s ease;
        }
        .mobile-drawer {
          animation: slideDown 0.22s ease-out;
        }
      `}</style>

      <nav
        id="site-navbar"
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b border-gray-100"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100"
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-[64px] px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 logo-wrap">
            <Image
              src="/logo.png"
              alt="ONS Logistics"
              width={38}
              height={38}
              priority
            />
            <span className="hidden sm:block text-xl font-bold text-gray-900 tracking-tight">
              ONS <span className="text-blue-600">Logistics</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <ul className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={`nav-link px-3 py-1.5 rounded-lg text-sm font-semibold ${pathname === "/" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Home
              </Link>
            </li>

            {/* Services */}
            <li
              className="relative"
              {...makeHandlers(setIsServicesOpen, servicesTimer)}
            >
              <Link
                href="/services"
                className={`nav-link inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${pathname.startsWith("/services") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </Link>
              {isServicesOpen && <div className="dropdown-bridge" />}
              {isServicesOpen && (
                <div className="dropdown-animate absolute left-0 top-full pt-2 w-60 z-[100]">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1">
                    {services.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="service-item block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* Container Dimensions */}
            <li
              className="relative"
              {...makeHandlers(setIsContainersOpen, containersTimer)}
            >
              <button
                className={`nav-link inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-transparent border-0 cursor-pointer ${pathname.startsWith("/container-dimensions") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Containers
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isContainersOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isContainersOpen && <div className="dropdown-bridge" />}
              {isContainersOpen && (
                <div className="dropdown-animate absolute left-0 top-full pt-2 w-52 z-[100]">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1">
                    {containerLinks.map((c, i) => (
                      <Link
                        key={i}
                        href={c.href}
                        onClick={() => setIsContainersOpen(false)}
                        className="service-item block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* Primary nav items */}
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.path}
                  className={`nav-link px-3 py-1.5 rounded-lg text-sm font-semibold ${pathname === item.path ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* More dropdown */}
            <li
              className="relative"
              {...makeHandlers(setIsMoreOpen, moreTimer)}
            >
              <button
                className={`nav-link inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-transparent border-0 cursor-pointer ${moreNav.some((i) => i.path === pathname) ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                More
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMoreOpen && <div className="dropdown-bridge" />}
              {isMoreOpen && (
                <div className="dropdown-animate absolute right-0 top-full pt-2 w-44 z-[100]">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1">
                    {moreNav.map((item, i) => (
                      <Link
                        key={i}
                        href={item.path}
                        onClick={() => setIsMoreOpen(false)}
                        className="service-item block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          </ul>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Toll-free — desktop only */}
            <a
              href="tel:18008907365"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Phone className="h-3 w-3" />
              1800-890-7365
            </a>

            <div className="hidden xl:block w-px h-4 bg-gray-200" />

            {/* Language picker — icon + select */}
            <div className="hidden lg:flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={selectedLang}
                onChange={(e) => switchLanguage(e.target.value)}
                className="text-xs font-semibold text-gray-600 bg-transparent border-0 cursor-pointer focus:outline-none pr-1"
              >
                {langOptions.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden lg:block w-px h-4 bg-gray-200" />

            {/* Login + Register */}
            <Link
              href="/login"
              className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-shimmer hidden md:block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
            className="mobile-overlay fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="mobile-drawer fixed top-[64px] left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-xl lg:hidden max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-3 space-y-0.5">
              {/* Home */}
              <Link
                href="/"
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-50"}`}
              >
                Home
              </Link>

              {/* Services accordion */}
              <div>
                <button
                  onClick={() => setIsMobileServicesOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMobileServicesOpen && (
                  <div className="ml-4 mt-1 border-l-2 border-blue-100 pl-3 space-y-0.5">
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

              {/* Containers accordion */}
              <div>
                <button
                  onClick={() => setIsMobileContainersOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${pathname.startsWith("/container-dimensions") ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-50"}`}
                >
                  Container Dimensions
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isMobileContainersOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMobileContainersOpen && (
                  <div className="ml-4 mt-1 border-l-2 border-blue-100 pl-3 space-y-0.5">
                    {containerLinks.map((c, i) => (
                      <Link
                        key={i}
                        href={c.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${pathname === c.href ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}`}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* All other nav items flat */}
              {allMobileNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-50"}`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-gray-100 my-2" />

              {/* Phone */}
              <a
                href="tel:18008907365"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Toll Free: 1800-890-7365
              </a>

              {/* Login / Register */}
              <div className="flex gap-3 px-4 pt-1 pb-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>

              {/* Language */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                  <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                  <select
                    value={selectedLang}
                    onChange={(e) => switchLanguage(e.target.value)}
                    className="flex-1 text-sm text-gray-700 bg-transparent border-0 focus:outline-none"
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
          </div>
        </>
      )}
    </>
  );
}
