// STRUCTURE RULES FOLLOWED:
//
// ✅ explanation is LONGER than answer
// ✅ relatedArticles contain REAL article slugs
// ✅ slugs are SEO-safe
// ✅ direct-answer optimized for AEO/GEO
// ✅ category + difficulty included
// ✅ compatible with your current slug page
//
// ADD THIS DIRECTLY TO:
// Components/resources/flashcards/flashcards-data.js

export const flashcards = [
  {
    slug: "what-is-customs-clearance",
    category: "Customs",
    difficulty: "Beginner",

    question:
      "What is customs clearance?",

    answer:
      "Customs clearance is the legal process of getting imported or exported goods approved by customs authorities.",

    explanation:
      "Customs clearance involves document verification, cargo inspection, duty assessment, tax payment, and final release approval. Businesses must submit documents like Commercial Invoice, Packing List, Bill of Lading, and HS Code details before customs authorities approve cargo movement across borders.",

    relatedArticles: [
      {
        label:
          "Customs Clearance Process in India",
        href:
          "/resources/customs-clearance-india",
      },
      {
        label:
          "Import Duties in India",
        href:
          "/resources/import-duties-in-india-explained",
      },
    ],
  },

  {
    slug: "what-is-fcl-shipping",

    category: "Sea Freight",

    difficulty: "Beginner",

    question:
      "What is FCL shipping?",

    answer:
      "FCL means Full Container Load where one shipper uses the entire container.",

    explanation:
      "FCL shipping is ideal for large cargo volumes because the container is dedicated to a single shipper. It offers faster transit, reduced cargo handling risk, lower contamination chances, and often better long-term cost efficiency for businesses moving high-volume shipments internationally.",

    relatedArticles: [
      {
        label:
          "LCL vs FCL Shipping Explained",
        href:
          "/resources/lcl-vs-fcl-shipping-from-india",
      },
      {
        label:
          "Air Freight vs Sea Freight",
        href:
          "/resources/air-freight-vs-sea-freight",
      },
    ],
  },

  {
    slug: "what-is-lcl-shipping",

    category: "Sea Freight",

    difficulty: "Beginner",

    question:
      "What is LCL shipping?",

    answer:
      "LCL shipping combines cargo from multiple shippers into one shared container.",

    explanation:
      "LCL or Less than Container Load is commonly used when businesses do not have enough cargo to fill an entire container. Freight forwarders consolidate shipments from multiple exporters to reduce transportation cost and improve shipment flexibility for smaller businesses.",

    relatedArticles: [
      {
        label:
          "LCL vs FCL Shipping Guide",
        href:
          "/resources/lcl-vs-fcl-shipping-from-india",
      },
    ],
  },

  {
    slug: "what-is-an-iec-code",

    category: "Export",

    difficulty: "Beginner",

    question:
      "What is an IEC code?",

    answer:
      "IEC stands for Import Export Code required for international trade in India.",

    explanation:
      "The Import Export Code is issued by DGFT and acts as the primary business identification number for importers and exporters in India. Without IEC registration, businesses cannot legally perform international trade transactions or customs clearance operations.",

    relatedArticles: [
      {
        label:
          "What is an IEC code",
        href:
          "/resources/iec-code-india-how-to-get",
      },
      {
        label:
          "Export Documentation Guide",
        href:
          "/resources/documents-required-for-export-from-india",
      },
    ],
  },

  {
    slug: "what-is-a-bill-of-lading",

    category: "Documents",

    difficulty: "Intermediate",

    question:
      "What is a Bill of Lading?",

    answer:
      "A Bill of Lading is a shipping document issued by a carrier as proof of cargo receipt.",

    explanation:
      "The Bill of Lading serves as a shipment receipt, transport contract, and title document in international trade. It contains shipment details such as cargo description, shipper information, consignee information, container numbers, and delivery terms.",

    relatedArticles: [
      {
        label:
          "Bill of Landing explained ",
        href:
          "/resources/bill-of-lading-explained-international-shipping",
      },
    ],
  },

  {
    slug: "what-is-an-airway-bill",

    category: "Air Freight",

    difficulty: "Intermediate",

    question:
      "What is an Airway Bill?",

    answer:
      "An Airway Bill is a shipment document used for international air cargo transportation.",

    explanation:
      "The Airway Bill acts as proof of cargo acceptance by the airline and contains shipment details, destination, cargo weight, consignee information, and routing instructions. Unlike a Bill of Lading, the Airway Bill is non-negotiable and cannot transfer cargo ownership.",

    relatedArticles: [
      {
        label:
          "Documents required for export ",
        href:
          "/resources/documents-required-for-export-from-india",
      },
    ],
  },

  {
    slug: "what-is-freight-forwarding",

    category: "Logistics",

    difficulty: "Beginner",

    question:
      "What does a freight forwarder do?",

    answer:
      "A freight forwarder manages international cargo transportation and logistics coordination.",

    explanation:
      "Freight forwarders organize shipping operations, customs clearance, cargo consolidation, warehousing, documentation, and carrier coordination on behalf of importers and exporters. They simplify complex international supply chain operations for businesses.",

    relatedArticles: [
      {
        label:
          "How Freight Forwarding Works",
        href:
          "/resources/freight-forwarding-explained-india",
      },
    ],
  },

  {
    slug: "what-is-import-duty",

    category: "Customs",

    difficulty: "Intermediate",

    question:
      "What is import duty?",

    answer:
      "Import duty is a tax imposed by governments on imported goods.",

    explanation:
      "Import duties are calculated based on HS Code classification, CIF value, country of origin, and applicable trade regulations. In India, import duty may include Basic Customs Duty, IGST, Social Welfare Surcharge, and other applicable taxes.",

    relatedArticles: [
      {
        label:
          "Import Duties in India Explained",
        href:
          "/resources/import-duties-in-india-explained",
      },
    ],
  },

  {
    slug: "what-is-hs-code",

    category: "Customs",

    difficulty: "Beginner",

    question:
      "What is an HS code?",

    answer:
      "HS Code is a globally standardized product classification system used in international trade.",

    explanation:
      "HS Codes help customs authorities identify products and determine duties, taxes, restrictions, and trade policies. Businesses must use the correct HS Code during import-export documentation to avoid customs penalties and shipment delays.",

    relatedArticles: [
      {
        label:
          "Import Duties Explained",
        href:
          "/resources/import-duties-in-india-explained",
      },
      {
        label:
          "HS Code explained ",
        href:
          "/resources/hs-code-explained-indian-importers-exporters",
      },
    ],
  },

  {
    slug: "what-is-port-congestion",

    category: "Ports",

    difficulty: "Intermediate",

    question:
      "What is port congestion?",

    answer:
      "Port congestion occurs when cargo volume exceeds a port’s operational handling capacity.",

    explanation:
      "Congestion can happen due to labor shortages, weather conditions, customs delays, vessel bunching, or infrastructure limitations. Port congestion increases transit time, storage charges, detention fees, and supply chain uncertainty for businesses.",

    relatedArticles: [
      {
        label:
          "Port Congestion in India",
        href:
          "/resources/port-congestion-in-india-causes-and-shipping-impact",
      },
    ],
  },

  {
    slug: "what-is-container-tracking",

    category: "Shipping",

    difficulty: "Beginner",

    question:
      "How does container tracking work?",

    answer:
      "Container tracking uses container numbers and carrier systems to monitor cargo movement.",

    explanation:
      "Shipping lines update tracking events whenever containers move between ports, terminals, customs checkpoints, warehouses, or delivery hubs. Businesses use container tracking to monitor estimated arrival time, delays, transshipment status, and delivery progress.",

    relatedArticles: [
      {
        label:
          "How Container Tracking Works",
        href:
          "/resources/how-container-tracking-works-in-international-shipping",
      },
    ],
  },

  {
    slug: "what-is-factory-stuffing",

    category: "Containers",

    difficulty: "Intermediate",

    question:
      "What is factory stuffing?",

    answer:
      "Factory stuffing means cargo is loaded into containers directly at the exporter’s facility.",

    explanation:
      "Factory stuffing reduces cargo handling risk and improves shipment security because goods are sealed at the source location. Customs officers may supervise or verify the stuffing process depending on export regulations and shipment category.",

    relatedArticles: [
      {
        label:
          "Factory Stuffing vs Dock Stuffing",
        href:
          "/resources/factory-stuffing-vs-dock-stuffing-explained",
      },
    ],
  },

  {
    slug: "what-is-dock-stuffing",

    category: "Containers",

    difficulty: "Intermediate",

    question:
      "What is dock stuffing?",

    answer:
      "Dock stuffing means cargo is loaded into containers at the port or container freight station.",

    explanation:
      "Dock stuffing is commonly used when exporters cannot arrange container loading at their own warehouse. The cargo is transported separately to the port or CFS where it is consolidated and loaded into containers under customs supervision.",

    relatedArticles: [
      {
        label:
          "Factory Stuffing vs Dock Stuffing",
        href:
          "/resources/factory-stuffing-vs-dock-stuffing-explained",
      },
    ],
  },

  {
    slug: "what-is-customs-edi",

    category: "Customs",

    difficulty: "Advanced",

    question:
      "What is the Customs EDI system?",

    answer:
      "Customs EDI is an electronic system used for digital customs filing and processing.",

    explanation:
      "The Electronic Data Interchange system allows businesses, customs brokers, shipping lines, and government agencies to exchange trade documentation digitally. It reduces paperwork, improves processing speed, and enhances customs transparency.",

    relatedArticles: [
      {
        label:
          "Customs EDI System Explained",
        href:
          "/resources/customs-clearance-india",
      },
    ],
  },

  {
    slug: "what-is-sea-freight",

    category: "Sea Freight",

    difficulty: "Beginner",

    question:
      "What is sea freight?",

    answer:
      "Sea freight is the transportation of cargo internationally through ocean shipping routes.",

    explanation:
      "Sea freight is the most cost-effective method for transporting large-volume goods internationally. Businesses use containerized ocean transport for machinery, raw materials, textiles, industrial products, and bulk cargo shipments.",

    relatedArticles: [
      {
        label:
          "Air Freight vs Sea Freight",
        href:
          "/resources/air-freight-vs-sea-freight-from-india",
      },
    ],
  },

  {
    slug: "what-is-air-freight",

    category: "Air Freight",

    difficulty: "Beginner",

    question:
      "What is air freight?",

    answer:
      "Air freight is the transportation of goods through commercial aircraft.",

    explanation:
      "Air freight is used for urgent, high-value, lightweight, or perishable cargo requiring fast international delivery. Although more expensive than sea freight, it significantly reduces transit time and improves supply chain responsiveness.",

    relatedArticles: [
      {
        label:
          "Air Freight vs Sea Freight",
        href:
          "/resources/air-freight-vs-sea-freight-from-india",
      },
    ],
  },

  {
    slug: "what-is-cbm-in-shipping",

    category: "Shipping",

    difficulty: "Beginner",

    question:
      "What is CBM in shipping?",

    answer:
      "CBM stands for Cubic Meter and measures cargo volume in logistics.",

    explanation:
      "CBM calculations help determine freight cost for sea shipments, especially in LCL cargo where pricing depends on shipment volume instead of full container allocation. Accurate CBM calculation is important for logistics cost planning.",

    relatedArticles: [
      {
        label:
          "LCL vs FCL Shipping",
        href:
          "/resources/lcl-vs-fcl-shipping-from-india",
      },
    ],
  },

  {
    slug: "what-is-a-packing-list",

    category: "Documents",

    difficulty: "Beginner",

    question:
      "What is a packing list in exports?",

    answer:
      "A packing list is a shipment document containing cargo packaging and quantity details.",

    explanation:
      "Packing lists help customs authorities, freight forwarders, and buyers verify shipment contents during cargo inspection and delivery. It usually contains carton count, package dimensions, product descriptions, weights, and marking information.",

    relatedArticles: [
      {
        label:
          "Documents Required for Export",
        href:
          "/resources/documents-required-for-export-from-india",
      },
    ],
  },

  {
    slug: "what-is-shipping-cost",

    category: "Shipping",

    difficulty: "Intermediate",

    question:
      "What affects international shipping cost?",

    answer:
      "Shipping cost depends on cargo volume, weight, mode, destination, and fuel prices.",

    explanation:
      "International freight pricing is influenced by container availability, customs charges, surcharges, port congestion, seasonality, cargo type, shipping route, and transportation mode selection such as air freight or sea freight.",

    relatedArticles: [
      {
        label:
          "International Shipping Cost from India",
        href:
          "/resources/shipping-cost-from-india-2026",
      },
    ],
  },

  {
    slug: "what-is-last-mile-delivery",

    category: "Logistics",

    difficulty: "Beginner",

    question:
      "What is last-mile delivery?",

    answer:
      "Last-mile delivery is the final transportation stage from warehouse to customer destination.",

    explanation:
      "Last-mile delivery is one of the most operationally challenging parts of logistics because it directly impacts customer experience, delivery speed, transportation efficiency, and distribution cost.",

    relatedArticles: [
      {
        label:
          "How Freight Forwarding Works",
        href:
          "/resources/freight-forwarding-explained-india",
      },
    ],
  },

  {
    slug: "what-is-incoterms",

    category: "Trade",

    difficulty: "Intermediate",

    question:
      "What are Incoterms?",

    answer:
      "Incoterms are international trade rules defining buyer and seller shipping responsibilities.",

    explanation:
      "Incoterms determine which party handles freight cost, insurance, customs clearance, risk transfer, and transportation responsibility during international trade transactions.",

    relatedArticles: [
      {
        label:
          "Incoterms Explained",
        href:
          "/resources/incoterms-explained-india-fob-cif-ddp",
      },
    ],
  },
];