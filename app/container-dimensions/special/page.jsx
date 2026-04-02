"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const containerGroups = [
  {
    id: "open-top",
    label: "Open Top Containers",
    icon: "🔓",
    accent: "#F59E0B",
    badgeText: "Over-Height",
    badgeColor: "bg-amber-500",
    description:
      "Open top containers are especially suitable for transporting over-height cargo that cannot fit through the doors of a standard container — such as machinery, timber, or large industrial equipment. The removable roof bows and tarpaulin cover allow loading from above via crane. The open-top design provides full access to the container's full internal height.",
    highlights: [
      { icon: "🏗️", label: "Crane-top loading" },
      { icon: "📏", label: "Over-height cargo" },
      { icon: "🪵", label: "Timber, machinery" },
      { icon: "🧱", label: "Removable roof bows" },
    ],
    containers: [
      {
        id: "20ot",
        label: "20' Open Top Container",
        image: "/containers/20ot.png",
        specs: [
          {
            label: "Cubic Capacity",
            metric: "32.2 m³",
            us: "1,130 cu ft",
            cat: "capacity",
          },
          {
            label: "Payload (Weight)",
            metric: "28,230 kg",
            us: "62,240 lb",
            cat: "weight",
          },
          {
            label: "Tare Weight",
            metric: "2,300 kg",
            us: "5,070 lb",
            cat: "weight",
          },
          {
            label: "Max Gross Weight",
            metric: "30,480 kg",
            us: "67,197 lb",
            cat: "weight",
          },
          {
            label: "Internal Length",
            metric: "5.893 m",
            us: `19'4"`,
            cat: "internal",
          },
          {
            label: "Internal Width",
            metric: "2.352 m",
            us: `7'9"`,
            cat: "internal",
          },
          {
            label: "Internal Height",
            metric: "2.330 m",
            us: `7'8"`,
            cat: "internal",
          },
          {
            label: "External Length",
            metric: "6.058 m",
            us: `19'10½"`,
            cat: "external",
          },
          {
            label: "External Width",
            metric: "2.438 m",
            us: `8'0"`,
            cat: "external",
          },
          {
            label: "External Height",
            metric: "2.591 m",
            us: `8'6"`,
            cat: "external",
          },
          {
            label: "Door Opening Width",
            metric: "2.340 m",
            us: `7'8"`,
            cat: "door",
          },
          {
            label: "Door Opening Height",
            metric: "2.280 m",
            us: `7'6"`,
            cat: "door",
          },
        ],
      },
      {
        id: "40ot",
        label: "40' Open Top Container",
        image: "/containers/40ot.png",
        specs: [
          {
            label: "Cubic Capacity",
            metric: "65.5 m³",
            us: "2,306 cu ft",
            cat: "capacity",
          },
          {
            label: "Payload (Weight)",
            metric: "26,580 kg",
            us: "58,602 lb",
            cat: "weight",
          },
          {
            label: "Tare Weight",
            metric: "3,900 kg",
            us: "8,598 lb",
            cat: "weight",
          },
          {
            label: "Max Gross Weight",
            metric: "30,480 kg",
            us: "67,197 lb",
            cat: "weight",
          },
          {
            label: "Internal Length",
            metric: "12.032 m",
            us: `39'6"`,
            cat: "internal",
          },
          {
            label: "Internal Width",
            metric: "2.352 m",
            us: `7'9"`,
            cat: "internal",
          },
          {
            label: "Internal Height",
            metric: "2.330 m",
            us: `7'8"`,
            cat: "internal",
          },
          {
            label: "External Length",
            metric: "12.192 m",
            us: `40'0"`,
            cat: "external",
          },
          {
            label: "External Width",
            metric: "2.438 m",
            us: `8'0"`,
            cat: "external",
          },
          {
            label: "External Height",
            metric: "2.591 m",
            us: `8'6"`,
            cat: "external",
          },
          {
            label: "Door Opening Width",
            metric: "2.340 m",
            us: `7'8"`,
            cat: "door",
          },
          {
            label: "Door Opening Height",
            metric: "2.280 m",
            us: `7'6"`,
            cat: "door",
          },
        ],
      },
    ],
  },
  {
    id: "flat-rack",
    label: "Collapsible Flat Rack Containers",
    icon: "🔧",
    accent: "#3B82F6",
    badgeText: "Over-Width",
    badgeColor: "bg-blue-600",
    description:
      "Flat rack containers are designed for over-width and heavy cargo that cannot fit inside a standard enclosed container. With collapsible end walls, they can be stacked when empty for efficient repositioning. They're ideal for heavy machinery, vehicles, steel coils, and large industrial equipment. The reinforced floor structure supports very high concentrated loads.",
    highlights: [
      { icon: "🚛", label: "Over-width cargo" },
      { icon: "🏭", label: "Machinery & vehicles" },
      { icon: "🔩", label: "Collapsible end walls" },
      { icon: "💪", label: "High load capacity" },
    ],
    containers: [
      {
        id: "20cfr",
        label: "20' Collapsible Flat Rack",
        image: "/containers/20cfr.png",
        specs: [
          {
            label: "Payload (Weight)",
            metric: "31,260 kg",
            us: "68,917 lb",
            cat: "weight",
          },
          {
            label: "Tare Weight",
            metric: "2,540 kg",
            us: "5,600 lb",
            cat: "weight",
          },
          {
            label: "Max Gross Weight",
            metric: "34,000 kg",
            us: "74,960 lb",
            cat: "weight",
          },
          {
            label: "Platform Length",
            metric: "5.940 m",
            us: `19'6"`,
            cat: "internal",
          },
          {
            label: "Platform Width",
            metric: "2.228 m",
            us: `7'4"`,
            cat: "internal",
          },
          {
            label: "External Length",
            metric: "6.058 m",
            us: `19'10½"`,
            cat: "external",
          },
          {
            label: "External Width",
            metric: "2.438 m",
            us: `8'0"`,
            cat: "external",
          },
          {
            label: "External Height",
            metric: "2.591 m",
            us: `8'6"`,
            cat: "external",
          },
        ],
      },
      {
        id: "40cfr",
        label: "40' Collapsible Flat Rack",
        image: "/containers/40cfr.png",
        specs: [
          {
            label: "Payload (Weight)",
            metric: "31,260 – 40,000 kg",
            us: "68,920 – 88,200 lb",
            cat: "weight",
          },
          {
            label: "Tare Weight",
            metric: "5,140 – 5,980 kg",
            us: "11,330 – 13,180 lb",
            cat: "weight",
          },
          {
            label: "Max Gross Weight",
            metric: "40,000 – 45,000 kg",
            us: "88,200 – 99,200 lb",
            cat: "weight",
          },
          {
            label: "Platform Length",
            metric: "12.064 m",
            us: `39'7"`,
            cat: "internal",
          },
          {
            label: "Platform Width",
            metric: "2.228 m",
            us: `7'4"`,
            cat: "internal",
          },
          {
            label: "External Length",
            metric: "12.192 m",
            us: `40'0"`,
            cat: "external",
          },
          {
            label: "External Width",
            metric: "2.438 m",
            us: `8'0"`,
            cat: "external",
          },
          {
            label: "External Height",
            metric: "2.591 m",
            us: `8'6"`,
            cat: "external",
          },
        ],
      },
    ],
  },
];

