"use client"

import { useState } from "react";
import { Package, Ship, Search, MapPin, Clock, CheckCircle, TruckIcon, Anchor, Plane } from "lucide-react";

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
      <section className="relative w-full min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-blue-900/95" />
        
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

              {/* Features Pills */}
              <div className="flex flex-wrap gap-3 mb-12">
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">50K+</div>
                  <div className="text-sm text-blue-100">Active Shipments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">200+</div>
                  <div className="text-sm text-blue-100">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">99.8%</div>
                  <div className="text-sm text-blue-100">On-Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs uppercase tracking-wider">Scroll to Track</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* Tracking Form Section */}
      <section className="py-24 px-6 relative -mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Tracking Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40 mb-16">
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

      {/* Info Banner */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Need Help Tracking Your Shipment?
          </h3>
          <p className="text-blue-100 mb-6">
            Our customer support team is available 24/7 to assist you
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition shadow-lg">
            Contact Support
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ship className="w-7 h-7" />
                <span className="text-xl font-bold">ONS Logistics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for global logistics and freight forwarding.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sea Freight</a></li>
                <li><a href="#" className="hover:text-white transition">Air Cargo</a></li>
                <li><a href="#" className="hover:text-white transition">Road Transport</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Track Shipment</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 ONS Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
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