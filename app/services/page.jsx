"use client";
import ServiceHero from "../../Components/services/ServiceHero.jsx";
import IndustriesSection from "@/Components/services/IndustriesSection";
import GeoPresenceSection from "@/Components/services/GeoPresenceSection";
export default function ServicesPage() {
  return (
    <main className="bg-[#F5F5F7] scroll-smooth ">
      <ServiceHero />
      <GeoPresenceSection />
      <IndustriesSection />
    </main>
  );
}