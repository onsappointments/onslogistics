import {
  BadgeCheck,
  FileCheck2,
  FileText,
  Globe2,
  MapPin,
  ShipWheel,
  ShieldCheck,
} from "lucide-react";

import { HeroData } from "./types";

export const heroData: HeroData = {
  eyebrow: "Customs Clearance • Ludhiana",

  title:
    "Customs Broker in Ludhiana",

  description:
    "ONS Logistics assists manufacturers, exporters and importers with customs clearance, documentation, Bill of Entry, Shipping Bill, ICEGATE guidance and freight coordination for shipments moving through Ludhiana.",

  capabilities: [
    {
      id: "import",
      label: "Import Customs Clearance",
      icon: Globe2,
    },
    {
      id: "export",
      label: "Export Customs Clearance",
      icon: ShipWheel,
    },
    {
      id: "documentation",
      label: "Documentation Review",
      icon: FileText,
    },
    {
      id: "shipping-bill",
      label: "Shipping Bill",
      icon: FileCheck2,
    },
    {
      id: "bill-entry",
      label: "Bill of Entry",
      icon: ShieldCheck,
    },
    {
      id: "icegate",
      label: "ICEGATE Guidance",
      icon: BadgeCheck,
    },
  ],

  process: [
    {
      id: "invoice",
      title: "Commercial Invoice",
      shortLabel: "Invoice",
    },
    {
      id: "packing",
      title: "Packing List",
      shortLabel: "Packing",
    },
    {
      id: "bill-entry",
      title: "Bill of Entry",
      shortLabel: "BoE",
    },
    {
      id: "assessment",
      title: "Customs Assessment",
      shortLabel: "Assessment",
    },
    {
      id: "duty",
      title: "Duty Payment",
      shortLabel: "Duty",
    },
    {
      id: "release",
      title: "Cargo Release",
      shortLabel: "Release",
    },
  ],

  trustItems: [
    {
      id: "clearance",
      label: "Import & Export Customs Clearance",
    },
    {
      id: "documentation",
      label: "Bill of Entry & Shipping Bill",
    },
    {
      id: "icegate",
      label: "ICEGATE Documentation Guidance",
    },
    {
      id: "coordination",
      label: "Freight & Customs Coordination",
    },
  ],

  actions: [
    {
      label: "Request Customs Clearance Quote",
      href: "/request-quote",
      variant: "primary",
    },
    {
      label: "Talk to a Customs Expert",
      href: "/contact",
      variant: "secondary",
    },
  ],

  // These will be added to HeroData interface

};