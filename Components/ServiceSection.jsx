"use client";
import Image from "next/image";

export default function ServiceSection({
  id,
  title,
  description,
  image,
  reverse,
}) {
  return (
    <section id={id} className="scroll-mt-32 ">
      <div
        className={`flex flex-col md:flex-row items-stretch gap-14
                    ${reverse ? "md:flex-row-reverse" : ""}`}
      >
        {/* Image Container */}
        <div className="relative w-full md:w-1/2 rounded-3xl overflow-hidden shadow-lg flex-1
                        transition-transform duration-700 hover:scale-[1.02]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-700 hover:brightness-110"
          />
        </div>

        {/* Text Container */}
        <div className="relative w-full md:w-1/2 flex-1 rounded-[2.5rem]
                        p-8 md:p-10 backdrop-blur-2xl flex flex-col justify-center">
          <div className="absolute inset-0 rounded-[2.5rem]
                          pointer-events-none z-0" />

          <h2 className="relative z-10 text-2xl md:text-4xl font-semibold
                         text-[#1d1d1f] tracking-tight mb-4">
            {title}
          </h2>

          <p className="relative z-10 text-[#3a3a3c]
                         leading-relaxed text-base md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}