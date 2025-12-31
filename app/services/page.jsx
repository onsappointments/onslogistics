"use client";
import ServiceHero from "../../Components/ServiceHero.jsx";
import ServiceSection from "../../Components/ServiceSection.jsx";
import servicesData from "../../data/servicesData.js";

export default function ServicesPage() {
  return (
    <main className="bg-[#F5F5F7] scroll-smooth ">
      <ServiceHero />

      <div
        className="max-w-7xl mx-auto bg-white/60 backdrop-blur-xl
                   rounded-[3rem]
                   shadow-[0_0_60px_rgba(0,0,0,0.06)]
                   p-15 md:p-20 space-y-20 mb-20"
      >
        {servicesData.map((service, index) => (
          <ServiceSection
            key={service.id}
            id={service.id}      
            title={service.title}
            description={service.description}
            image={service.image}
            reverse={index % 2 !== 0}
          />  
        ))}
      </div>
    </main>
  );
}