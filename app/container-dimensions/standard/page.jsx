"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const containers = [
  {
    id: "20ft",
    label: "20' Standard",
    fullLabel: "20' Standard Steel Container",
    badge: "Most Popular",
    badgeColor: "bg-amber-500",
    color: "#F59E0B",
    svgWidth: 220,
    svgHeight: 110,
    description:
      "20' standard steel containers are closed weather-tight containers suitable for any general cargo. ONS 20' containers have a payload capacity of up to 28,160 kg — close to many 40' containers. Especially suitable for high-density, heavyweight cargo. Garment hanger bars and forklift pockets are available on most units.",
    highlights: [
      { icon: "⚖️", label: "Up to 28,160 kg payload" },
      { icon: "📦", label: "33.2 m³ cubic capacity" },
      { icon: "🔩", label: "Forklift pockets available" },
      { icon: "👕", label: "11+ garment hanger bars" },
    ],
    image: "/containers/20ft-standard.png",
    specs: [
      {
        label: "Cubic Capacity",
        metric: "33.2 m³",
        us: "1,170 cu ft",
        category: "capacity",
      },
      {
        label: "Payload (Weight)",
        metric: "21,850 – 28,160 kg",
        us: "48,171 – 62,082 lb",
        category: "weight",
      },
      {
        label: "Tare Weight",
        metric: "2,150 – 2,220 kg",
        us: "4,740 – 4,894 lb",
        category: "weight",
      },
      {
        label: "Max Gross Weight",
        metric: "24,000 – 30,480 kg",
        us: "52,911 – 67,197 lb",
        category: "weight",
      },
      {
        label: "Internal Length",
        metric: "5.898 m",
        us: `19'4"`,
        category: "internal",
      },
      {
        label: "Internal Width",
        metric: "2.352 m",
        us: `7'9"`,
        category: "internal",
      },
      {
        label: "Internal Height",
        metric: "2.392 m",
        us: `7'10"`,
        category: "internal",
      },
      {
        label: "External Length",
        metric: "6.058 m",
        us: `19'10½"`,
        category: "external",
      },
      {
        label: "External Width",
        metric: "2.438 m",
        us: `8'0"`,
        category: "external",
      },
      {
        label: "External Height",
        metric: "2.591 m",
        us: `8'6"`,
        category: "external",
      },
      {
        label: "Door Opening Width",
        metric: "2.340 m",
        us: `7'8"`,
        category: "door",
      },
      {
        label: "Door Opening Height",
        metric: "2.280 m",
        us: `7'6"`,
        category: "door",
      },
      {
        label: "Lashing Rings (Rails)",
        metric: "5 per rail × 2, cap. 2,000 kg each",
        us: "",
        category: "features",
      },
      {
        label: "Lashing Rings (Posts)",
        metric: "3 per corner post, cap. 1,500 kg each",
        us: "",
        category: "features",
      },
    ],
  },
  {
    id: "40ft",
    label: "40' Standard",
    fullLabel: "40' Standard Steel Container",
    badge: "High Capacity",
    badgeColor: "bg-blue-600",
    color: "#3B82F6",
    svgWidth: 400,
    svgHeight: 110,
    description:
      "40' standard steel containers are closed weather-tight containers for any general cargo. Most ONS 40' containers have a payload of 28,760 kg with a gross weight of 32,500 kg — exceeding the ISO standard. Almost all feature a gooseneck tunnel recess and support 22+ garment hanger bars.",
    highlights: [
      { icon: "⚖️", label: "Up to 28,760 kg payload" },
      { icon: "📦", label: "67.7 m³ cubic capacity" },
      { icon: "🔩", label: "Gooseneck tunnel" },
      { icon: "👕", label: "22+ garment hanger bars" },
    ],
    image: "/containers/40ft-standard.png",
    specs: [
      {
        label: "Cubic Capacity",
        metric: "67.7 m³",
        us: "2,391 cu ft",
        category: "capacity",
      },
      {
        label: "Payload (Weight)",
        metric: "26,760 – 28,760 kg",
        us: "58,996 – 63,405 lb",
        category: "weight",
      },
      {
        label: "Tare Weight",
        metric: "3,720 – 3,740 kg",
        us: "8,201 – 8,245 lb",
        category: "weight",
      },
      {
        label: "Max Gross Weight",
        metric: "30,480 – 32,500 kg",
        us: "67,197 – 71,650 lb",
        category: "weight",
      },
      {
        label: "Internal Length",
        metric: "12.032 m",
        us: `39'6"`,
        category: "internal",
      },
      {
        label: "Internal Width",
        metric: "2.352 m",
        us: `7'9"`,
        category: "internal",
      },
      {
        label: "Internal Height",
        metric: "2.392 m",
        us: `7'10"`,
        category: "internal",
      },
      {
        label: "External Length",
        metric: "12.192 m",
        us: `40'0"`,
        category: "external",
      },
      {
        label: "External Width",
        metric: "2.438 m",
        us: `8'0"`,
        category: "external",
      },
      {
        label: "External Height",
        metric: "2.591 m",
        us: `8'6"`,
        category: "external",
      },
      {
        label: "Door Opening Width",
        metric: "2.340 m",
        us: `7'8"`,
        category: "door",
      },
      {
        label: "Door Opening Height",
        metric: "2.280 m",
        us: `7'6"`,
        category: "door",
      },
      {
        label: "Lashing Rings (Rails)",
        metric: "10 per rail × 2, cap. 2,000 kg each",
        us: "",
        category: "features",
      },
      {
        label: "Lashing Rings (Posts)",
        metric: "3 per corner post, cap. 1,500 kg each",
        us: "",
        category: "features",
      },
    ],
  },
  {
    id: "40hc",
    label: "40' High Cube",
    fullLabel: "40' High Cube Steel Container",
    badge: "Max Volume",
    badgeColor: "bg-emerald-600",
    color: "#10B981",
    svgWidth: 400,
    svgHeight: 130,
    description:
      "40' high cube containers are ideal for all general cargo — identical to the 40' standard, but one foot taller for extra cubic capacity. Perfect for voluminous cargo. Most ONS high cube units deliver 28,550 kg payload at 32,500 kg gross weight, surpassing ISO requirements. Gooseneck tunnel and 22+ garment hanger bars supported.",
    highlights: [
      { icon: "⚖️", label: "Up to 28,550 kg payload" },
      { icon: "📦", label: "76.4 m³ cubic capacity" },
      { icon: "📏", label: "9'6\" external height" },
      { icon: "👕", label: "22+ garment hanger bars" },
    ],
    image: "/containers/40-highcube.png",
    specs: [
      {
        label: "Cubic Capacity",
        metric: "76.4 m³",
        us: "2,700 cu ft",
        category: "capacity",
      },
      {
        label: "Payload (Weight)",
        metric: "26,750 – 28,550 kg",
        us: "58,974 – 62,942 lb",
        category: "weight",
      },
      {
        label: "Tare Weight",
        metric: "3,730 – 3,950 kg",
        us: "8,223 – 8,708 lb",
        category: "weight",
      },
      {
        label: "Max Gross Weight",
        metric: "30,480 – 32,500 kg",
        us: "67,197 – 71,650 lb",
        category: "weight",
      },
      {
        label: "Internal Length",
        metric: "12.033 m",
        us: `39'6"`,
        category: "internal",
      },
      {
        label: "Internal Width",
        metric: "2.352 m",
        us: `7'9"`,
        category: "internal",
      },
      {
        label: "Internal Height",
        metric: "2.698 m",
        us: `8'10"`,
        category: "internal",
      },
      {
        label: "External Length",
        metric: "12.192 m",
        us: `40'0"`,
        category: "external",
      },
      {
        label: "External Width",
        metric: "2.438 m",
        us: `8'0"`,
        category: "external",
      },
      {
        label: "External Height",
        metric: "2.896 m",
        us: `9'6"`,
        category: "external",
      },
      {
        label: "Door Opening Width",
        metric: "2.340 m",
        us: `7'8"`,
        category: "door",
      },
      {
        label: "Door Opening Height",
        metric: "2.585 m",
        us: `8'6"`,
        category: "door",
      },
      {
        label: "Lashing Rings (Rails)",
        metric: "10 per rail × 2, cap. 2,000 kg each",
        us: "",
        category: "features",
      },
      {
        label: "Lashing Rings (Posts)",
        metric: "3 per corner post, cap. 1,500 kg each",
        us: "",
        category: "features",
      },
    ],
  },
];

