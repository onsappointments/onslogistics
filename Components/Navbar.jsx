"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
    { label: "Track Your Shipment", path: "/tracking" },
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
    <>
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #2563eb;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .dropdown-animate {
          animation: slideDown 0.3s ease-out;
        }

        .logo-container {
          transition: all 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.05);
        }

        .service-item {
          transition: all 0.2s ease;
        }

        .service-item:hover {
          transform: translateX(4px);
        }

        .btn-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-hover:hover::before {
          left: 100%;
        }

        .lang-select {
          transition: all 0.3s ease;
        }

        .lang-select:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .dropdown-container {
          position: relative;
        }
      `}</style>

      <nav
        id="site-navbar"
        className="fixed top-0 left-0 z-50 w-full bg-[--color-background]/90 backdrop-blur-md border-b border-gray-200"
      >
        <div 
        className="max-w-[1440px] mx-auto h-[64px] lg:h-[72px] px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 logo-container">
            <Image src="/logo.png" alt="ONS Logistics Logo" width={44} height={44} />
            <span className="hidden sm:block text-2xl font-semibold text-black transition-colors duration-300 hover:text-blue-600">
              ONS
            </span>
          </Link>

          {/* Nav Links (desktop & tablet only) */}
          <ul className="hidden md:flex items-center gap-4 lg:gap-6 whitespace-nowrap">

            {/* Home */}
            <li>
              <Link
                href="/"
                className={`nav-link text-sm lg:text-md font-semibold transition-colors ${
                  pathname === "/"
                    ? "text-blue-600 active"
                    : "text-black hover:text-blue-600"
                }`}
              >
                Home
              </Link>
            </li>

            {/* Services Dropdown */}
            <li
              className="dropdown-container"
              onMouseEnter={() => setIsServicesOpen(true)}
              onClick={() => setIsServicesOpen(false)}
            >
              <Link
                href="/services"
                className={`nav-link inline-flex items-center gap-1 text-sm lg:text-md font-semibold transition-colors ${
                  pathname.startsWith("/services")
                    ? "text-blue-600 active"
                    : "text-black hover:text-blue-600"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {isServicesOpen && (
                <div
                  className="dropdown-animate absolute left-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-blue-600/20 overflow-hidden z-[100]"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  {services.map((service, idx) => (
                    <Link
                      key={idx}
                      href={service.href}
                      className="service-item  block px-4 py-2.5 text-sm text-black hover:bg-blue-600 hover:text-white"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Other Nav Items */}
            {navItems
              .filter((item) => item.label !== "Home" && item.label !== "Services")
              .map((item) =>
                item.path.startsWith("tel:") ? (
                  <li key={item.label}>
                    <a
                      href={item.path}
                      className="nav-link text-sm lg:text-md text-black font-semibold hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.path}
                      className={`nav-link text-sm lg:text-md font-semibold transition-colors  ${
                        pathname === item.path
                          ? "text-blue-600 active"
                          : "text-black hover:text-blue-600"
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
              className="text-sm lg:text-md text-black font-semibold hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="btn-hover rounded-lg bg-blue-600 px-4 py-2 text-sm lg:text-md text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Register
            </Link>

            {/* Language dropdown only on large screens */}
            <select
              className="lang-select hidden lg:block ml-3 border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </>
  );
}