import { JourneyStep } from "./types";

export const importJourney: JourneyStep[] = [
  {
    id: "import-documentation",
    journey: "import",
    stepNumber: 1,

    title: "Import Documentation Review",

    shortDescription:
      "Collect and verify all mandatory import documents before customs filing.",

    detailedDescription:
      "The customs clearance process begins with reviewing the import documentation. Commercial Invoice, Packing List, Bill of Lading or Air Waybill, Importer Exporter Code (IEC), GST details and other applicable certificates should be verified before filing the Bill of Entry. Missing or inconsistent information often causes avoidable delays.",

    quickAnswer:
      "Accurate documentation forms the foundation of smooth import customs clearance.",

    expertTip:
      "Review supplier documents before cargo arrives instead of waiting until the shipment reaches the ICD.",

    commonMistake:
      "Importers often overlook differences between invoice descriptions and packing list descriptions.",

    onsSupport:
      "ONS Logistics reviews documentation before customs filing to identify potential compliance issues early.",

    learnMoreHref: "/resources/bill-of-lading-explained-international-shipping",

    documents: [
      { id: "invoice", name: "Commercial Invoice", required: true },
      { id: "packing", name: "Packing List", required: true },
      { id: "bl", name: "Bill of Lading / Air Waybill", required: true },
      { id: "iec", name: "Importer Exporter Code (IEC)", required: true },
    ],

    entities: [
      "Commercial Invoice",
      "Packing List",
      "IEC",
      "Import Documentation",
    ],
  },

  {
    id: "bill-of-entry",

    journey: "import",

    stepNumber: 2,

    title: "Bill of Entry Filing",

    shortDescription:
      "Submit the Bill of Entry for customs assessment through the prescribed customs process.",

    detailedDescription:
      "After documentation review, the Bill of Entry is filed for customs processing. Customs authorities evaluate the declaration, product classification and applicable regulations before assessment.",

    quickAnswer:
      "The Bill of Entry is the primary customs document used for import clearance.",

    expertTip:
      "Ensure the declared product description matches the invoice and supporting documents.",

    commonMistake:
      "Using generic product descriptions instead of accurate commercial descriptions.",

    onsSupport:
      "ONS Logistics prepares and reviews customs documentation before filing.",

    learnMoreHref: "/resources/import-process-in-india-step-by-step",

    documents: [],

    entities: [
      "Bill of Entry",
      "Customs Filing",
      "ICEGATE",
    ],
  },

  {
    id: "assessment",

    journey: "import",

    stepNumber: 3,

    title: "Customs Assessment",

    shortDescription:
      "Customs verifies classification, valuation and applicable duties.",

    detailedDescription:
      "Customs officers examine declarations, applicable notifications, valuation principles and product classification before determining duties and other regulatory requirements.",

    quickAnswer:
      "Assessment determines the applicable customs duties and regulatory compliance.",

    expertTip:
      "Correct HS Code selection reduces unnecessary assessment queries.",

    commonMistake:
      "Incorrect product classification leading to reassessment.",

    onsSupport:
      "Our customs specialists assist with documentation and classification guidance.",

    learnMoreHref: "/resources/hs-code-explained-indian-importers-exporters",

    entities: [
      "HS Code",
      "Assessment",
      "Customs Duty",
    ],
  },

  {
    id: "duty-payment",

    journey: "import",

    stepNumber: 4,

    title: "Duty Payment",

    shortDescription:
      "Applicable customs duties and taxes are paid before cargo release.",

    detailedDescription:
      "Following assessment, the applicable duties and taxes are paid before the shipment becomes eligible for release, subject to customs procedures.",

    quickAnswer:
      "Duty payment is required before customs release unless another legal provision applies.",

    expertTip:
      "Estimate import duties before shipment arrival for better cash-flow planning.",

    commonMistake:
      "Ignoring additional duties and taxes while budgeting imports.",

    onsSupport:
      "ONS Logistics helps businesses understand customs duty calculations and documentation requirements.",

    learnMoreHref: "/resources/import-duties-in-india-explained",

    entities: [
      "Import Duty",
      "BCD",
      "IGST",
    ],
  },

  {
    id: "out-of-charge",

    journey: "import",

    stepNumber: 5,

    title: "Customs Release & Delivery",

    shortDescription:
      "After customs clearance, cargo can move for onward delivery.",

    detailedDescription:
      "Once customs procedures are completed and the shipment is released, cargo can proceed for transportation according to logistics planning and terminal procedures.",

    quickAnswer:
      "Customs release allows cargo to move for onward delivery after required procedures are completed.",

    expertTip:
      "Coordinate transportation before customs release to minimise storage charges.",

    commonMistake:
      "Booking transportation only after customs clearance is completed.",

    onsSupport:
      "ONS Logistics coordinates customs clearance with freight forwarding and inland transportation.",

    learnMoreHref: "/services/customs-clearance-india",

    entities: [
      "Out of Charge",
      "Container Delivery",
      "Freight Forwarding",
    ],
  },
];

