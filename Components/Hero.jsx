"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const images = [
  "/OnsLogistics1.jpg",
  "/OnsLogistics2.jpg",
  "/OnsLogistics3.jpg",
];

const features = [
  "24/7 Tracking & Support",
  "Global Network Coverage",
  "Customs Clearance Experts"
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden -mt-[72px]  bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              rel="preload"
              src={src}
              alt={`Professional logistics and freight forwarding services by ONS Logistics – Hero image ${i + 1}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 z-20">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center">
          <div className="max-w-3xl">

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Smart Logistics for a
              <span className="block text-blue-300 mt-2">Smarter Future</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-blue-50 mb-8 leading-relaxed">
              Seamless supply chain solutions that deliver results.
              <span className="block mt-2 text-lg text-blue-100">
                Efficient • Reliable • On-Time — Every Time
              </span>
            </p>

            {/* Features List */}
            <div className="flex flex-wrap gap-4 mb-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/request-quote"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-1"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="#about"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/20 hover:border-white/50"
              >
                About Us
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-16  grid-cols-3 gap-8 lg:grid hidden">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">15+</div>
                <div className="text-sm text-blue-100">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">5000+</div>
                <div className="text-sm text-blue-100">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-blue-100">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:block">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}