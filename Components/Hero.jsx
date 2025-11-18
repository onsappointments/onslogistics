"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";  // 


const images = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden bg-[#F5F5F7]">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={src}
              alt={`Hero ${i + 1}`}
              fill
              sizes="100vw"
              quality={100}
              className="object-cover object-center"
              priority={i === 0}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Overlay Text (Always on top) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30 z-20">
        <h1 className="text-5xl font-bold drop-shadow-xl">
          Smart Logistics for a Smarter Future
        </h1>
        <p className="mt-4 text-lg drop-shadow-md max-w-2xl">
          Efficient. Reliable. On-Time — Every Time.
        </p>
        <Link href="/#about">
       <button className="mt-6 bg-blue-600 px-6 py-3 rounded-full text-white hover:bg-blue-700 transition-all">
        About Us
      </button>
      </Link>

      </div>
    </div>
  );
}