const catMeta = {
  capacity: {
    label: "Capacity",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  weight: {
    label: "Weight",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  internal: {
    label: "Internal",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  external: {
    label: "External",
    color: "text-purple-700 bg-purple-50 border-purple-200",
  },
  door: { label: "Door", color: "text-rose-700 bg-rose-50 border-rose-200" },
};

// ─── Container SVG Diagrams ───────────────────────────────────────────────────

function OpenTopSVG({ accent, label }) {
  const w = label.startsWith("20") ? 200 : 370;
  const h = 82;
  return (
    <svg
      viewBox={`0 0 ${w + 60} ${h + 60}`}
      className="w-full max-h-36"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <ellipse
        cx={(w + 60) / 2}
        cy={h + 52}
        rx={w * 0.4}
        ry={5}
        fill="rgba(0,0,0,0.1)"
      />
      {/* Body */}
      <rect
        x="30"
        y="20"
        width={w}
        height={h}
        rx="3"
        fill="#1E3A5F"
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* Open top - hatching */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={i}
          x1={30 + i * (w / 10)}
          y1="20"
          x2={30 + (i + 0.5) * (w / 10)}
          y2="12"
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      ))}
      {/* Top opening */}
      <rect
        x="30"
        y="16"
        width={w}
        height="6"
        rx="1"
        fill={accent}
        opacity="0.3"
      />
      {/* Corrugations */}
      {Array.from({ length: label.startsWith("20") ? 5 : 9 }).map((_, i) => (
        <line
          key={i}
          x1={30 + (w / (label.startsWith("20") ? 6 : 10)) * (i + 1)}
          y1="22"
          x2={30 + (w / (label.startsWith("20") ? 6 : 10)) * (i + 1)}
          y2={20 + h - 2}
          stroke={accent}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
      ))}
      {/* Rails */}
      <rect
        x="28"
        y={18 + h - 2}
        width={w + 4}
        height="4"
        rx="2"
        fill={accent}
        opacity="0.9"
      />
      <rect
        x="28"
        y="18"
        width="5"
        height={h}
        rx="2"
        fill={accent}
        opacity="0.9"
      />
      <rect
        x={w + 27}
        y="18"
        width="5"
        height={h}
        rx="2"
        fill={accent}
        opacity="0.9"
      />
      {/* Door lines */}
      <line
        x1={w + 30 - 18}
        y1="20"
        x2={w + 30 - 18}
        y2={20 + h}
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      <text
        x={30 + w / 2}
        y={20 + h / 2 + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="10"
        fontWeight="700"
      >
        OPEN TOP
      </text>
      {/* Tarpaulin label */}
      <text
        x={30 + w / 2}
        y="11"
        textAnchor="middle"
        fill={accent}
        fontSize="7.5"
        opacity="0.8"
      >
        TARPAULIN COVER
      </text>
    </svg>
  );
}

function FlatRackSVG({ accent, label }) {
  const w = label.startsWith("20") ? 200 : 370;
  return (
    <svg
      viewBox={`0 0 ${w + 60} 120`}
      className="w-full max-h-36"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <ellipse
        cx={(w + 60) / 2}
        cy={112}
        rx={w * 0.4}
        ry={5}
        fill="rgba(0,0,0,0.1)"
      />
      {/* Platform floor */}
      <rect
        x="30"
        y="60"
        width={w}
        height="18"
        rx="3"
        fill="#1E3A5F"
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* Floor lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={30 + (w / 9) * (i + 1)}
          y1="62"
          x2={30 + (w / 9) * (i + 1)}
          y2="76"
          stroke={accent}
          strokeWidth="0.7"
          strokeOpacity="0.4"
        />
      ))}
      {/* End walls (left) */}
      <rect
        x="28"
        y="20"
        width="8"
        height="58"
        rx="2"
        fill="#1E3A5F"
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* End walls (right) */}
      <rect
        x={w + 24}
        y="20"
        width="8"
        height="58"
        rx="2"
        fill="#1E3A5F"
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* Corner fittings */}
      {[
        [28, 20],
        [w + 24, 20],
        [28, 72],
        [w + 24, 72],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx - 1}
          y={cy - 1}
          width="10"
          height="10"
          rx="2"
          fill={accent}
          opacity="0.9"
        />
      ))}
      {/* Cargo outline (dotted) */}
      <rect
        x="36"
        y="24"
        width={w - 12}
        height="36"
        rx="2"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="4,3"
        strokeOpacity="0.35"
      />
      <text
        x={30 + w / 2}
        y="46"
        textAnchor="middle"
        fill={accent}
        fontSize="8"
        opacity="0.6"
      >
        CARGO AREA (OPEN)
      </text>
      {/* Label */}
      <text
        x={30 + w / 2}
        y="72"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="9"
        fontWeight="700"
      >
        FLAT RACK
      </text>
      {/* Collapse arrow hint */}
      <text
        x={28 + 4}
        y="16"
        textAnchor="middle"
        fill={accent}
        fontSize="7"
        opacity="0.7"
      >
        ▼
      </text>
      <text
        x={w + 28}
        y="16"
        textAnchor="middle"
        fill={accent}
        fontSize="7"
        opacity="0.7"
      >
        ▼
      </text>
      <text
        x={30 + w / 2}
        y="14"
        textAnchor="middle"
        fill={accent}
        fontSize="7.5"
        opacity="0.7"
      >
        COLLAPSIBLE END WALLS
      </text>
    </svg>
  );
}

