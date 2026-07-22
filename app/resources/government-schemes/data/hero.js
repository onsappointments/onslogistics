/**
 * Government Schemes Hero Data
 *
 * This file contains all content for the Hero section.
 * No UI logic should exist here.
 * Components should consume this data only.
 */

const heroData = {
  eyebrow: "Government Trade Schemes",

  title: "Government Trade Schemes for Indian Businesses",

  description:
    "Explore India's major CBIC and DGFT trade schemes that help importers, exporters, manufacturers, and logistics companies reduce import costs, improve cash flow, simplify compliance, and grow globally.",

  searchPlaceholder:
    "Search schemes, articles, eligibility, circulars...",

  popularSearches: [
    {
      label: "MOOWR",
      href: "/resources/articles/what-is-moowr-scheme",
    },
    {
      label: "AEO",
      href: "/resources/articles/authorised-economic-operator-aeo-guide",
    },
    {
      label: "EPCG",
      href: "/resources/articles/epcg-scheme-guide",
    },
    {
      label: "RoDTEP",
      href: "/resources/articles/rodtep-scheme-guide",
    },
    {
      label: "Duty Drawback",
      href: "/resources/articles/duty-drawback-scheme-guide",
    },
    {
      label: "Section 65",
      href: "/resources/articles/section-65-customs-act-guide",
    },
  ],

  actions: {
  primary: {
    label: "Explore Schemes",
    href: "#scheme-library",
  },

  secondary: {
    label: "Talk to an Expert",
    href: "#faq-consultation",
  },
},

  dashboardCards: [
    {
      id: "moowr",

      title: "MOOWR Scheme",

      badge: "Popular",

      badgeColor: "green",

      headline: "Deferred Import Duty",

      supportingText:
        "Manufacture under bond and pay customs duty only when goods enter the domestic market.",

      footer: "Best for Manufacturers",

      href: "/resources/articles/what-is-moowr-scheme",
    },

    {
      id: "aeo",

      title: "AEO Certification",

      badge: "Trusted",

      badgeColor: "blue",

      headline: "Trusted Trade Partner",

      supportingText:
        "Reduce inspections, improve customs facilitation, and strengthen international trade credibility.",

      footer: "CBIC Programme",

      href: "/resources/articles/authorised-economic-operator-aeo-guide",
    },

    {
      id: "epcg",

      title: "EPCG Scheme",

      badge: "Capital Goods",

      badgeColor: "orange",

      headline: "Duty Concession",

      supportingText:
        "Import capital goods at concessional customs duty against export obligations.",

      footer: "DGFT Scheme",

      href: "/resources/articles/epcg-scheme-guide",
    },

    {
      id: "drawback",

      title: "Duty Drawback",

      badge: "Export",

      badgeColor: "purple",

      headline: "Claim Duty Refunds",

      supportingText:
        "Recover eligible customs duties paid on imported inputs used in exported goods.",

      footer: "For Exporters",

      href: "/resources/articles/duty-drawback-scheme-guide",
    },
  ],

  seo: {
    keywords: [
      "Government schemes for importers",
      "Government schemes for exporters",
      "Trade schemes India",
      "CBIC schemes",
      "DGFT schemes",
      "Import duty saving schemes",
      "Export incentive schemes",
      "MOOWR",
      "AEO",
      "EPCG",
      "RoDTEP",
      "Duty Drawback",
      "Advance Authorization",
      "SEZ",
      "EOU",
    ],
  },
};

export default heroData;