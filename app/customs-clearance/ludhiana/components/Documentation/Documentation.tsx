import Container from "../ui/container";
import Section from "../ui/section";
import SectionHeading from "../ui/SectionHeading";

import DocumentationGrid from "./DocumentationGrid";
import { documentationData } from "./documentation.data";

export default function Documentation() {
  return (
    <Section
      id="documentation"
      spacing="xl"
      background="white"
    >
      <Container>

        <SectionHeading
          eyebrow="Documentation Intelligence"
          title="Understand the documents that power customs clearance."
          description="Every import and export shipment relies on accurate documentation. Rather than presenting a simple checklist, this section explains the role each document plays, when it is used, common mistakes businesses make and where you can learn more."
        />

        <div className="mt-20">
          <DocumentationGrid
            documents={documentationData}
          />
        </div>

      </Container>
    </Section>
  );
}