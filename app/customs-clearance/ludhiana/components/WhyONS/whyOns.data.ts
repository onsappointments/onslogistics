export interface WhyOnsItem {
  id: string;

  title: string;

  description: string;

  benefit: string;

  businessValue: string;

  icon: string;
}

export const whyOnsData: WhyOnsItem[] = [
  {
    id: "documentation",

    title: "Documentation Accuracy",

    description:
      "Well-prepared customs documentation helps reduce avoidable queries and keeps shipments moving through the customs process more efficiently.",

    benefit:
      "Better document preparation reduces the likelihood of delays caused by incomplete or inconsistent paperwork.",

    businessValue:
      "Businesses spend less time resolving documentation issues and more time focusing on operations.",

    icon: "FileText",
  },

  {
    id: "compliance",

    title: "Regulatory Compliance",

    description:
      "International trade involves customs procedures, documentation requirements and regulatory obligations that vary depending on the shipment.",

    benefit:
      "Understanding applicable customs requirements helps businesses prepare shipments more confidently.",

    businessValue:
      "Improved compliance planning supports smoother import and export operations.",

    icon: "ShieldCheck",
  },

  {
    id: "coordination",

    title: "End-to-End Shipment Coordination",

    description:
      "Customs clearance is only one stage of an international shipment. Coordination between documentation, customs procedures and freight movement is equally important.",

    benefit:
      "Better coordination helps minimise unnecessary waiting between shipment milestones.",

    businessValue:
      "Businesses gain better visibility across the shipment lifecycle.",

    icon: "Truck",
  },

  {
    id: "communication",

    title: "Single Point of Contact",

    description:
      "Managing customs documentation, shipment updates and communication through a single point of contact simplifies the clearance process.",

    benefit:
      "Clear communication reduces confusion during shipment processing.",

    businessValue:
      "Teams spend less time coordinating across multiple parties.",

    icon: "MessagesSquare",
  },

  {
    id: "planning",

    title: "Shipment Planning",

    description:
      "Preparing documentation, customs filings and transportation plans before cargo arrives can help reduce avoidable delays.",

    benefit:
      "Early planning improves shipment readiness.",

    businessValue:
      "Businesses can better plan inventory and production schedules.",

    icon: "CalendarClock",
  },

  {
    id: "support",

    title: "Practical Customs Guidance",

    description:
      "Businesses often need guidance on documentation, customs procedures and shipment planning before cargo moves.",

    benefit:
      "Access to knowledgeable customs guidance helps businesses make informed decisions.",

    businessValue:
      "Greater confidence throughout the import and export process.",

    icon: "CircleHelp",
  },
];