// ─── Spec Table ───────────────────────────────────────────────────────────────

function SpecTable({ specs, title }) {
  const grouped = {};
  specs.forEach((s) => {
    if (!grouped[s.cat]) grouped[s.cat] = [];
    grouped[s.cat].push(s);
  });

  return (
    <div>
      {title && (
        <h4 className="text-sm font-bold text-[#0A1628] mb-2 flex items-center gap-2">
          <span className="h-3 w-1 bg-amber-500 rounded-full inline-block" />
          {title}
        </h4>
      )}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              <th className="px-4 py-3 text-left font-semibold tracking-wide text-xs w-[35%]">
                Specification
              </th>
              <th className="px-4 py-3 text-left font-semibold tracking-wide text-xs w-[32%]">
                Metric
              </th>
              <th className="px-4 py-3 text-left font-semibold tracking-wide text-xs w-[33%]">
                Imperial (U.S.)
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([cat, rows]) => (
              <>
                <tr
                  key={`h-${cat}`}
                  className="bg-gray-50 border-t border-gray-100"
                >
                  <td colSpan={3} className="px-4 py-1">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${catMeta[cat]?.color}`}
                    >
                      {catMeta[cat]?.label}
                    </span>
                  </td>
                </tr>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-50 hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-800 font-medium text-xs">
                      {row.label}
                    </td>
                    <td className="px-4 py-2 text-gray-800 font-mono text-xs">
                      {row.metric}
                    </td>
                    <td className="px-4 py-2 text-gray-800 font-mono text-xs">
                      {row.us || "—"}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Image Slider ─────────────────────────────────────────────────────────────

function ImageSlider({ containers: items, accent }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(
      () => setCurrent((p) => (p + 1) % items.length),
      4500,
    );
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {items.map((c, i) => (
        <img
          key={c.id}
          src={c.image}
          alt={c.label}
          className={`absolute max-h-32 max-w-[85%] object-contain drop-shadow-2xl transition-all duration-700 ${i === current ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          onError={(e) => {
            e.target.src = "/containers/placeholder-container.png";
          }}
        />
      ))}
      {/* dots */}
      {items.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === current ? "18px" : "6px",
                backgroundColor:
                  i === current ? accent : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Group Section ────────────────────────────────────────────────────────────

function GroupSection({ group }) {
  const [activeContainer, setActiveContainer] = useState(
    group.containers[0].id,
  );
  const active = group.containers.find((c) => c.id === activeContainer);

  return (
    <section id={group.id} className="scroll-mt-24 mb-16">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: group.accent + "18" }}
        >
          {group.icon}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            ONS Special Containers
          </p>
          <h2 className="text-xl font-extrabold text-[#0A1628]">
            {group.label}
          </h2>
        </div>
        <span
          className={`ml-auto text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-white ${group.badgeColor}`}
        >
          {group.badgeText}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {/* Dark card: image + diagram */}
        <div className="bg-[#060F1D] rounded-3xl p-6 flex flex-col gap-4">
          {/* Image slider at top */}
          <div className="relative flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden h-44 border border-white/10">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${group.accent}18 0%, transparent 70%)`,
              }}
            />
            <ImageSlider containers={group.containers} accent={group.accent} />
            <span
              className={`absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full text-white ${group.badgeColor}`}
            >
              {group.badgeText}
            </span>
          </div>

          {/* Diagram switcher */}
          <div className="flex gap-2">
            {group.containers.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveContainer(c.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor:
                    activeContainer === c.id
                      ? group.accent
                      : "rgba(255,255,255,0.07)",
                  color:
                    activeContainer === c.id ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Diagram */}
          <div className="flex-1 flex items-center justify-center py-1">
            {group.id === "open-top" ? (
              <OpenTopSVG accent={group.accent} label={active.label} />
            ) : (
              <FlatRackSVG accent={group.accent} label={active.label} />
            )}
          </div>
        </div>

        {/* Description + highlights */}
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            {group.description}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {group.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3"
              >
                <span className="text-xl leading-none">{h.icon}</span>
                <p className="text-xs text-gray-900 font-medium leading-snug">
                  {h.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spec Tables side by side */}
      <div className="grid md:grid-cols-2 gap-5">
        {group.containers.map((c) => (
          <SpecTable key={c.id} specs={c.specs} title={c.label} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpecialContainersPage() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap");
        body {
          font-family: "DM Sans", sans-serif;
        }
        .fade-up {
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <main className="pt-[72px] min-h-screen bg-white">
        {/* ── Hero ── */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          {/* Full background image */}
          <Image
            src="/container-hero.webp"
            alt="Shipping containers"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark blue overlay — same style as other ONS pages */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-blue-900/50" />

          {/* Text */}
          <div className="relative z-20 flex items-end h-full px-6 md:px-14 pb-9">
            <div>
              <nav className="flex items-center gap-2 text-amber-400/70 text-xs font-medium mb-2">
                <Link href="/" className="hover:text-amber-400">
                  Home
                </Link>
                <span>/</span>
                <span className="text-amber-400">Container Dimensions</span>
                <span>/</span>
                <span className="text-white/60">Special Containers</span>
              </nav>
              <div className="flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-amber-500" />
                <div>
                  <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-0.5">
                    Container Dimensions
                  </p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Special Containers
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Nav ── */}
        <div className="bg-[#0A1628] border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-14 py-4 flex gap-4 overflow-x-auto">
            {containerGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => scrollTo(g.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border border-white/10 text-white/60 hover:border-amber-400/50 hover:text-amber-400"
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 fade-up">
          {/* ── Intro ── */}
          <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-200/60 rounded-2xl p-5 mb-12 flex gap-4">
            <div className="text-amber-500 text-2xl mt-0.5 flex-shrink-0">
              ⚠️
            </div>
            <div className="text-sm text-gray-700 leading-relaxed space-y-1.5">
              <p>
                <span className="font-semibold text-gray-800">
                  Special containers
                </span>{" "}
                are designed for cargo that cannot be transported in standard
                closed containers — including over-height, over-width, or
                heavyweight shipments requiring top or side loading.
              </p>
              <p className="text-xs text-gray-700">
                All special container usage is subject to applicable regulations
                in the port/country of operation. Contact your local ONS
                representative before booking.
              </p>
            </div>
          </div>

          {/* ── Groups ── */}
          {containerGroups.map((g) => (
            <GroupSection key={g.id} group={g} />
          ))}

          {/* ── Footer Nav ── */}
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-3">
            <Link
              href="/container-dimensions/standard"
              className="px-5 py-2.5 rounded-xl border border-[#0A1628] text-[#0A1628] text-sm font-semibold hover:bg-[#0A1628] hover:text-white transition-all"
            >
              ← Standard Containers
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-all shadow-md shadow-amber-200"
            >
              Contact a Representative →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