export const exportJourney: JourneyStep[] = [
  {
    id: "export-documentation",

    journey: "export",

    stepNumber: 1,

    title: "Export Documentation",

    shortDescription:
      "Prepare export documentation before filing the Shipping Bill.",

    detailedDescription:
      "Export documentation generally includes the Commercial Invoice, Packing List, purchase order (where applicable), IEC, GST information and other shipment-specific documents before customs filing.",

    quickAnswer:
      "Accurate export documentation helps reduce customs queries before shipment departure.",

    expertTip:
      "Verify buyer information and product descriptions before preparing export documents.",

    commonMistake:
      "Submitting inconsistent invoice and packing list information.",

    onsSupport:
      "ONS Logistics reviews export documentation before customs filing.",

    learnMoreHref: "/resources/export-process-in-india-step-by-step",

    entities: [
      "Commercial Invoice",
      "Packing List",
      "Export Documentation",
    ],
  },

  {
    id: "shipping-bill",

    journey: "export",

    stepNumber: 2,

    title: "Shipping Bill Filing",

    shortDescription:
      "The Shipping Bill is filed before export customs processing.",

    detailedDescription:
      "The Shipping Bill is a key customs document used for export clearance. Customs verifies the declaration and applicable export regulations before further processing.",

    quickAnswer:
      "The Shipping Bill is the primary customs document for export clearance.",

    expertTip:
      "Check export incentive declarations before filing when applicable.",

    commonMistake:
      "Incorrect product descriptions delaying customs processing.",

    onsSupport:
      "ONS Logistics prepares and verifies Shipping Bills for export shipments.",

    learnMoreHref: "/resources/what-is-a-shipping-bill-in-india",

    entities: [
      "Shipping Bill",
      "ICEGATE",
      "Export Filing",
    ],
  },

  {
    id: "leo",

    journey: "export",

    stepNumber: 3,

    title: "Customs Examination & Let Export Order",

    shortDescription:
      "Where applicable, customs completes examination before granting Let Export Order (LEO).",

    detailedDescription:
      "Depending on customs procedures and risk parameters, shipments may undergo examination before Let Export Order (LEO) is granted, allowing cargo to proceed for export.",

    quickAnswer:
      "LEO indicates that customs procedures have been completed for export processing.",

    expertTip:
      "Ensure cargo is available for examination if selected.",

    commonMistake:
      "Missing examination schedules because documentation was incomplete.",

    onsSupport:
      "ONS Logistics coordinates customs procedures throughout the export clearance process.",

    learnMoreHref: "/resources/documents-required-for-export-from-india",

    entities: [
      "LEO",
      "Export Examination",
      "Customs Clearance",
    ],
  },

  {
    id: "cargo-loading",

    journey: "export",

    stepNumber: 4,

    title: "Cargo Loading & Departure",

    shortDescription:
      "After customs procedures, cargo proceeds for loading and international transportation.",

    detailedDescription:
      "Following completion of export customs requirements, cargo proceeds according to carrier schedules for loading and international shipment.",

    quickAnswer:
      "Export customs clearance allows cargo to proceed for international transportation.",

    expertTip:
      "Coordinate freight schedules with customs documentation timelines.",

    commonMistake:
      "Ignoring vessel or flight cut-off timings.",

    onsSupport:
      "ONS Logistics coordinates freight forwarding together with export customs clearance.",

    learnMoreHref: "/services/container-stuffing-process-explained",

    entities: [
      "Freight Forwarding",
      "Export Cargo",
      "International Shipping",
    ],
  },
];