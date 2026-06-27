"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  MapPin,
  ShieldCheck,
  ShipWheel,
  Truck,
} from "lucide-react";

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const slowFloat = {
  y: [0, 6, 0],
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[620px]">

      {/* Background Card */}

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-xl"
      >
        {/* Decorative */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-40" />

        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-sky-100 blur-3xl opacity-40" />

        <div className="relative p-8">

          {/* Top Status */}

          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Customs Dashboard
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Shipment Ready
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 px-4 py-2 text-green-700 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">
                  Compliance Verified
                </span>
              </div>
            </div>

          </div>

          {/* Illustration */}

          <div className="relative h-[420px]">

            {/* Ground */}

            <div className="absolute bottom-0 left-0 right-0 h-4 rounded-full bg-slate-100" />

            {/* Warehouse */}

            <div className="absolute bottom-12 left-1/2 w-72 -translate-x-1/2">

              <div className="rounded-t-3xl bg-slate-800 px-8 py-5">

                <div className="flex justify-center">
                  <ShipWheel className="h-8 w-8 text-white" />
                </div>

              </div>

              <div className="rounded-b-3xl border border-slate-200 bg-white p-8">

                <div className="grid grid-cols-4 gap-3">

                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded bg-slate-100"
                    />
                  ))}

                </div>

              </div>

            </div>

            {/* Container */}

            <motion.div
              animate={floatAnimation}
              className="absolute bottom-10 left-8"
            >
              <div className="rounded-2xl border border-blue-200 bg-blue-600 px-7 py-6 shadow-lg">

                <div className="space-y-2">

                  <div className="h-2 w-20 rounded bg-blue-300" />

                  <div className="h-2 w-24 rounded bg-blue-300" />

                  <div className="h-2 w-16 rounded bg-blue-300" />

                </div>

              </div>

            </motion.div>

            {/* Truck */}

            <motion.div
              animate={slowFloat}
              className="absolute bottom-10 right-4"
            >

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">

                <Truck className="h-12 w-12 text-slate-700" />

              </div>

            </motion.div>

            {/* Document */}

            <motion.div
              animate={floatAnimation}
              className="absolute left-0 top-10"
            >

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

                <div className="mb-3 flex items-center gap-2">

                  <FileText className="h-5 w-5 text-blue-600" />

                  <span className="font-semibold text-slate-900">
                    Bill of Entry
                  </span>

                </div>

                <div className="space-y-2">

                  <div className="h-2 w-28 rounded bg-slate-200" />

                  <div className="h-2 w-20 rounded bg-slate-200" />

                  <div className="h-2 w-24 rounded bg-slate-200" />

                </div>

              </div>

            </motion.div>

            {/* Shipping Bill */}

            <motion.div
              animate={slowFloat}
              className="absolute right-0 top-20"
            >

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

                <div className="mb-3 flex items-center gap-2">

                  <ShieldCheck className="h-5 w-5 text-emerald-600" />

                  <span className="font-semibold text-slate-900">
                    Shipping Bill
                  </span>

                </div>

                <div className="space-y-2">

                  <div className="h-2 w-24 rounded bg-slate-200" />

                  <div className="h-2 w-28 rounded bg-slate-200" />

                  <div className="h-2 w-16 rounded bg-slate-200" />

                </div>

              </div>

            </motion.div>

            {/* Location */}

            <motion.div
              animate={floatAnimation}
              className="absolute bottom-40 left-1/2 -translate-x-1/2"
            >

              <div className="flex items-center gap-3 rounded-full border border-blue-200 bg-white px-5 py-3 shadow-xl">

                <MapPin className="h-5 w-5 text-blue-600" />

                <span className="font-semibold text-slate-800">
                  Ludhiana
                </span>

              </div>

            </motion.div>

          </div>

          {/* Bottom Stats */}

          <div className="mt-8 grid grid-cols-3 gap-4">

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Import
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                Clearance
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Export
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                Documentation
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                ICEGATE
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                Assistance
              </p>

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
}