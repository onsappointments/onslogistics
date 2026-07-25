import {
  Landmark,
  ShieldCheck,
  Ship,
  Workflow,
} from "lucide-react";

export const knowledgeAreas = [
  {
    id: "government-schemes",
    featured: true,
    icon: Landmark,
    href: "/resources/government-schemes",
    badge: "Featured",
    title: "Government Schemes",
    description:
      "Understand India's major trade incentive schemes and identify the right one for your business.",

    items: [
      "MOOWR",
      "EPCG",
      "AEO",
      "RoDTEP",
      "Duty Drawback",
      "Advance Authorisation",
    ],

    cta: "Explore Schemes",
  },

  {
    id: "customs",

    icon: ShieldCheck,

    href: "/resources?category=Customs",

    title: "Customs Clearance",

    description:
      "Master customs procedures, documentation and clearance processes.",

    items: [
      "Documentation",
      "ICEGATE",
      "HS Codes",
      "Import Duties",
      "Assessment",
    ],

    cta: "Explore Customs",
  },

  {
    id: "imports-exports",

    icon: Ship,

    href: "/resources?category=Import Export",

    title: "Imports & Exports",

    description:
      "Learn international shipping, freight forwarding and global trade.",

    items: [
      "Imports",
      "Exports",
      "Freight",
      "Ports",
      "Incoterms",
    ],

    cta: "Explore Trade",
  },

  {
    id: "interactive",

    icon: Workflow,

    href: "/resources/flowchart",

    title: "Interactive Learning",

    description:
      "Understand logistics visually through flowcharts and decision trees.",

    items: [
      "Flowcharts",
      "Decision Trees",
      "Trade Maps",
      "Visual Guides",
    ],

    cta: "Start Learning",
  },
];

export const popularTopics = [
  {
    title: "MOOWR",
    href: "/resources/government-schemes/moowr-scheme",
  },
  {
    title: "EPCG",
    href: "/resources/government-schemes/epcg-scheme",
  },
  {
    title: "AEO",
    href: "/resources/government-schemes/authorized-economic-operator",
  },
  {
    title: "RoDTEP",
    href: "/resources/government-schemes/rodtep-scheme",
  },
  {
    title: "Customs Clearance",
    href: "/resources/customs-clearance",
  },
  {
    title: "ICEGATE",
    href: "/resources/icegate",
  },
  {
    title: "HS Codes",
    href: "/resources/hs-codes",
  },
  {
    title: "Import Duty",
    href: "/resources/import-duty",
  },
  {
    title: "Freight Forwarding",
    href: "/resources/freight-forwarding",
  },
  {
    title: "Exports",
    href: "/resources/export-process",
  },
];

export const stats = [
  {
    value: "90+",
    label: "Expert Guides",
    description: "Comprehensive logistics and customs resources",
  },
  {
    value: "9",
    label: "Government Schemes",
    description: "Covering India's major trade incentive programs",
  },
  {
    value: "500+",
    label: "Trade Questions",
    description: "Answered through practical articles and FAQs",
  },
  {
    value: "Interactive",
    label: "Learning",
    description: "Flowcharts, decision trees and visual guides",
  },
];
