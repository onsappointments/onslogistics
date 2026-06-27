import Container from "../ui/container";
import Section from "../ui/section";
import SectionHeading from "../ui/SectionHeading";

import IndustryCard from "./IndustryCard";
import { industriesData } from "./industries.data";

export default function Industries() {
  return (
    <Section
      id="industries"
      spacing="xl"
      background="gray"
    >
      <Container>

        <SectionHeading
          eyebrow="Industry Expertise"
          title="Customs clearance experience across Ludhiana's major industries."
          description="Different industries have different documentation requirements, compliance considerations and shipment characteristics. Explore how customs requirements vary across some of Ludhiana's leading manufacturing and export sectors."
        />

        <div className="mt-20 space-y-14">
          {industriesData.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              reverse={index % 2 === 1}
            />
          ))}
        </div>

      </Container>
    </Section>
  );
}