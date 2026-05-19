"use client";

import Image from "next/image";
import { Award } from "lucide-react";

export default function CertificationsSection() {
  const certifications = [
    {
      image: "/concor.png",
      text:
        "Concor's Empanelled CHA",
    },

    {
      image: "/crissCross.png",
      text: "Member",
    },

    {
      image: "/msme.png",
      text:
        "MSME Registered",
    },

    {
      image: "/dgos.png",
      text:
        "MTO Registration",
    },
  ];

  return (
    <section className="relative px-6 pb-24">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
            <Award className="w-4 h-4" />

            Certifications & Partnerships
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            Trusted & Certified
          </h3>
        </div>

        {/* CAROUSEL */}
        <div className="relative overflow-hidden">

          {/* LEFT FADE */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />

          {/* RIGHT FADE */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-loop">

            {[...certifications, ...certifications].map(
              (cert, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 lg:w-[280px] w-[200px] lg:mx-6 mx-2 group"
                >

                  <div className="p-8 transition-all duration-300 flex flex-col items-center">

                    <div className="relative w-full h-40 mb-4 flex items-center justify-center">

                      <Image
                        src={cert.image}
                        alt={cert.text}
                        width={200}
                        height={160}
                        className="object-contain transition-all duration-300"
                      />
                    </div>

                    {cert.text && (
                      <p className="text-sm font-medium text-gray-700 text-center">
                        {cert.text}
                      </p>
                    )}

                  </div>
                </div>
              )
            )}

          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes loop {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .animate-loop {
          animation: loop 15s linear infinite;
        }
      `}</style>

    </section>
  );
}