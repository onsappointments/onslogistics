"use client";

import Image from "next/image";
import { Calendar, ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";

export default function AppointmentHero() {
  const scrollToForm = () => {
    document.getElementById("book-appointment")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const features = [
    { icon: <Calendar className="w-5 h-5" />, text: "Quick & Easy Booking" },
    { icon: <Clock className="w-5 h-5" />, text: "Flexible Time Slots" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Payment" },
  ];

  return (
    <section className="relative w-full min-h-screen overflow-hidden -mt-[72px] bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          rel="preload"
          src="/booking-bg.webp"
          alt="Book appointment with ONS Logistics"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-blue-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto min-h-screen px-4 sm:px-6 flex items-center">
          <div className="max-w-3xl py-24 sm:py-28">

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
              Book Your
              <span className="block text-blue-300 mt-2">Appointment</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-2xl text-blue-50 mb-8 leading-relaxed">
              Connect with our logistics experts to discuss your shipping and
              customs clearance needs.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <div className="text-blue-300">{feature.icon}</div>
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-1"
            >
              Book Now
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Payment Notice */}
            <div className="mt-8 flex gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 max-w-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-300 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium mb-1">
                  Confirmation Fee Required
                </p>
                <p className="text-blue-100 text-sm">
                  A small booking fee is required to confirm your appointment and
                  reserve your time slot.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">
              <Stat value="24/7" label="Available Support" />
              <Stat value="1000+" label="Consultations Done" />
              <Stat value="98%" label="Client Satisfaction" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (hidden on small devices) */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={scrollToForm}
          className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <span className="text-xs uppercase tracking-wider">
            Scroll to Book
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent group-hover:from-white" />
        </button>
      </div>

      {/* Decorative Blur (desktop only) */}
      <div className="hidden lg:block absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-blue-100">{label}</div>
    </div>
  );
}
