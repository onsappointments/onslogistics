"use client"

import { useState } from "react";
import { Package, Ship, Search, MapPin, Clock, CheckCircle, TruckIcon, Anchor, Plane, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function TrackingLandingPage() {
  const [reference, setReference] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!reference.trim()) {
      alert("Please enter a tracking reference");
      return;
    }

    setIsTracking(true);
    setTimeout(() => {
      alert(`Tracking: ${reference.trim().toUpperCase()}`);
      setIsTracking(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section with Background */}
      <section className="relative w-full min-h-[85vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/track-shipment.webp"
            alt="Track your shipment with ONS Logistics"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-blue-900/30" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-20">

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
                <MapPin className="w-4 h-4" />
                Real-Time Tracking
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                Track Your
                <span className="block text-blue-300 mt-2">Shipment</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-50 mb-10 leading-relaxed">
                Monitor your containers and shipments in real-time across the globe.
              </p>

              <a
              href={"#tracking"}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-1"
            >
              Track Now
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
            </a>

              {/* Features Pills */}
              <div className="flex flex-wrap gap-3 mb-12 mt-8">
                {[
                  { icon: <Clock className="w-5 h-5" />, text: "24/7 Updates" },
                  { icon: <MapPin className="w-5 h-5" />, text: "Global Coverage" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Instant Alerts" }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    <div className="text-blue-300">{feature.icon}</div>
                    <span className="text-white text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Form Section */}
      <section id="tracking" className="py-24 px-6 relative -mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Tracking Card */}
          <div  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                Track Your Shipment
              </h2>
              <p className="text-lg text-gray-600">
                Enter Container No, BL No, Booking No, or Invoice No
              </p>
            </div>

            {/* Tracking Input */}
            <div className="space-y-5">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter tracking reference (e.g. MRKU8365035)"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition text-gray-900 placeholder-gray-400"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isTracking}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isTracking ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Package className="w-6 h-6" />
                    Track Shipment
                  </>
                )}
              </button>
            </div>

            {/* Example References */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Example references:</p>
              <div className="flex flex-wrap gap-2">
                {["MRKU8365035", "BL20250123", "BKG889900", "INV-98231"].map((example) => (
                  <button
                    key={example}
                    onClick={() => setReference(example)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard
              icon={<TruckIcon className="w-8 h-8 text-blue-600" />}
              title="Road Transport"
              description="Track your ground shipments across highways and borders."
            />
            <ServiceCard
              icon={<Anchor className="w-8 h-8 text-blue-600" />}
              title="Sea Freight"
              description="Monitor container vessels and port-to-port deliveries."
            />
            <ServiceCard
              icon={<Plane className="w-8 h-8 text-blue-600" />}
              title="Air Cargo"
              description="Real-time updates for express air freight shipments."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}