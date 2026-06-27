import { ChallengeItem } from "./types";

export const challengesData: ChallengeItem[] = [
  {
    id: "hs-code-classification",

    title: "HS Code Classification",

    shortDescription:
      "Selecting the appropriate HS Code is an important part of customs declarations for imported and exported goods.",

    explanation:
      "The Harmonized System (HS) Code is used to classify products for customs purposes. Product classification influences customs procedures, applicable duties and regulatory requirements. Selecting an inappropriate classification may lead to additional customs queries or reassessment depending on the circumstances.",

    whyItHappens:
      "Businesses may rely on generic product descriptions, outdated classifications or assumptions instead of reviewing the product's actual specifications.",

    businessImpact:
      "Incorrect classification can result in delays, additional clarification requests and changes to customs assessment.",

    howToPrepare:
      "Review technical product specifications, maintain consistent product descriptions across documents and verify the applicable classification before filing customs documentation.",

    onsSupport:
      "ONS Logistics assists businesses in reviewing shipment documentation and preparing customs declarations with appropriate product information.",

    relatedTopics: [
      "HS Code Guide",
      "Bill of Entry",
      "Import Duty",
      "Shipping Bill",
    ],

    learnMoreHref: "/resources/hs-code-explained-indian-importers-exporters",
  },

  {
    id: "documentation-mismatch",

    title: "Documentation Inconsistencies",

    shortDescription:
      "Differences between shipment documents are a common reason customs authorities request clarification.",

    explanation:
      "Product descriptions, quantities, values and shipment details should remain consistent across documents such as the Commercial Invoice, Packing List and customs declarations.",

    whyItHappens:
      "Documents are often prepared by different departments or suppliers, resulting in inconsistent information.",

    businessImpact:
      "Additional clarification requests may delay customs processing until documentation is verified.",

    howToPrepare:
      "Cross-check all commercial and shipping documents before customs filing and confirm that descriptions, quantities and values match.",

    onsSupport:
      "ONS Logistics reviews documentation before customs filing to identify inconsistencies and reduce avoidable queries.",

    relatedTopics: [
      "Commercial Invoice",
      "Packing List",
      "Documentation Guide",
    ],

    learnMoreHref: "/resources/commercial-invoice-vs-packing-list-explained",
  },

  {
    id: "customs-assessment",

    title: "Customs Assessment Queries",

    shortDescription:
      "Customs authorities may request additional information during the assessment process.",

    explanation:
      "During assessment, customs officers may seek clarification regarding product descriptions, valuation, classification or supporting documentation depending on the shipment.",

    whyItHappens:
      "Incomplete declarations or insufficient supporting information may require further review.",

    businessImpact:
      "Responding promptly with complete supporting documents helps the assessment process continue efficiently.",

    howToPrepare:
      "Maintain organised shipment records and ensure supporting documentation is readily available.",

    onsSupport:
      "ONS Logistics coordinates documentation and communication during the customs clearance process.",

    relatedTopics: [
      "Assessment",
      "ICEGATE",
      "Bill of Entry",
    ],

    learnMoreHref: "/resources/goods-stuck-at-customs-india-what-happens",
  },

  {
    id: "import-duty-planning",

    title: "Import Duty Planning",

    shortDescription:
      "Understanding customs duties before cargo arrives supports better financial planning.",

    explanation:
      "Import costs may include customs duty, applicable taxes and other charges depending on the shipment and prevailing regulations.",

    whyItHappens:
      "Businesses sometimes estimate costs without considering the complete customs assessment process.",

    businessImpact:
      "Unexpected import costs can affect budgeting, inventory planning and overall supply chain decisions.",

    howToPrepare:
      "Estimate customs costs before shipment dispatch and review applicable customs requirements during purchase planning.",

    onsSupport:
      "ONS Logistics provides guidance on customs documentation and helps businesses understand the customs clearance process.",

    relatedTopics: [
      "Import Duty",
      "HS Code",
      "Assessment",
    ],

    learnMoreHref: "/resources/import-duties-in-india-explained",
  },

  {
    id: "shipment-delays",

    title: "Shipment Delays",

    shortDescription:
      "Delays may occur when documentation, transportation and customs activities are not well coordinated.",

    explanation:
      "International shipments involve multiple stakeholders including suppliers, carriers, customs authorities, logistics providers and consignees. Coordination across these stages is important for efficient cargo movement.",

    whyItHappens:
      "Late documentation, missing information or scheduling gaps can affect shipment timelines.",

    businessImpact:
      "Longer transit and clearance times may influence inventory availability and production schedules.",

    howToPrepare:
      "Prepare documentation before cargo arrival and coordinate shipment milestones with all stakeholders.",

    onsSupport:
      "ONS Logistics coordinates customs clearance together with freight forwarding and transportation planning.",

    relatedTopics: [
      "Freight Forwarding",
      "Transportation",
      "Documentation",
    ],

    learnMoreHref: "/services/freight-forwarding-explained-india",
  },

  {
    id: "restricted-goods",

    title: "Restricted or Regulated Goods",

    shortDescription:
      "Certain goods may require additional licences, approvals or certificates before import or export.",

    explanation:
      "Some product categories are subject to specific regulatory requirements. The applicable documentation depends on the nature of the goods and relevant regulations.",

    whyItHappens:
      "Businesses may not realise that specialised approvals are required until shipment planning has already begun.",

    businessImpact:
      "Missing approvals can delay customs processing until the necessary documentation is available.",

    howToPrepare:
      "Identify regulatory requirements during procurement or export planning rather than after shipment dispatch.",

    onsSupport:
      "ONS Logistics assists businesses in identifying documentation requirements relevant to their shipments.",

    relatedTopics: [
      "Import Licence",
      "DGFT",
      "Compliance",
    ],

    learnMoreHref: "/resources/import-process-in-india-step-by-step",
  },
];