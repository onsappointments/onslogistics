import ServiceHero from "../../components/ServiceHero";
import ServiceSection from "../../components/ServiceSection";
import servicesData from "../../data/servicesData";

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