const categoryMeta = {
  capacity: {
    label: "Capacity",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  weight: {
    label: "Weight",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  internal: {
    label: "Internal",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  external: {
    label: "External",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  door: { label: "Door", color: "bg-rose-50 text-rose-700 border-rose-200" },
  features: {
    label: "Features",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

// ─── Container SVG Diagram ────────────────────────────────────────────────────

function ContainerDiagram({ container }) {
  const is20ft = container.id === "20ft";
  const isHC = container.id === "40hc";
  const w = is20ft ? 200 : 380;
  const h = isHC ? 100 : 82;
  const accent = container.color;

  return (
    <svg
      viewBox={`0 0 ${w + 60} ${h + 80}`}
      className="w-full max-w-sm mx-auto"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Shadow */}
      <ellipse
        cx={(w + 60) / 2}
        cy={h + 72}
        rx={w * 0.42}
        ry={6}
        fill="rgba(0,0,0,0.12)"
      />

      {/* Container body */}
      <rect
        x="30"
        y="20"
        width={w}
        height={h}
        rx="3"
        fill="#1E3A5F"
        stroke={accent}
        strokeWidth="2"
      />

      {/* Corrugation lines */}
      {Array.from({ length: is20ft ? 6 : 10 }).map((_, i) => (
        <line
          key={i}
          x1={30 + (w / (is20ft ? 7 : 11)) * (i + 1)}
          y1="22"
          x2={30 + (w / (is20ft ? 7 : 11)) * (i + 1)}
          y2={20 + h - 2}
          stroke={accent}
          strokeWidth="0.8"
          strokeOpacity="0.35"
        />
      ))}

      {/* Door lines (right side) */}
      <line
        x1={w + 30 - 18}
        y1="20"
        x2={w + 30 - 18}
        y2={20 + h}
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
      <line
        x1={w + 30 - 36}
        y1="20"
        x2={w + 30 - 36}
        y2={20 + h}
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Top rail */}
      <rect
        x="28"
        y="18"
        width={w + 4}
        height="4"
        rx="2"
        fill={accent}
        opacity="0.9"
      />
      {/* Bottom rail */}
      <rect
        x="28"
        y={20 + h - 2}
        width={w + 4}
        height="4"
        rx="2"
        fill={accent}
        opacity="0.9"
      />
      {/* Left post */}
      <rect
        x="28"
        y="18"
        width="5"
        height={h + 4}
        rx="2"
        fill={accent}
        opacity="0.9"
      />
      {/* Right post */}
      <rect
        x={w + 27}
        y="18"
        width="5"
        height={h + 4}
        rx="2"
        fill={accent}
        opacity="0.9"
      />

      {/* Corner castings */}
      {[
        [28, 18],
        [w + 27, 18],
        [28, h + 18],
        [w + 27, h + 18],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx - 1}
          y={cy - 1}
          width="7"
          height="7"
          rx="1.5"
          fill={accent}
          opacity="1"
        />
      ))}

      {/* Label inside */}
      <text
        x={30 + w / 2}
        y={20 + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
        opacity="0.9"
      >
        {container.label.toUpperCase()}
      </text>

      {/* Width arrow */}
      <line
        x1="30"
        y1={h + 32}
        x2={w + 30}
        y2={h + 32}
        stroke="#94A3B8"
        strokeWidth="1"
        markerEnd="url(#arr)"
        markerStart="url(#arr)"
      />
      <text
        x={30 + w / 2}
        y={h + 44}
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="8.5"
      >
        {is20ft ? "6.058 m  /  20'" : "12.192 m  /  40'"}
      </text>

      {/* Height arrow */}
      <line
        x1="18"
        y1="20"
        x2="18"
        y2={20 + h}
        stroke="#94A3B8"
        strokeWidth="1"
        markerEnd="url(#arr)"
        markerStart="url(#arr)"
      />
      <text
        x="14"
        y={20 + h / 2}
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="8.5"
        transform={`rotate(-90, 14, ${20 + h / 2})`}
      >
        {isHC ? "2.896 m" : "2.591 m"}
      </text>

      <defs>
        <marker
          id="arr"
          markerWidth="5"
          markerHeight="5"
          refX="2.5"
          refY="2.5"
          orient="auto"
        >
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#94A3B8" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Spec Table ───────────────────────────────────────────────────────────────

function SpecTable({ specs }) {
  const grouped = {};
  specs.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0A1628] text-white">
            <th className="px-5 py-3.5 text-left font-semibold tracking-wide w-[30%]">
              Specification
            </th>
            <th className="px-5 py-3.5 text-left font-semibold tracking-wide w-[35%]">
              Metric
            </th>
            <th className="px-5 py-3.5 text-left font-semibold tracking-wide w-[35%]">
              Imperial (U.S.)
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([cat, rows]) => (
            <>
              <tr
                key={`hdr-${cat}`}
                className="bg-gray-50 border-t border-gray-100"
              >
                <td colSpan={3} className="px-5 py-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${categoryMeta[cat]?.color}`}
                  >
                    {categoryMeta[cat]?.label}
                  </span>
                </td>
              </tr>
              {rows.map((row, i) => (
                <tr
                  key={`${cat}-${i}`}
                  className="border-t border-gray-50 hover:bg-amber-50/40 transition-colors"
                >
                  <td className="px-5 py-2.5 text-gray-800 font-medium">
                    {row.label}
                  </td>
                  <td className="px-5 py-2.5 text-gray-600 font-mono text-xs">
                    {row.metric}
                  </td>
                  <td className="px-5 py-2.5 text-gray-500 font-mono text-xs">
                    {row.us || "—"}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Comparison Bar ───────────────────────────────────────────────────────────

function CapacityBar({ container }) {
  const maxCap = 76.4;
  const cap =
    container.id === "20ft" ? 33.2 : container.id === "40ft" ? 67.7 : 76.4;
  const pct = (cap / maxCap) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: container.color }}
        />
      </div>
      <span className="text-xs font-bold text-gray-500 w-14 text-right">
        {cap} m³
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StandardContainersPage() {
  const [activeTab, setActiveTab] = useState("20ft");
  const active = containers.find((c) => c.id === activeTab);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap");
        body {
          font-family: "DM Sans", sans-serif;
        }
        .fade-up {
          animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .tab-pill {
          transition: all 0.2s ease;
        }
        .tab-pill.active {
          background: #f59e0b;
          color: #fff;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
        }
        .highlight-card {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }
        .highlight-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
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
                <span className="text-white/60">Standard Containers</span>
              </nav>
              <div className="flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-amber-500" />
                <div>
                  <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-0.5">
                    Container Dimensions
                  </p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Standard Containers
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Stats ── */}
        <div className="bg-[#0A1628]">
          <div className="max-w-6xl mx-auto px-4 sm:px-14 py-5">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {containers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  className="px-4 py-3 text-center group cursor-pointer"
                >
                  <p
                    className="text-2xl font-black"
                    style={{
                      color:
                        activeTab === c.id ? c.color : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {c.id === "20ft"
                      ? "33.2"
                      : c.id === "40ft"
                        ? "67.7"
                        : "76.4"}
                    <span className="text-sm font-medium"> m³</span>
                  </p>
                  <p className="text-[11px] text-white/50 mt-0.5 group-hover:text-white/70 transition-colors">
                    {c.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* ── Intro Notice ── */}
          <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-200/60 rounded-2xl p-5 mb-10 flex gap-4">
            <div className="text-amber-500 text-2xl mt-0.5 flex-shrink-0">
              ℹ️
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                <span className="font-semibold text-gray-800">
                  General purpose containers
                </span>{" "}
                — the most versatile in the ONS fleet. Built from high-strength
                steel, these containers withstand temperatures from{" "}
                <span className="font-medium">−40°C to 70°C</span> without
                compromising structural integrity or water-tightness.
              </p>
              <p className="text-xs text-gray-400">
                ⚠ In exceptional cases, specifications may differ. Cargo must
                conform to dimensional regulations of the host country. Contact
                your local ONS representative for exact payload limits.
              </p>
            </div>
          </div>

          {/* ── Tab Navigation ── */}
          <div className="flex gap-2 flex-wrap mb-8">
            {containers.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`tab-pill flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${
                  activeTab === c.id
                    ? "active border-transparent"
                    : "border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {c.label}
                {c.badge && (
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-full text-white ${c.badgeColor} ${activeTab === c.id ? "opacity-100" : "opacity-60"}`}
                  >
                    {c.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Detail Panel ── */}
          <div key={activeTab} className="fade-up">
            {/* Top: Diagram + Description */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Diagram card */}
              <div className="bg-[#060F1D] rounded-3xl p-7 flex flex-col justify-between min-h-[300px]">
                {/* Container Photo at top */}
                <div className="relative flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden mb-5 h-44 border border-white/10">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at center, ${active.color}18 0%, transparent 70%)`,
                    }}
                  />
                  <Image
                    src={active.image}
                    alt={active.fullLabel}
                    width={420}
                    height={176}
                    className="relative z-10 max-h-36 w-auto object-contain drop-shadow-2xl"
                    onError={(e) => {
                      e.target.src = "/containers/placeholder-container.png";
                    }}
                  />
                  <span
                    className={`absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full text-white ${active.badgeColor}`}
                  >
                    {active.badge}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-amber-400 text-[10px] uppercase tracking-widest font-bold">
                      ONS Logistics
                    </p>
                    <h2 className="text-white text-base font-extrabold mt-0.5">
                      {active.fullLabel}
                    </h2>
                  </div>
                </div>

                {/* SVG Diagram */}
                <ContainerDiagram container={active} />

                {/* Capacity bar */}
                <div className="mt-4">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">
                    Volume vs. max capacity
                  </p>
                  <CapacityBar container={active} />
                </div>
              </div>

              {/* Description + highlights */}
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-bold text-[#0A1628] mb-3">
                    {active.fullLabel}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {active.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {active.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="highlight-card bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3"
                    >
                      <span className="text-2xl leading-none">{h.icon}</span>
                      <p className="text-xs text-gray-600 font-medium leading-snug">
                        {h.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spec Table */}
            <h3 className="text-base font-bold text-[#0A1628] mb-3 flex items-center gap-2">
              <span className="h-4 w-1 bg-amber-500 rounded-full inline-block" />
              Full Specifications
            </h3>
            <SpecTable specs={active.specs} />

            <p className="text-xs text-gray-400 italic mt-4">
              * Garment hanger bars, forklift pockets, and gooseneck tunnels are
              optional. Contact your local ONS representative for availability.
            </p>
          </div>

          {/* ── Other Container Types ── */}
          <div className="mt-14 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Other Container Types
            </p>
            <div className="flex flex-wrap gap-3">
              {containers
                .filter((c) => c.id !== activeTab)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab(c.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-amber-400 hover:text-amber-600 transition-all"
                  >
                    {c.fullLabel}
                    <span className="ml-2 text-gray-300 group-hover:text-amber-400">
                      →
                    </span>
                  </button>
                ))}
              <Link
                href="/container-dimensions/special"
                className="px-5 py-2.5 rounded-xl border border-[#0A1628] text-[#0A1628] text-sm font-semibold hover:bg-[#0A1628] hover:text-white transition-all"
              >
                View Special Containers →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
