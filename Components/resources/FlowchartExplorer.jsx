"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ZoomIn,
  ZoomOut,
  ArrowRight,
} from "lucide-react";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 72;
const HORIZONTAL_GAP = 340;
const VERTICAL_GAP = 120;

const TREE = {
  id: "root",
  label:
    "Global Shipping, Logistics, and Warehousing (India)",
  root: true,

  children: [
    {
      id: "ons",
      label: "ONS Logistics India Pvt Ltd",

      children: [
        {
          id: "core-services",
          label: "Core Services",

          children: [
            {
              id: "freight-forwarding",
              label:
                "Freight Forwarding (Sea, Air, Road)",
              children: [],
            },

            {
              id: "customs-clearance",
              label:
                "Customs Clearance & Compliance",
              children: [],
            },

            {
              id: "consultation",
              label:
                "Export/Import Consultation",
              children: [],
            },

            {
              id: "licensing",
              label:
                "Licensing & Documentation",
              children: [],
            },
          ],
        },

        {
          id: "capabilities",
          label: "Capabilities",

          children: [
            {
              id: "experience",
              label: "15+ Years Experience",
              children: [],
            },

            {
              id: "countries",
              label: "50+ Countries Served",
              children: [],
            },

            {
              id: "tracking",
              label: "24/7 Tracking & Support",
              children: [],
            },
          ],
        },

        {
          id: "Certifications",
          label: "Certifications",

          children: [
            {
              id: "MSME-Registered",
              label: "MSME Registered",
              children: [],
            },

            {
              id: "MTO-Registration",
              label: "MTO-Registration",
              children: [],
            },

            {
              id: "Concor-Empanelled-CHA",
              label:
                "Concor Empanelled CHA",
              children: [],
            },
          ],
        },
      ],
    },

    {
      id: "imports",
      label: "Import Process into India",

      children: [
        {
          id: "pre-import",
          label: "Pre-Import Setup",

          children: [
            {
              id: "iec",
              label:
                "IEC Registration (DGFT)",
              children: [],
            },

            {
              id: "gst",
              label: "GST & AD Code",
              children: [],
            },

            {
              id: "special-licenses",
              label:
                "Special Licenses (FSSAI, BIS, WPC)",
              children: [],
            },
          ],
        },

        {
          id: "Order-Shipping",
          label: "Order & Shipping",

          children: [
            {
              id: "Purchase-Order-Incoterms",
              label:
                "Purchase Order & Incoterms",
              children: [],
            },

            {
              id: "Payment",
              label:
                "Payment (LC or Advance)",
              children: [],
            },

            {
              id: "Shipping-Docs",
              label:
                "Shipping Docs (B/L, AWB, Invoice)",
              children: [],
            },
          ],
        },

        {
          id: "Customs-Clearance",
          label:
            "Customs Clearance (ICEGATE)",

          children: [
            {
              id: "IGM-Bill-Entry",
              label:
                "IGM & Bill of Entry (BOE) Filing",
              children: [],
            },

            {
              id: "Duty-Assessment-Payment",
              label:
                "Duty Assessment & Payment",
              children: [],
            },

            {
              id: "Examination-Out-Charge",
              label:
                "Examination & Out of Charge (OOC)",
              children: [],
            },
          ],
        },

        {
          id: "Final-Receipt",
          label: "Final Receipt",

          children: [
            {
              id: "Delivery-Order",
              label:
                "Delivery Order (DO)",
              children: [],
            },

            {
              id: "Warehouse-Transport",
              label:
                "Warehouse Transport",
              children: [],
            },
          ],
        },
      ],
    },

    {
      id: "exports",
      label: "Export Process from India",

      children: [
        {
          id: "Preparation",
          label: "Preparation",

          children: [
            {
              id: "Business-Registration-PAN",
              label:
                "Business Registration & PAN",
              children: [],
            },

            {
              id: "IEC-GST-Compliance",
              label:
                "IEC & GST Compliance",
              children: [],
            },

            {
              id: "Market-Research",
              label: "Market Research",
              children: [],
            },
          ],
        },

        {
          id: "Contract-Production",
          label:
            "Contract & Production",

          children: [
            {
              id: "Proforma-Invoice-Negotiation",
              label:
                "Proforma Invoice & Negotiation",
              children: [],
            },

            {
              id: "Manufacturing-Quality-Control",
              label:
                "Manufacturing & Quality Control",
              children: [],
            },

            {
              id: "Packaging-Labeling",
              label:
                "Packaging & Labeling",
              children: [],
            },
          ],
        },

        {
          id: "documentation",
          label: "Documentation",

          children: [
            {
              id: "commercial-invoice",
              label:
                "Commercial Invoice & Packing List",
              children: [],
            },

            {
              id: "bill-lading",
              label:
                "Bill of Lading / Airway Bill",
              children: [],
            },

            {
              id: "Certificate-of-Origin",
              label:
                "Certificate of Origin",
              children: [],
            },
          ],
        },

        {
          id: "Shipping-Payment",
          label:
            "Shipping & Payment",

          children: [
            {
              id: "Shipping-Bill-Filing",
              label:
                "Shipping Bill Filing",
              children: [],
            },

            {
              id: "Let-Export-Order",
              label:
                "Let Export Order (LEO)",
              children: [],
            },

            {
              id: "Bank-Document-Submission",
              label:
                "Bank Document Submission",
              children: [],
            },

            {
              id: "RBI-Foreign-Exchange-Realization",
              label:
                "RBI Foreign Exchange Realization",
              children: [],
            },
          ],
        },
      ],
    },

    {
      id: "warehousing",
      label: "Warehousing in India",

      children: [
        {
          id: "Licenses-Safety",
          label:
            "Licenses & Safety",

          children: [
            {
              id: "WDRA-Registration",
              label:
                "WDRA Registration",
              children: [],
            },

            {
              id: "Fire-Pollution-NOC",
              label:
                "Fire & Pollution NOC",
              children: [],
            },

            {
              id: "FSSAI-Bonded-Licenses",
              label:
                "FSSAI & Bonded Licenses",
              children: [],
            },
          ],
        },

        {
          id: "operations",
          label:
            "Operational Excellence",

          children: [
            {
              id: "wms",
              label:
                "Warehouse Management System (WMS)",
              children: [],
            },

            {
              id: "layout",
              label:
                "Unidirectional Flow Layout",
              children: [],
            },

            {
              id: "Principles",
              label:
                "F.A.C.T. Principles",
              children: [],
            },
          ],
        },

        {
          id: "Market-Trends",
          label:
            "Market Trends (2025–2026)",

          children: [
            {
              id: "Grade-A-Institutional-Parks",
              label:
                "Grade A Institutional Parks",
              children: [],
            },

            {
              id: "Manufacturing-E-commerce-Growth",
              label:
                "Manufacturing & E-commerce Growth",
              children: [],
            },

            {
              id: "Hubs-Pune-Mumbai-Nagpur-Delhi-NCR",
              label:
                "Hubs: Pune, Mumbai, Nagpur, Delhi-NCR",
              children: [],
            },
          ],
        },
      ],
    },

    {
      id: "sea-freight",
      label:
        "Sea Freight: India to USA",

      children: [
        {
          id: "service-options",
          label:
            "Service Options",

          children: [
            {
              id: "fcl",
              label:
                "FCL (Full Container Load)",
              children: [],
            },

            {
              id: "lcl",
              label:
                "LCL (Less than Container Load)",
              children: [],
            },
          ],
        },

        {
          id: "Transit-Timelines",
          label:
            "Transit Timelines",

          children: [
            {
              id: "West-Coast",
              label:
                "West Coast: ~50 Days Door-to-Door",
              children: [],
            },

            {
              id: "East-Coast",
              label:
                "East Coast: ~60 Days Door-to-Door",
              children: [],
            },
          ],
        },

        {
          id: "Critical-Compliance",
          label:
            "Critical Compliance",

          children: [
            {
              id: "ISF-Filing",
              label:
                "ISF Filing (24hr Rule)",
              children: [],
            },

            {
              id: "Fumigation-Certificate",
              label:
                "Fumigation Certificate",
              children: [],
            },

            {
              id: "DDP-vs-DAP-Terms",
              label:
                "DDP vs DAP Terms",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

function normalizeNode(node) {
  return {
    id: String(node?.id),
    label: String(node?.label),
    root: Boolean(node?.root),

    children: Array.isArray(
      node?.children
    )
      ? node.children.map(
          normalizeNode
        )
      : [],
  };
}

const SAFE_TREE =
  normalizeNode(TREE);

function countExpanded(
  node,
  expanded
) {
  if (!node) return 1;

  if (
    !expanded.has(node.id) ||
    node.children.length === 0
  ) {
    return 1;
  }

  return node.children.reduce(
    (total, child) => {
      return (
        total +
        countExpanded(
          child,
          expanded
        )
      );
    },
    1
  );
}

function buildLayout(
  node,
  expanded,
  depth = 0,
  startY = 0,
  nodes = [],
  lines = [],
  parent = null
) {
  const totalUnits =
    countExpanded(
      node,
      expanded
    );

  const totalHeight =
    totalUnits *
    VERTICAL_GAP;

  const x =
    depth *
      HORIZONTAL_GAP +
    120;

  const y =
    startY +
    totalHeight / 2 -
    VERTICAL_GAP / 2;

  nodes.push({
    id: node.id,
    x,
    y,
    label: node.label,
    root: node.root,
    hasChildren:
      node.children.length > 0,
  });

  if (parent) {
    lines.push({
      id: `${parent.id}-${node.id}`,

      x1:
        parent.x +
        NODE_WIDTH,

      y1:
        parent.y +
        NODE_HEIGHT / 2,

      x2: x,

      y2:
        y +
        NODE_HEIGHT / 2,
    });
  }

  if (
    expanded.has(node.id)
  ) {
    let currentY = startY;

    node.children.forEach(
      (child) => {
        const childHeight =
          countExpanded(
            child,
            expanded
          ) *
          VERTICAL_GAP;

        buildLayout(
          child,
          expanded,
          depth + 1,
          currentY,
          nodes,
          lines,
          {
            x,
            y,
            id: node.id,
          }
        );

        currentY +=
          childHeight;
      }
    );
  }

  return {
    nodes,
    lines,
  };
}

function NodeCard({
  node,
  expanded,
  onToggle,
}) {
  return (
    <div
      className={`
        absolute rounded-3xl border transition-all duration-500
        hover:-translate-y-1 hover:scale-[1.015]
        ${
          node.root
            ? "bg-gradient-to-br from-slate-800 to-blue-900 border-blue-200/10 text-white shadow-[0_10px_40px_rgba(15,23,42,0.18)]"
            : "bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] border-blue-300/20 text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]"
        }
      `}
      style={{
        width: NODE_WIDTH,
        minHeight:
          NODE_HEIGHT,
        left: node.x,
        top: node.y,
      }}
    >
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="text-sm font-semibold leading-relaxed">
          {node.label}
        </div>

        {node.hasChildren ? (
          <button
            type="button"
            onClick={() =>
              onToggle(node.id)
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition text-lg"
          >
            {expanded.has(
              node.id
            )
              ? "−"
              : "+"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function FlowchartExplorer({
  fullPage = false,
}) {
  const [expanded, setExpanded] =
    useState(
      new Set([
        "root",
        "ons",
        "imports",
        "exports",
        "warehousing",
        "sea-freight",
      ])
    );

  const [zoom, setZoom] =
    useState(1);

  const graph =
    useMemo(() => {
      return buildLayout(
        SAFE_TREE,
        expanded
      );
    }, [expanded]);

  function toggleNode(id) {
    setExpanded(
      (previous) => {
        const next =
          new Set(previous);

        if (
          next.has(id)
        ) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );
  }

  const width = Math.max(
    ...graph.nodes.map(
      (node) =>
        node.x +
        NODE_WIDTH +
        200
    ),
    1800
  );

  const height = Math.max(
    ...graph.nodes.map(
      (node) =>
        node.y +
        NODE_HEIGHT +
        200
    ),
    1200
  );

  return (
    <section
      className={
        fullPage
          ? "pt-6"
          : "mt-24"
      }
    >
      {!fullPage && (
        <div className="mb-10">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-5">
            Interactive Logistics
            Explorer
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Understand
                Logistics Visually
              </h2>

              <p className="text-slate-600 mt-4 text-lg leading-relaxed">
                Explore imports,
                exports, freight
                forwarding,
                warehousing,
                customs clearance,
                and shipping
                processes through
                an interactive
                logistics
                flowchart.
              </p>
            </div>

            <Link
              href="/resources/flowcharts"
              className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
            >
              Open Full Explorer

              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      <div className="relative pt-6">

        {/* FLOATING CONTROLS */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-3 py-2 shadow-sm">

            <button
              type="button"
              onClick={() =>
                setZoom((prev) =>
                  Math.max(
                    0.5,
                    prev - 0.1
                  )
                )
              }
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition"
            >
              <ZoomOut className="w-4 h-4 text-slate-700" />
            </button>

            <div className="px-3 text-sm font-medium text-slate-600 min-w-[70px] text-center">
              {Math.round(
                zoom * 100
              )}
              %
            </div>

            <button
              type="button"
              onClick={() =>
                setZoom((prev) =>
                  Math.min(
                    2,
                    prev + 0.1
                  )
                )
              }
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition"
            >
              <ZoomIn className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* FLOWCHART */}
        <div className="relative overflow-x-auto overflow-y-hidden">

          {/* GLOW */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[900px] h-[900px] rounded-full bg-blue-100/30 blur-3xl" />
          </div>

          <div
            className="relative mx-auto max-w-[1800px] origin-top transition-all duration-500"
            style={{
              width,
              height,
              transform: `scale(${zoom})`,
            }}
          >

            {/* CONNECTION LINES */}
            <svg
              width={width}
              height={height}
              className="absolute inset-0"
            >
              {graph.lines.map(
                (line) => {
                  const curveX =
                    (line.x1 +
                      line.x2) /
                    2;

                  return (
                    <path
                      key={line.id}
                      d={`M ${line.x1} ${line.y1} C ${curveX} ${line.y1}, ${curveX} ${line.y2}, ${line.x2} ${line.y2}`}
                      fill="none"
                      stroke="rgba(37,99,235,0.22)"
                      strokeWidth="2"
                      style={{
                        transition:
                          "all 500ms ease-in-out",
                      }}
                    />
                  );
                }
              )}
            </svg>

            {/* NODES */}
            {graph.nodes.map(
              (node) => {
                return (
                  <NodeCard
                    key={
                      node.id
                    }
                    node={node}
                    expanded={
                      expanded
                    }
                    onToggle={
                      toggleNode
                    }
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}