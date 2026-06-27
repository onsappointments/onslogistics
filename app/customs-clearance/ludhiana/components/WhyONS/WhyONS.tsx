import {
  CalendarClock,
  CircleHelp,
  FileText,
  MessagesSquare,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Container from "../ui/container";
import Section from "../ui/section";
import SectionHeading from "../ui/SectionHeading";

const features = [
  {
    title: "Documentation Accuracy",
    description:
      "Accurate customs documentation helps reduce avoidable clarification requests and keeps import and export processes moving efficiently.",
    value:
      "Well-prepared Commercial Invoices, Packing Lists, Bills of Entry and Shipping Bills form the foundation of smooth customs clearance.",
    icon: FileText,
  },
  {
    title: "Regulatory Compliance",
    description:
      "Every shipment has different customs requirements depending on the products, destination and applicable regulations.",
    value:
      "Preparing documentation with compliance in mind helps businesses navigate customs procedures with greater confidence.",
    icon: ShieldCheck,
  },
  {
    title: "Shipment Coordination",
    description:
      "Customs clearance works best when documentation, transportation and freight planning are coordinated together.",
    value:
      "Better coordination improves shipment visibility and reduces unnecessary waiting between milestones.",
    icon: Truck,
  },
  {
    title: "Single Point of Communication",
    description:
      "Businesses benefit from having one team coordinate customs documentation, shipment updates and logistics communication.",
    value:
      "This simplifies international shipment planning and reduces unnecessary back-and-forth communication.",
    icon: MessagesSquare,
  },
  {
    title: "Planning Before Cargo Arrives",
    description:
      "Preparing customs documentation before cargo reaches the terminal helps avoid last-minute issues.",
    value:
      "Early planning provides more time to review documents, identify missing information and prepare for customs processing.",
    icon: CalendarClock,
  },
  {
    title: "Practical Customs Guidance",
    description:
      "Whether you're importing for the first time or managing regular exports, understanding the customs process is valuable.",
    value:
      "Guidance throughout documentation, customs procedures and shipment planning helps businesses make informed decisions.",
    icon: CircleHelp,
  },
];

export default function WhyONS() {
  return (
    <Section spacing="xl" background="white">
      <Container>
        <SectionHeading
          eyebrow="Why Businesses Choose ONS Logistics"
          title="Built around preparation, compliance and shipment coordination."
          description="Successful customs clearance depends on more than filing documents. It requires careful planning, accurate information and coordination between customs procedures, transportation and documentation. Here's how ONS Logistics supports businesses throughout that journey."
        />

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-[32px] border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-8 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="leading-7 text-slate-700">
                    {feature.value}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}