import Container from "../ui/container";
import Section from "../ui/section";
import SectionHeading from "../ui/SectionHeading";

import ChallengeAccordion from "./ChallengeAccordian";
import { challengesData } from "./challenges.data";

export default function Challenges() {
  return (
    <Section
      id="customs-challenges"
      spacing="xl"
      background="white"
    >
      <Container>

        <SectionHeading
          eyebrow="Common Customs Challenges"
          title="Understand common customs challenges before they affect your shipment."
          description="Many customs delays can be avoided through careful planning, accurate documentation and a clear understanding of customs procedures. Explore some of the most common challenges businesses encounter during import and export customs clearance."
        />

        <div className="mt-20">
          <ChallengeAccordion
            items={challengesData}
          />
        </div>

      </Container>
    </Section>
  );
}