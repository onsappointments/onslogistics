import { EntityItem } from "./types";

export const overviewData: EntityItem[] = [
  {
    id: "import",

    icon: "Import",

    slug: "import-customs-clearance",

    title: "Import Customs Clearance",

    description:
      "Import customs clearance is the process of obtaining customs approval before imported goods are released into India. It includes Bill of Entry filing, customs assessment, applicable duty payment, document verification, compliance checks, and final Out of Charge by Customs.",

    quickAnswer:
      "Import customs clearance allows imported cargo to legally enter India after customs documentation, assessment and duty requirements have been completed.",

    expertTip:
      "Identify the correct HS Code and verify all commercial documents before the shipment reaches the ICD or port. Early preparation significantly reduces delays.",

    commonMistake:
      "Many businesses wait until the shipment arrives before reviewing import documents, resulting in avoidable delays and additional costs.",

    href: "/resources/import-process",

    tags: [
      "Bill of Entry",
      "HS Code",
      "Import Duty",
      "ICEGATE",
    ],

    searchIntent: "commercial",

    primaryKeyword: "import customs clearance",

    secondaryKeywords: [
      "bill of entry",
      "import clearance process",
      "import customs broker",
      "import documentation",
    ],

    relatedArticles: [
      "/resources/bill-of-entry",
      "/resources/hs-code-guide",
      "/resources/import-duty-guide",
      "/resources/icegate-guide",
    ],

    cta: {
      title: "Need Import Customs Clearance?",
      href: "/request-quote",
    },
  },

  {
    id: "export",

    icon: "Export",

    slug: "export-customs-clearance",

    title: "Export Customs Clearance",

    description:
      "Export customs clearance ensures export shipments comply with customs regulations before leaving India. The process includes Shipping Bill filing, document verification, customs examination when required and customs permission for export.",

    quickAnswer:
      "Export customs clearance verifies export documentation and customs compliance before goods are loaded for international shipment.",

    expertTip:
      "Prepare Shipping Bills and export documents before cargo reaches the terminal to avoid missing vessel cut-off times.",

    commonMistake:
      "Incorrect product descriptions and invoice values frequently result in Shipping Bill amendments.",

    href: "/resources/export-process",

    tags: [
      "Shipping Bill",
      "Export",
      "ICEGATE",
      "DGFT",
    ],

    searchIntent: "commercial",

    primaryKeyword: "export customs clearance",

    secondaryKeywords: [
      "shipping bill",
      "export documentation",
      "customs broker export",
      "export process india",
    ],

    relatedArticles: [
      "/resources/shipping-bill-guide",
      "/resources/export-process",
      "/resources/incoterms-guide",
      "/resources/dgft-guide",
    ],

    cta: {
      title: "Need Export Customs Clearance?",
      href: "/request-quote",
    },
  },

  {
    id: "documentation",

    icon: "Documents",

    slug: "customs-documentation",

    title: "Customs Documentation",

    description:
      "Accurate customs documentation is essential for smooth cargo clearance. Depending on the shipment, documents may include Commercial Invoice, Packing List, Bill of Entry, Shipping Bill, Bill of Lading or Air Waybill, Certificate of Origin, Import Export Code (IEC), AD Code registration, and other regulatory certificates.",

    quickAnswer:
      "Complete and accurate documentation helps customs authorities process shipments efficiently and reduces the likelihood of avoidable delays.",

    expertTip:
      "Review every document for consistency in product description, quantity, HS Code, invoice value, and consignee details before filing.",

    commonMistake:
      "Even small differences between the Commercial Invoice and Packing List can lead to queries or document amendments.",

    href: "/resources/customs-documents",

    tags: [
      "Commercial Invoice",
      "Packing List",
      "Bill of Entry",
      "Shipping Bill",
    ],

    searchIntent: "informational",

    primaryKeyword: "customs documentation",

    secondaryKeywords: [
      "documents required for import",
      "documents required for export",
      "packing list",
      "commercial invoice",
    ],

    relatedArticles: [
      "/resources/documents-required-for-export",
      "/resources/bill-of-entry",
      "/resources/shipping-bill-guide",
      "/resources/ad-code-guide",
    ],

    cta: {
      title: "Need Documentation Assistance?",
      href: "/request-quote",
    },
  },

  {
    id: "compliance",

    icon: "Compliance",

    slug: "customs-compliance",

    title: "Customs Compliance",

    description:
      "Customs compliance involves ensuring that imported and exported goods meet applicable customs laws, tariff classifications, licensing requirements, valuation rules, and regulatory obligations before clearance.",

    quickAnswer:
      "Strong customs compliance reduces shipment delays, penalties, and unnecessary customs queries.",

    expertTip:
      "Maintain updated product classifications, licences, and supporting documents before initiating customs filing.",

    commonMistake:
      "Assuming every shipment follows the same compliance requirements can lead to avoidable customs objections.",

    href: "/resources/customs-compliance",

    tags: [
      "Compliance",
      "ICEGATE",
      "DGFT",
      "HS Code",
    ],

    searchIntent: "informational",

    primaryKeyword: "customs compliance",

    secondaryKeywords: [
      "customs regulations",
      "customs filing",
      "regulatory compliance",
    ],

    relatedArticles: [
      "/resources/icegate-guide",
      "/resources/hs-code-guide",
      "/resources/dgft-guide",
    ],

    cta: {
      title: "Need Compliance Guidance?",
      href: "/request-quote",
    },
  },

  {
    id: "duty",

    icon: "Duty",

    slug: "import-duty-guidance",

    title: "Import Duty Guidance",

    description:
      "Import duties in India may include Basic Customs Duty, Integrated GST, Social Welfare Surcharge, Anti-Dumping Duty, Safeguard Duty, or other applicable levies depending on product classification and regulations.",

    quickAnswer:
      "Import duty is determined primarily by the HS Code, product value, origin, and applicable customs notifications.",

    expertTip:
      "Always confirm tariff classification before estimating landed cost for imported goods.",

    commonMistake:
      "Estimating import cost without verifying the applicable HS Code often results in inaccurate budgeting.",

    href: "/resources/import-duty-guide",

    tags: [
      "BCD",
      "IGST",
      "HS Code",
      "Import Duty",
    ],

    searchIntent: "informational",

    primaryKeyword: "import duty",

    secondaryKeywords: [
      "customs duty calculator",
      "landed cost",
      "basic customs duty",
    ],

    relatedArticles: [
      "/resources/import-duty-guide",
      "/resources/hs-code-guide",
      "/calculators/import-duty",
    ],

    cta: {
      title: "Need Duty Assistance?",
      href: "/request-quote",
    },
  },

  {
    id: "freight",

    icon: "Freight",

    slug: "freight-coordination",

    title: "Freight & Customs Coordination",

    description:
      "Efficient logistics depends on close coordination between freight forwarding and customs clearance. Proper planning helps synchronize cargo arrival, documentation, customs filing, and onward transportation after customs release.",

    quickAnswer:
      "Coordinating freight movement with customs clearance helps reduce storage time and improve shipment planning.",

    expertTip:
      "Share shipment schedules and documentation with your customs broker before cargo arrives.",

    commonMistake:
      "Treating freight forwarding and customs clearance as separate activities often creates unnecessary delays.",

    href: "/services/freight-forwarding",

    tags: [
      "Freight Forwarding",
      "Container Movement",
      "ICD",
      "Logistics",
    ],

    searchIntent: "commercial",

    primaryKeyword: "freight forwarding and customs clearance",

    secondaryKeywords: [
      "container logistics",
      "freight coordination",
      "shipment planning",
    ],

    relatedArticles: [
      "/services/freight-forwarding",
      "/resources/container-shipping-guide",
      "/resources/import-process",
    ],

    cta: {
      title: "Talk to a Logistics Expert",
      href: "/request-quote",
    },
  },
];