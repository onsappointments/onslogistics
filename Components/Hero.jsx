"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const images = [
  "/OnsLogistics1.jpg",
  "/OnsLogistics2.jpg",
  "/OnsLogistics3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#F5F5F7]">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={src}
              alt={`Global logistics and freight forwarding services by ONS Logistics – Hero image ${i + 1}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-black/30 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl">
          Smart Logistics for a Smarter Future
        </h1>

        <p className="mt-4 text-base md:text-lg text-white drop-shadow-md max-w-2xl">
          Efficient. Reliable. On-Time — Every Time.
        </p>

        <Link
          href="#about"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
        >
          About Us
        </Link>
      </div>
    </section>
  );
}
