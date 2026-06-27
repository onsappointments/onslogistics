import Container from "../ui/container";
import Section from "../ui/section";
import SectionHeading from "../ui/SectionHeading";
import EntityGrid from "./EntityGrid";
import QuickAnswer from "./QuickAnswer";
import { overviewData } from "./overview.data";

export default function CustomsOverview() {
  return (
    <Section
      id="customs-overview"
      background="white"
      spacing="lg"
    >
      <Container>

        <SectionHeading
          eyebrow="Understanding Customs Clearance"
          title="Everything You Need to Know About Customs Clearance in Ludhiana"
          description="Whether you are importing raw materials, exporting finished products or shipping machinery overseas, customs clearance is one of the most important stages of international trade. Understanding the customs process helps businesses avoid unnecessary delays, documentation errors and additional costs."
        />

        {/* Editorial Introduction */}

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.35fr_420px]">

          <div className="space-y-6">

            <p className="text-lg leading-8 text-slate-600">
              Customs clearance is the legal process through which imported
              and exported goods are examined, documented and approved by
              Customs authorities before they are allowed to enter or leave
              the country. Every shipment must comply with applicable customs
              regulations, documentation requirements and duty obligations.
            </p>

            <p className="text-lg leading-8 text-slate-600">
              Businesses operating through Ludhiana frequently move cargo
              through nearby Inland Container Depots (ICDs) and logistics
              facilities. Proper planning, accurate documentation and timely
              customs filing help reduce shipment delays while ensuring
              compliance with Indian Customs procedures.
            </p>

            <p className="text-lg leading-8 text-slate-600">
              This guide explains the essential customs clearance services,
              required documents, common compliance requirements and practical
              considerations for importers and exporters. Each section is
              designed to answer common business questions while helping you
              understand how customs clearance works in practice.
            </p>

          </div>

          <div>

            <QuickAnswer>
              Customs clearance is the process of preparing customs
              documentation, filing declarations, completing customs
              assessment, paying applicable duties and obtaining permission
              for imported or exported goods to move through Customs in
              accordance with applicable regulations.
            </QuickAnswer>

          </div>

        </div>

        {/* Entity Cards */}

        <EntityGrid items={overviewData} />

      </Container>
    </Section>
  );
}