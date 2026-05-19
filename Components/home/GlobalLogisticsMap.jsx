"use client";

import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Ship,
  Plane,
  Truck,
  Waves,
} from "lucide-react";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "/world.geojson";

const ports = [
  {
    name: "New York",
    coordinates: [-74.006, 40.7128],
  },

  {
    name: "Rotterdam",
    coordinates: [4.4777, 51.9244],
  },

  {
    name: "Mundra",
    coordinates: [69.7197, 22.8395],
  },

  {
    name: "Nhava Sheva",
    coordinates: [72.9497, 18.9498],
  },

  {
    name: "Dubai",
    coordinates: [55.2708, 25.2048],
  },

  {
    name: "Singapore",
    coordinates: [103.8198, 1.3521],
  },
];

const routes = [
  {
    from: [72.9497, 18.9498],
    to: [-74.006, 40.7128],
  },

  {
    from: [72.9497, 18.9498],
    to: [4.4777, 51.9244],
  },

  {
    from: [72.9497, 18.9498],
    to: [55.2708, 25.2048],
  },

  {
    from: [72.9497, 18.9498],
    to: [103.8198, 1.3521],
  },
];

export default function GlobalLogisticsMap() {
  return (
    <section className="relative px-6 py-24 overflow-hidden">

      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-white" />

      {/* GLOW */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-100/40 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-20">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            <Globe className="w-4 h-4" />
            Global Shipping Network
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Connecting Global Trade
            <span className="block text-blue-600">
              Across Oceans & Borders
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            ONS Logistics powers international shipping,
            customs clearance, freight forwarding,
            and supply chain movement across major
            global trade corridors.
          </p>
        </div>

        {/* MAP CONTAINER */}
        <div className="relative rounded-[40px] border border-slate-200 bg-white/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.08)] overflow-hidden">

          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#2563eb_1px,transparent_1px),linear-gradient(to_bottom,#2563eb_1px,transparent_1px)] bg-[size:80px_80px]" />

          {/* GLOW */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_65%)]" />

          <div className="relative h-[760px] touch-none">

            {/* MAP */}
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 170,
              }}
              className="w-full h-full"
            >

                <ZoomableGroup
                   center={[20, 20]}
                   zoom={1}
                   minZoom={1}
                   maxZoom={4}
                   className="cursor-grab active:cursor-grabbing"
                >

              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="rgba(37,99,235,0.06)"
                      stroke="#3b82f6"
                      strokeWidth={0.4}
                      style={{
                        default: {
                          outline: "none",
                        },

                        hover: {
                          fill:
                            "rgba(37,99,235,0.12)",
                          outline: "none",
                        },

                        pressed: {
                          outline: "none",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* ROUTES */}
              {routes.map((route, index) => (
                <Line
                  key={index}
                  from={route.from}
                  to={route.to}
                  stroke="url(#routeGradient)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              ))}

              {/* PORTS */}
              {ports.map((port) => (
                <Marker
                  key={port.name}
                  coordinates={port.coordinates}
                >

                  <g>

                    {/* PING */}
                    <circle
                      r={14}
                      fill="rgba(59,130,246,0.15)"
                    />

                    {/* OUTER */}
                    <circle
                      r={7}
                      fill="#ffffff"
                    />

                    {/* INNER */}
                    <circle
                      r={4}
                      fill="#2563eb"
                    />

                  </g>

                  {/* LABEL */}
                  <text
                    textAnchor="start"
                    y={-15}
                    x={10}
                    className="fill-slate-600 text-[11px] font-medium"
                  >
                    {port.name}
                  </text>

                </Marker>
              ))}

              {/* GRADIENT */}
              <defs>

                <linearGradient
                  id="routeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563eb"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22d3ee"
                  />
                </linearGradient>

              </defs>

              </ZoomableGroup>

            </ComposableMap>

            {/* TOP LEFT CARD */}
            <div className="absolute top-10 left-10 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl p-6 shadow-2xl">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Ship className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-3xl font-bold text-slate-900">
                    50+
                  </div>

                  <div className="text-sm text-slate-500">
                    Countries Served
                  </div>
                </div>

              </div>

              <div className="space-y-4 text-sm">

                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Waves className="w-4 h-4 text-blue-600" />
                    Sea Freight
                  </div>

                  <span className="font-semibold text-slate-900">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Plane className="w-4 h-4 text-blue-600" />
                    Air Freight
                  </div>

                  <span className="font-semibold text-slate-900">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Road Logistics
                  </div>

                  <span className="font-semibold text-slate-900">
                    Active
                  </span>
                </div>

              </div>

            </div>

            {/* RIGHT CARD */}
            <div className="absolute bottom-28 right-10 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl p-6 shadow-2xl max-w-sm">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <Plane className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-lg font-bold text-slate-900">
                    Global Freight Network
                  </div>

                  <div className="text-sm text-slate-500">
                    International Trade Corridors
                  </div>
                </div>

              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                From Indian ports to international markets,
                ONS Logistics manages multimodal freight,
                customs operations, and supply chain
                coordination across global shipping lanes.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                {[
                  "India → UAE",
                  "India → Europe",
                  "India → USA",
                  "India → Singapore",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {item}
                  </div>
                ))}

              </div>

              <Link
                href="/resources/flowchart"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
              >
                Explore Logistics Systems

                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

            {/* BOTTOM METRICS */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white/80 backdrop-blur-xl">

              <div className="grid grid-cols-2 md:grid-cols-4">

                {[
                  {
                    value: "5000+",
                    label:
                      "Shipments Delivered",
                  },

                  {
                    value: "99.8%",
                    label:
                      "On-Time Delivery",
                  },

                  {
                    value: "24/7",
                    label:
                      "Shipment Support",
                  },

                  {
                    value: "15+",
                    label:
                      "Years Experience",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-6 text-center border-r border-slate-200 last:border-r-0"
                  >

                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {item.value}
                    </div>

                    <div className="text-sm text-slate-500">
                      {item.label}
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}