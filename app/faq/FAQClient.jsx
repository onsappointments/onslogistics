"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  FileText,
  Package,
  DollarSign,
  Truck,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Search,
  Star,
  Clock,
  BarChart2,
  Receipt,
} from "lucide-react";
import { faqs, categories } from "./faq-data";

// ── icon resolver ────────────────────────────────────────────────────────────
const iconMap = {
  HelpCircle, FileText, Package, DollarSign, Truck, MapPin,
  CheckCircle2, Star, Clock, BarChart2, Receipt,
};
const Icon = ({ name, ...props }) => {
  const Comp = iconMap[name] || HelpCircle;
  return <Comp {...props} />;
};

// ── single FAQ item ──────────────────────────────────────────────────────────
function FAQItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-blue-200 shadow-md shadow-blue-50"
          : "border-gray-100 hover:border-blue-100 hover:shadow-sm"
      } bg-white`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className={`text-sm md:text-base font-semibold leading-snug transition-colors ${
            open ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {item.q}
        </span>
        <span
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
            open
              ? "bg-blue-600 text-white rotate-180"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-50">
          {/* AEO: direct answer callout */}
          {item.directAnswer && (
            <div className="mt-4 mb-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-sm font-semibold text-blue-700 leading-snug">
                {item.directAnswer}
              </p>
            </div>
          )}

          {/* full answer */}
          <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-4 whitespace-pre-line">
            {item.a}
          </p>

          {/* reference links */}
          {item.links?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.links.map((link, i) => {
                const isInternal = link.url.startsWith("/");
                return isInternal ? (
                  <Link
                    key={i}
                    href={link.url}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-600 hover:text-white transition-all duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────
// `initialCategory` is injected by the server page from the route segment.
// Tabs are <Link> elements — clicking navigates to /faq or /faq/[category],
// which triggers a full page load with the correct server-rendered title/meta.
// Search remains a lightweight client-side filter within the current page.
export default function FAQClient({ initialCategory = "all" }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      faqs
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const matchesCat =
              initialCategory === "all" || group.cat === initialCategory;
            const matchesSearch =
              search === "" ||
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase()) ||
              (item.directAnswer || "").toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
          }),
        }))
        .filter((g) => g.items.length > 0),
    [initialCategory, search]
  );

  const totalResults = filtered.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <main className="bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-10 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Expert answers on shipping costs, transit times, customs clearance,
            and international trade — with direct links to official sources.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── Navigation Tabs ─────────────────────────────────────────────────── */}
      {/* Every tab is a <Link> pointing to its own URL.                        */}
      {/* Active highlight comes from initialCategory (server-set), not state.  */}
      {/* Navigating here causes Next.js to load the correct page.jsx,          */}
      {/* which runs generateMetadata → updates <title> and all meta tags.      */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="FAQ categories">
            <ul className="flex flex-wrap gap-2 justify-center list-none p-0 m-0">
              {categories.map((cat) => {
                const isActive = cat.id === initialCategory;
                const href = cat.id === "all" ? "/faq" : `/faq/${cat.id}`;
                return (
                  <li key={cat.id}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      <Icon name={cat.icon} className="w-3.5 h-3.5" />
                      {cat.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {search && (
            <p className="text-center text-sm text-gray-500 mt-4">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;
              {search}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* ── FAQ Content ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No questions found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Try a different search or browse another category above.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filtered.map((group) => (
                <div key={group.cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 rounded-full bg-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">{group.group}</h2>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-medium">
                      {group.items.length} question{group.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, i) => (
                      <FAQItem key={i} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CTA ── */}
          <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center shadow-2xl shadow-blue-200">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Our trade experts in Ludhiana are available 24/7 to help you with
              freight quotes, customs clearance, and export documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block px-8 py-3.5 rounded-xl bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors shadow-md"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/book-appointment"
                className="inline-block px-8 py-3.5 rounded-xl bg-blue-500 text-white font-semibold text-sm border border-blue-400 hover:bg-blue-400 transition-colors"
              >
                Book Appointment
              </Link>
              <a
                href="tel:18008907365"
                className="inline-block px-8 py-3.5 rounded-xl bg-blue-800/40 text-white font-semibold text-sm border border-blue-500 hover:bg-blue-800/60 transition-colors"
              >
                1800-890-7365
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}