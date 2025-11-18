"use client";

import Image from "next/image";

export default function ServiceSection({ id, title, description, image, reverse }) {
  return (
    <section
      id={id}
      className={`bg-[#F5F5F7] flex flex-col md:flex-row items-center justify-between 
                  px-8 md:px-16 py-20 gap-12 transition-all duration-700 ease-out
                  ${reverse ? "md:flex-row-reverse" : ""}`}
    >
      {/* 🖼️ Image Section */}
      <div className="relative w-full md:w-1/2 h-[320px] md:h-[420px] 
                      rounded-3xl overflow-hidden shadow-lg 
                      hover:scale-[1.02] transition-transform duration-700 ease-out">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-3xl transition-all duration-700 hover:brightness-110"
        />
      </div>

      {/* 🧊 Description Card */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div
          className="relative bg-white/80 backdrop-blur-2xl border border-white/30 
                     shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[2rem] 
                     p-8 md:p-10 max-w-lg transition-all duration-500 
                     hover:shadow-[0_12px_50px_rgba(0,0,0,0.15)] hover:scale-[1.02]
                     animate-fadeInUp"
        >
          {/* Subtle overlay gradient for glass effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 
                          rounded-[2rem] pointer-events-none"></div>

          <h2
            className="font-[600] text-[2rem] md:text-[2.5rem] text-[#1d1d1f]
                       tracking-tight leading-snug font-['SF Pro Display'] mb-4 z-10 relative"
          >
            {title}
          </h2>

          <p
            className="font-[400] text-[1.05rem] md:text-[1.15rem] text-[#515154]
                       leading-relaxed font-['SF Pro Text'] max-w-md z-10 relative"
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
