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
  ArrowRight,
} from "lucide-react";
import { faqs, categories } from "./faq-data";

// ── icon resolver ─────────────────────────────────────────────────────────────
const iconMap = {
  HelpCircle, FileText, Package, DollarSign, Truck, MapPin,
  CheckCircle2, Star, Clock, BarChart2, Receipt,
};
const Icon = ({ name, ...props }) => {
  const Comp = iconMap[name] || HelpCircle;
  return <Comp {...props} />;
};

// ── single FAQ item ───────────────────────────────────────────────────────────
// SEO STRATEGY:
//   • `directAnswer`  → always rendered in the DOM (visible to crawlers + users)
//   • `item.a`        → full answer, toggled via accordion for UX
// This ensures Google and AI engines can index the answer without interaction,
// while keeping the page clean for human readers.
function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const hasFullAnswer = Boolean(item.a && item.a !== item.directAnswer);

  return (
    <article
      className={`
        group relative bg-white border rounded-2xl overflow-hidden
        transition-all duration-300
        ${open
          ? "border-blue-200 shadow-lg shadow-blue-50/60"
          : "border-slate-100 hover:border-blue-100 hover:shadow-md hover:shadow-slate-100/80"
        }
      `}
      // Microdata fallback for crawlers that don't parse JSON-LD
      itemScope
      itemType="https://schema.org/Question"
    >
      {/* ── left accent bar (appears on hover/open) ── */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
          transition-all duration-300
          ${open ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-100"}
        `}
      />

      {/* ── Question row ── */}
      <div className="pl-5 pr-5 pt-5">
        {/* question number badge */}
        <div className="flex items-start gap-3">
          <span
            className={`
              mt-0.5 shrink-0 min-w-[26px] h-[26px] rounded-lg text-xs font-bold
              flex items-center justify-center tabular-nums
              transition-colors duration-200
              ${open ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"}
            `}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3
            className={`text-sm md:text-[15px] font-semibold leading-snug transition-colors duration-200 ${
              open ? "text-blue-700" : "text-slate-800"
            }`}
            itemProp="name"
          >
            {item.q}
          </h3>
        </div>

        {/*
          ── ALWAYS-VISIBLE DIRECT ANSWER ──────────────────────────────────
          This block is NEVER hidden. It renders in the DOM for all users and
          crawlers without any interaction required — the SEO-critical content.
          Google and AI engines (Perplexity, ChatGPT) read this immediately.
        */}
        {item.directAnswer && (
          <div
            className="mt-3 ml-[38px] flex items-start gap-2"
            itemProp="acceptedAnswer"
            itemScope
            itemType="https://schema.org/Answer"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p
              className="text-sm text-slate-600 leading-relaxed font-medium"
              itemProp="text"
            >
              {item.directAnswer}
            </p>
          </div>
        )}

        {/* ── expand / collapse button for full answer ── */}
        {hasFullAnswer && (
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`
              ml-[38px] mt-3 mb-4 inline-flex items-center gap-1.5
              text-xs font-semibold tracking-wide
              transition-all duration-200
              ${open
                ? "text-blue-600"
                : "text-slate-400 hover:text-blue-500"
              }
            `}
          >
            <span>{open ? "Hide full answer" : "Read full answer"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* spacer when no expand button */}
        {!hasFullAnswer && <div className="mb-4" />}
      </div>

      {/* ── Expanded full answer ── */}
      {open && hasFullAnswer && (
        <div className="mx-5 mb-5 border-t border-slate-50 pt-4 ml-[calc(1.25rem+38px)]">
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
            {item.a}
          </p>

          {/* reference links */}
          {item.links?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.links.map((link, i) => {
                const isInternal = link.url.startsWith("/");
                const Wrapper = isInternal ? Link : "a";
                const extra = isInternal
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" };

                return (
                  <Wrapper
                    key={i}
                    href={link.url}
                    {...extra}
                    className={`
                      inline-flex items-center gap-1.5 text-xs font-medium
                      px-3 py-1.5 rounded-full border transition-all duration-200
                      ${isInternal
                        ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-700"
                      }
                    `}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ── category group header ─────────────────────────────────────────────────────
function GroupHeader({ group, count, catIcon }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
          <Icon name={catIcon} className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-base font-bold text-slate-900">{group}</h2>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-100 to-transparent" />
      <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
        {count} Q{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ── main exported component ───────────────────────────────────────────────────
export default function FAQClient({ initialCategory = "all" }) {
  const [search, setSearch] = useState("");

  // build a cat→icon lookup for group headers
  const catIconMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.icon])),
    []
  );

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

  // running index across all groups for sequential question numbers
  let globalIndex = 0;

  return (
    <main className="bg-slate-50/50 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-white border-b border-slate-100 pt-12 pb-14 px-6">

        {/* subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#0f172a 0,#0f172a 1px,transparent 1px,transparent 40px)," +
              "repeating-linear-gradient(90deg,#0f172a 0,#0f172a 1px,transparent 1px,transparent 40px)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5 tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
            Frequently Asked{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600">Questions</span>
              <span
                aria-hidden
                className="absolute bottom-1 left-0 right-0 h-2.5 bg-blue-100 -z-0 rounded"
              />
            </span>
          </h1>

          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
            Expert answers on shipping costs, transit times, customs clearance,
            and international trade — with direct links to official sources.
          </p>

          {/* ── Search ── */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search across all questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200
                bg-white shadow-sm text-sm text-slate-800 placeholder-slate-400
                focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                transition-all duration-200
              "
            />
            {search && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {totalResults} found
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Sticky category nav ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <nav
            aria-label="FAQ categories"
            className="overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
            <ul className="flex gap-1 py-3 list-none m-0 p-0 min-w-max">
              {categories.map((cat) => {
                const isActive = cat.id === initialCategory;
                const href = cat.id === "all" ? "/faq" : `/faq/${cat.id}`;
                return (
                  <li key={cat.id}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                        text-xs font-semibold border transition-all duration-200 whitespace-nowrap
                        ${isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                          : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50"
                        }
                      `}
                    >
                      <Icon name={cat.icon} className="w-3 h-3" />
                      {cat.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* ── FAQ content ── */}
      <section className="px-6 py-10 pb-24">
        <div className="max-w-5xl mx-auto">

          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-700 font-semibold text-lg">No results found</p>
              <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
                Try different keywords or browse a category above.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {filtered.map((group) => {
                const startIndex = globalIndex;
                globalIndex += group.items.length;
                return (
                  <div key={group.cat}>
                    <GroupHeader
                      group={group.group}
                      count={group.items.length}
                      catIcon={catIconMap[group.cat] || "HelpCircle"}
                    />
                    <div className="space-y-3">
                      {group.items.map((item, i) => (
                        <FAQItem
                          key={i}
                          item={item}
                          index={startIndex + i}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CTA ── */}
          <div className="mt-20 rounded-3xl bg-slate-900 p-10 md:p-14 text-center relative overflow-hidden">
            {/* decorative circles */}
            <div aria-hidden className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-600/20" />
            <div aria-hidden className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-blue-600/10" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-5 tracking-wide">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                Still need help?
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Talk to our trade experts
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Based in Ludhiana, available 24/7 for freight quotes, customs
                clearance guidance, and export documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
                >
                  Get a Free Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Book Appointment
                </Link>
                <a
                  href="tel:18008907365"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-semibold text-sm border border-white/10 hover:bg-white/10 transition-colors"
                >
                  1800-890-7365
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}