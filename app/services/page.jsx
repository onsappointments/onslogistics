import ServiceHero from "../../Components/ServiceHero.jsx";
import ServiceSection from "../../Components/ServiceSection.jsx";
import servicesData from "../../data/servicesData.js";

export default function ServicesPage() {
  return (
    <main className="bg-[#F5F5F7]">
      <ServiceHero />
      {servicesData.map((service, index) => (
        <ServiceSection
          key={service.id}
          id={service.id} // ✅ Added ID for smooth scroll
          title={service.title}
          description={service.description}
          image={service.image}
          reverse={index % 2 !== 0}
        />
      ))}
    </main>
  );
}
