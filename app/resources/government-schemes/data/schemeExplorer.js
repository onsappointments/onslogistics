import {
  Factory,
  Package,
  Globe2,
  Landmark,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

const schemeExplorer = [
  {
    id: "manufacturers",
    icon: Factory,

    title: "I'm a Manufacturer",

    description:
      "Reduce import costs on raw materials, capital goods and manufacturing inputs while improving working capital.",

    schemes: [
      "MOOWR",
      "EPCG",
      "Advance Authorisation",
    ],

    search: "MOOWR EPCG Advance Authorisation",
  },

  {
    id: "importers",

    icon: Package,

    title: "I'm an Importer",

    description:
      "Discover customs schemes that reduce duty liability, improve cash flow and simplify imports.",

    schemes: [
      "MOOWR",
      "Deferred Duty",
      "Bonded Warehousing",
    ],

    search: "MOOWR Deferred Duty Bonded Warehousing",
  },

  {
    id: "exporters",

    icon: Globe2,

    title: "I'm an Exporter",

    description:
      "Maximise export incentives and improve global competitiveness through government programmes.",

    schemes: [
      "RoDTEP",
      "Duty Drawback",
      "AEO",
    ],

    search: "RoDTEP Duty Drawback AEO",
  },

  {
    id: "factory",

    icon: Landmark,

    title: "Setting Up a Factory",

    description:
      "Explore schemes designed for manufacturing facilities, industrial investments and bonded production.",

    schemes: [
      "MOOWR",
      "SEZ",
      "EOU",
    ],

    search: "MOOWR SEZ EOU",
  },

  {
    id: "compliance",

    icon: ShieldCheck,

    title: "Compliance & Trusted Trade",

    description:
      "Improve customs compliance, reduce inspections and strengthen supply chain reliability.",

    schemes: [
      "AEO",
      "ICEGATE",
      "Project Imports",
    ],

    search: "AEO ICEGATE Project Imports",
  },

  {
    id: "warehouse",

    icon: Warehouse,

    title: "Warehousing & Storage",

    description:
      "Understand bonded warehousing, deferred duty payment and inventory optimisation.",

    schemes: [
      "MOOWR",
      "FTWZ",
      "Bonded Warehouse",
    ],

    search: "MOOWR FTWZ Bonded Warehouse",
  },
];

export default schemeExplorer;