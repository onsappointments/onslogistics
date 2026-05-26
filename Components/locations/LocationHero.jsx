// Components/locations/LocationHero.jsx

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LocationHero({ data }) {
  return (
    <section className="relative h-screen min-h-[780px] flex items-center overflow-hidden">

      {/* BG IMAGE */}
      <Image
        src={data.heroImage}
        alt={data.title}
        fill
        priority
        className="object-cover"
      />
       <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent"></div>
       
      {/* GLOW */}
      <div className="absolute top-24 right-10 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        <div className="max-w-4xl">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 mb-8">

            <CheckCircle2 className="w-4 h-4 text-blue-300" />

            <span className="text-sm text-white font-medium">
              Regional Logistics Solutions
            </span>

          </div>

          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
            {data.title}
          </h1>

          {/* SUBTITLE */}
          <p className="mt-8 text-lg md:text-2xl leading-relaxed text-blue-50 max-w-3xl">
            {data.subtitle}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <Link
              href="/request-quote"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-blue-700 px-8 py-4 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-2xl"
            >
              Get Freight Quote

              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/book-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white px-8 py-4 font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Book Consultation
            </Link>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">

            {data.stats.map((item) => (

              <div key={item.label}>

                <div className="text-3xl md:text-4xl font-bold text-white">
                  {item.value}
                </div>

                <div className="text-sm text-blue-100 mt-1">
                  {item.label}
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}