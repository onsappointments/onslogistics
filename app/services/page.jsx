"use client";
import ServiceHero from "../../Components/services/ServiceHero.jsx";
import IndustriesSection from "@/components/services/IndustriesSection";
import GeoPresenceSection from "@/components/services/GeoPresenceSection";
export default function ServicesPage() {
  return (
    <main className="bg-[#F5F5F7] scroll-smooth ">
      <ServiceHero />
      <GeoPresenceSection />
      <IndustriesSection />
    </main>
  );
}