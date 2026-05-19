"use client";

import HeroSection from "@/Components/home/HeroSection";
import AboutSection from "@/Components/home/AboutSection";
import KnowledgeHubGateway from "@/Components/home/KnowledgeHubGateway";
import CertificationsSection from "@/Components/home/CertificationsSection";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-white via-blue-50/30 to-white">

      <HeroSection />

      <AboutSection />

      <KnowledgeHubGateway />

      <CertificationsSection />

    </main>
  );
}