import DocumentCard from "./DocumentationCard";
import { CustomsDocument } from "./types";

interface DocumentationGridProps {
  documents: CustomsDocument[];
}

const SECTION_ORDER = [
  {
    id: "essential",
    title: "Essential Customs Documents",
    description:
      "These are the primary documents used during import and export customs clearance and are reviewed for almost every shipment.",
    matcher: (document: CustomsDocument) =>
      [
        "commercial-invoice",
        "packing-list",
        "bill-of-entry",
        "shipping-bill",
      ].includes(document.id),
  },

  {
    id: "compliance",
    title: "Business Registration & Compliance",
    description:
      "Business registrations and regulatory documents help establish eligibility to carry out import and export transactions where applicable.",
    matcher: (document: CustomsDocument) =>
      ["iec", "ad-code"].includes(document.id),
  },

  {
    id: "transport",
    title: "Transport Documents",
    description:
      "Transport documents identify how cargo moves through the logistics network and support shipment handling.",
    matcher: (document: CustomsDocument) =>
      [
        "bill-of-lading",
        "air-waybill",
        "certificate-of-origin",
      ].includes(document.id),
  },
];

export default function DocumentationGrid({
  documents,
}: DocumentationGridProps) {
  return (
    <div className="space-y-20">
      {SECTION_ORDER.map((section) => {
        const sectionDocuments = documents.filter(section.matcher);

        if (!sectionDocuments.length) return null;

        return (
          <section
            key={section.id}
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="max-w-3xl">
              <h3
                id={`${section.id}-heading`}
                className="text-3xl font-bold tracking-tight text-slate-900"
              >
                {section.title}
              </h3>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {section.description}
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {sectionDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}