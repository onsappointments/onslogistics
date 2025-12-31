"use client";
import { Plane, Ship, Truck, FileText, Globe, Briefcase, Package } from "lucide-react";

const services = [
  { id: "freight", name: "Freight Forwarding", icon: Ship },
  { id: "road", name: "Road Transportation", icon: Truck },
  { id: "sea", name: "Sea Cargo", icon: Globe },
  { id: "air", name: "Air Cargo", icon: Plane },
  { id: "licensing", name: "Licensing", icon: FileText },
  { id: "export", name: "Export / Import Consultation", icon: Briefcase },
  { id: "custom", name: "Custom Clearance", icon: Package },
];

export default function ServiceHero() {
  return (
    <section className="relative text-center py-44 overflow-hidden mb-28">
      {/* ✅ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/services-bg.jpg')", 
        }}
      />
      {/* ✅ Overlay to make text/icons visible */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ✅ Content */}
      <div className="relative z-10 text-white">
        <h2 className="text-4xl font-bold mb-12 drop-shadow-lg">OUR SERVICES</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {services.map(({ id, name, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className="group flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200"
            >
              <Icon className="w-8 h-8 text-blue-600 mb-2 group-hover:text-orange-500 transition" />
              <span className="text-sm text-gray-800 text-center">{name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
