import { CustomsDocument } from "./types";

export const documentationData: CustomsDocument[] = [
  {
    id: "commercial-invoice",
    title: "Commercial Invoice",

    category: "common",
    group: "essential",
    importance: "essential",
    priority: 1,

    description:
      "The Commercial Invoice is the primary commercial document issued by the seller describing goods being imported or exported.",

    purpose:
      "It enables customs authorities to verify transaction value, product descriptions, quantities, buyer details and seller information during customs assessment.",

    issuedBy: "Exporter or Supplier",

    requiredFor: ["import", "export"],

    usedDuring: "Documentation Review",

    expertTip:
      "Ensure product descriptions, invoice values, currency and Incoterms remain consistent across every shipment document.",

    commonMistake:
      "Using generic product descriptions that don't match the Packing List or purchase order.",

    summary:
      "The Commercial Invoice is the primary commercial document used by customs authorities to determine shipment value and verify import or export declarations.",

    authority: {
      name: "Indian Customs",
    },

    learnMoreHref: "/resources/commercial-invoice-vs-packing-list-explained",

    relatedEntities: [
      "Invoice Value",
      "Customs Valuation",
      "Packing List",
      "Incoterms",
    ],

    searchIntent: "informational",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Additional commercial documents may be requested depending on shipment type and applicable regulations.",
  },

  {
    id: "packing-list",

    title: "Packing List",

    category: "common",
    group: "essential",
    importance: "essential",
    priority: 2,

    description:
      "The Packing List provides detailed packing information including package count, carton numbers, dimensions, weights and packaging configuration.",

    purpose:
      "It assists customs officers, freight forwarders and warehouse operators during cargo verification and examination.",

    issuedBy: "Exporter or Authorized Representative",

    requiredFor: ["import", "export"],

    usedDuring: "Documentation Review",

    expertTip:
      "Verify carton numbers and package weights before cargo leaves the warehouse.",

    commonMistake:
      "Packing quantities differ from the Commercial Invoice.",

    summary:
      "The Packing List helps customs verify shipment contents and supports logistics handling throughout transportation.",

    authority: {
      name: "Indian Customs",
    },

    learnMoreHref: "/resources/commercial-invoice-vs-packing-list-explained",

    relatedEntities: [
      "Commercial Invoice",
      "Gross Weight",
      "Net Weight",
      "Cargo Examination",
    ],

    searchIntent: "informational",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Packing Lists should accurately reflect the final shipment configuration.",
  },

  {
    id: "bill-of-entry",

    title: "Bill of Entry",

    category: "import",
    group: "essential",
    importance: "essential",
    priority: 3,

    description:
      "The Bill of Entry is the primary customs declaration filed for imported goods before customs assessment and clearance.",

    purpose:
      "It enables customs authorities to assess duties, verify declarations, classify imported goods and process customs clearance.",

    issuedBy:
      "Importer or Licensed Customs Broker through the customs filing system.",

    requiredFor: ["import"],

    usedDuring: "Import Customs Clearance",

    expertTip:
      "Review HS Code classification and supporting documentation before filing.",

    commonMistake:
      "Incorrect HS Code selection leading to reassessment or customs queries.",

    summary:
      "The Bill of Entry is the principal customs declaration required for import clearance in India.",

    authority: {
      name: "Indian Customs",
    },

    learnMoreHref: "/resources/import-duties-in-india-explained",

    relatedEntities: [
      "ICEGATE",
      "HS Code",
      "Import Duty",
      "Assessment",
      "Out of Charge",
    ],

    searchIntent: "commercial",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Additional declarations may be required depending on product category and applicable regulations.",
  },

  {
    id: "shipping-bill",

    title: "Shipping Bill",

    category: "export",
    group: "essential",
    importance: "essential",
    priority: 4,

    description:
      "The Shipping Bill is the primary customs declaration used for export customs clearance.",

    purpose:
      "It enables customs authorities to verify export declarations before cargo departs India.",

    issuedBy:
      "Exporter or Licensed Customs Broker through the customs filing system.",

    requiredFor: ["export"],

    usedDuring: "Export Customs Clearance",

    expertTip:
      "Verify invoice descriptions before filing the Shipping Bill.",

    commonMistake:
      "Using inconsistent product descriptions across export documents.",

    summary:
      "The Shipping Bill is the principal customs declaration required before export cargo can be processed.",

    authority: {
      name: "Indian Customs",
    },

    learnMoreHref: "/resources/what-is-a-shipping-bill-in-india",

    relatedEntities: [
      "ICEGATE",
      "Let Export Order",
      "Export Clearance",
      "DGFT",
    ],

    searchIntent: "commercial",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Export incentive declarations should be verified before filing where applicable.",
  },

  {
    id: "iec",

    title: "Importer Exporter Code (IEC)",

    category: "common",
    group: "compliance",
    importance: "essential",
    priority: 5,

    description:
      "The Importer Exporter Code (IEC) is a business identification number required for most import and export transactions in India.",

    purpose:
      "It identifies businesses engaged in international trade for customs and regulatory purposes.",

    issuedBy: "Director General of Foreign Trade (DGFT)",

    authority: {
      name: "Director General of Foreign Trade",
      shortName: "DGFT",
    },

    requiredFor: ["import", "export"],

    usedDuring: "Business Registration",

    expertTip:
      "Ensure IEC details remain updated whenever business information changes.",

    commonMistake:
      "Planning import or export transactions before obtaining an IEC where required.",

    summary:
      "The IEC identifies businesses engaged in cross-border trade and is required for most import and export activities.",

    learnMoreHref: "/resources/iec-code-india-how-to-get",

    relatedEntities: [
      "DGFT",
      "Importer",
      "Exporter",
      "Business Registration",
    ],

    searchIntent: "informational",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Certain categories of importers or exporters may be subject to different regulatory requirements.",
  },
    {
    id: "ad-code",

    title: "Authorised Dealer (AD) Code",

    category: "export",
    group: "compliance",
    importance: "recommended",
    priority: 6,

    description:
      "The Authorised Dealer (AD) Code links export transactions with the exporter's authorised bank for customs and foreign exchange procedures.",

    purpose:
      "It enables customs and banking systems to identify the authorised bank handling export proceeds.",

    issuedBy: "Authorised Dealer Bank",

    authority: {
      name: "Reserve Bank of India",
      shortName: "RBI",
    },

    requiredFor: ["export"],

    usedDuring: "Export Registration",

    expertTip:
      "Register the AD Code with the appropriate customs location before planning export shipments.",

    commonMistake:
      "Attempting export customs processing before AD Code registration is completed where required.",

    summary:
      "The AD Code connects export customs declarations with the exporter's authorised bank.",

    learnMoreHref: "/resources/customs-clearance-india",

    relatedEntities: [
      "DGFT",
      "Export",
      "Banking",
      "ICEGATE",
    ],

    searchIntent: "commercial",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Registration procedures may vary depending on customs location and applicable requirements.",
  },

  {
    id: "certificate-of-origin",

    title: "Certificate of Origin",

    category: "export",
    group: "transport",
    importance: "conditional",
    priority: 7,

    description:
      "A Certificate of Origin certifies the country in which exported goods were manufactured, produced or substantially transformed.",

    purpose:
      "It may be required by overseas buyers or under applicable free trade agreements and destination-country regulations.",

    issuedBy: "Authorised Issuing Agency",

    requiredFor: ["export"],

    usedDuring: "Documentation Review",

    expertTip:
      "Confirm destination-country documentation requirements before cargo dispatch.",

    commonMistake:
      "Applying for the certificate after shipment planning has already been completed.",

    summary:
      "The Certificate of Origin verifies where exported goods originate and may support preferential tariff treatment.",

    learnMoreHref: "/resources/documents-required-for-export-from-india",

    relatedEntities: [
      "FTA",
      "Country of Origin",
      "Export Documentation",
    ],

    searchIntent: "informational",

    mandatory: false,

    digitalSubmission: true,

    notes:
      "Requirements depend on destination country, buyer requirements and applicable trade agreements.",
  },

  {
    id: "bill-of-lading",

    title: "Bill of Lading",

    category: "common",
    group: "transport",
    importance: "essential",
    priority: 8,

    description:
      "The Bill of Lading is the principal transport document issued for international sea freight shipments.",

    purpose:
      "It serves as evidence of cargo receipt, transport contract and shipment information for ocean transportation.",

    issuedBy: "Ocean Carrier or Shipping Line",

    requiredFor: ["import", "export"],

    usedDuring: "Sea Freight Transportation",

    expertTip:
      "Verify consignee, notify party and cargo descriptions before the Bill of Lading is issued.",

    commonMistake:
      "Incorrect consignee information resulting in document amendments and shipment delays.",

    summary:
      "The Bill of Lading records cargo transportation details for international sea freight shipments.",

    learnMoreHref: "/resources/bill-of-lading-explained-international-shipping",

    relatedEntities: [
      "Sea Freight",
      "Container Shipping",
      "Freight Forwarding",
    ],

    searchIntent: "informational",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Original or electronic Bills of Lading may be used depending on carrier procedures.",
  },

  {
    id: "air-waybill",

    title: "Air Waybill",

    category: "common",
    group: "transport",
    importance: "essential",
    priority: 9,

    description:
      "The Air Waybill is the primary transport document used for international air cargo shipments.",

    purpose:
      "It records shipment movement and transportation information between the shipper, airline and consignee.",

    issuedBy: "Airline or Air Cargo Carrier",

    requiredFor: ["import", "export"],

    usedDuring: "Air Freight Transportation",

    expertTip:
      "Verify airport codes, consignee details and cargo information before cargo acceptance.",

    commonMistake:
      "Incorrect consignee information causing delays during cargo handling.",

    summary:
      "The Air Waybill documents the transportation of international air cargo shipments.",

    learnMoreHref: "/resources/air-vs-sea-freight-from-india",

    relatedEntities: [
      "Air Freight",
      "Cargo",
      "Airport Handling",
    ],

    searchIntent: "informational",

    mandatory: true,

    digitalSubmission: true,

    notes:
      "Air Waybills are non-negotiable transport documents used for air cargo movements.",
  },

  {
    id: "insurance-certificate",

    title: "Insurance Certificate",

    category: "common",
    group: "transport",
    importance: "conditional",
    priority: 10,

    description:
      "The Insurance Certificate provides evidence that cargo is insured against covered transportation risks.",

    purpose:
      "It helps establish insurance coverage during international transportation where required by the sales contract or Incoterms.",

    issuedBy: "Insurance Company",

    requiredFor: ["import", "export"],

    usedDuring: "Shipment Planning",

    expertTip:
      "Confirm the insured value and policy coverage before cargo dispatch.",

    commonMistake:
      "Assuming cargo is insured without reviewing the applicable Incoterm responsibilities.",

    summary:
      "The Insurance Certificate confirms cargo insurance coverage for international shipments.",

    learnMoreHref: "/resources/marine-insurance-machinery",

    relatedEntities: [
      "Cargo Insurance",
      "Incoterms",
      "Risk Management",
    ],

    searchIntent: "informational",

    mandatory: false,

    digitalSubmission: true,

    notes:
      "Insurance requirements depend on the agreed Incoterms and commercial contract.",
  },

  {
    id: "import-license",

    title: "Import Licence",

    category: "import",
    group: "compliance",
    importance: "conditional",
    priority: 11,

    description:
      "Certain products require an Import Licence or other regulatory approval before import into India.",

    purpose:
      "It demonstrates compliance with applicable import regulations for restricted or regulated goods.",

    issuedBy: "Relevant Government Authority",

    requiredFor: ["import"],

    usedDuring: "Pre-import Compliance",

    expertTip:
      "Confirm whether your product falls under restricted import categories before placing purchase orders.",

    commonMistake:
      "Assuming every product can be imported without checking regulatory requirements.",

    summary:
      "Some products require an Import Licence before customs clearance can proceed.",

    learnMoreHref: "/resources/import-process-in-india-step-by-step",

    relatedEntities: [
      "DGFT",
      "Restricted Goods",
      "Import Compliance",
    ],

    searchIntent: "commercial",

    mandatory: false,

    digitalSubmission: true,

    notes:
      "Licence requirements depend on the product, applicable notifications and current import policy.",
  },

  {
    id: "fumigation-certificate",

    title: "Fumigation Certificate",

    category: "export",
    group: "transport",
    importance: "conditional",
    priority: 12,

    description:
      "A Fumigation Certificate confirms that wooden packaging materials have been treated in accordance with applicable phytosanitary requirements.",

    purpose:
      "It supports compliance with international wood packaging regulations where applicable.",

    issuedBy: "Approved Fumigation Service Provider",

    requiredFor: ["export"],

    usedDuring: "Pre-shipment Documentation",

    expertTip:
      "Confirm destination-country packaging requirements before packing cargo.",

    commonMistake:
      "Using untreated wooden pallets for destinations requiring compliant wood packaging.",

    summary:
      "The Fumigation Certificate helps demonstrate compliance for treated wood packaging materials.",

    learnMoreHref: "/resources/freight-forwarding-explained-india",

    relatedEntities: [
      "ISPM 15",
      "Wood Packaging",
      "Export Documentation",
    ],

    searchIntent: "informational",

    mandatory: false,

    digitalSubmission: true,

    notes:
      "Requirements vary depending on destination country and cargo packaging.",
  },

  {
    id: "phytosanitary-certificate",

    title: "Phytosanitary Certificate",

    category: "export",
    group: "transport",
    importance: "conditional",
    priority: 13,

    description:
      "A Phytosanitary Certificate certifies that plant products meet the importing country's phytosanitary requirements.",

    purpose:
      "It supports international trade in agricultural and plant-based products where required.",

    issuedBy: "National Plant Protection Organization",

    requiredFor: ["export"],

    usedDuring: "Regulatory Documentation",

    expertTip:
      "Verify importing-country phytosanitary requirements before harvesting or packing goods.",

    commonMistake:
      "Applying for inspection after cargo has already been packed or dispatched.",

    summary:
      "The Phytosanitary Certificate demonstrates compliance with plant health requirements for eligible exports.",

    learnMoreHref: "/resources/freight-forwarding-explained-india",

    relatedEntities: [
      "Plant Quarantine",
      "Agricultural Exports",
      "Export Compliance",
    ],

    searchIntent: "informational",

    mandatory: false,

    digitalSubmission: true,

    notes:
      "Applicable primarily to agricultural, horticultural and certain plant-based products.",
  },
];

