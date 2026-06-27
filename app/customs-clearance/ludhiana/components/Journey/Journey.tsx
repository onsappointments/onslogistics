"use client";

import { useEffect, useMemo, useState } from "react";

import Container from "../ui/container";
import ProcessNavigator, {
  ProcessNavigatorItem,
} from "../ui/ProcessNavigator";
import Section from "../ui/section";
import SectionHeading from "../ui/SectionHeading";
import SegmentedControl from "../ui/SegmentedControl";

import JourneyDetails from "./JourneyDetails";
import { exportJourney, importJourney } from "./Journey.data";
import { JourneyType } from "./types";

export default function Journey() {
  const [journeyType, setJourneyType] =
    useState<JourneyType>("import");

  const journeySteps = useMemo(
    () =>
      journeyType === "import"
        ? importJourney
        : exportJourney,
    [journeyType]
  );

  const [activeStepId, setActiveStepId] = useState(
    journeySteps[0].id
  );

  useEffect(() => {
    setActiveStepId(journeySteps[0].id);
  }, [journeySteps]);

  const navigatorItems: ProcessNavigatorItem[] =
    useMemo(
      () =>
        journeySteps.map((step) => ({
          id: step.id,
          title: `${step.stepNumber}. ${step.title}`,
          description: step.shortDescription,
        })),
      [journeySteps]
    );

  const activeStep =
    journeySteps.find(
      (step) => step.id === activeStepId
    ) ?? journeySteps[0];

  return (
    <Section
      id="customs-process"
      background="gray"
      spacing="xl"
    >
      <Container>
        <SectionHeading
          eyebrow="Customs Clearance Process"
          title="Understand every stage of your shipment's customs journey."
          description="Whether you're importing raw materials or exporting finished goods, every shipment follows a structured customs process. Explore each stage below to understand what happens, which documents are involved, common issues, and how ONS Logistics supports businesses throughout the clearance journey."
        />

        <div className="mt-12 flex justify-center">
          <SegmentedControl
            value={journeyType}
            onChange={(value) =>
              setJourneyType(value)
            }
            options={[
              {
                value: "import",
                label: "Import Journey",
                description: "Bill of Entry",
              },
              {
                value: "export",
                label: "Export Journey",
                description: "Shipping Bill",
              },
            ]}
          />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[360px,1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <ProcessNavigator
              items={navigatorItems}
              activeId={activeStepId}
              onChange={setActiveStepId}
            />
          </div>

          <JourneyDetails
            step={activeStep}
          />
        </div>
      </Container>
    </Section>
  );
}