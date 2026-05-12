import FAQClient from "./FAQClient";
import { getAllItems } from "./faq-data";

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

export const metadata = {
  title:
    "Logistics FAQs | Import Export, Shipping & Customs Clearance | ONS Logistics",

  description:
    "Explore expert answers on international shipping, customs clearance, freight forwarding, warehousing, import-export documentation, and logistics operations from ONS Logistics.",

  alternates: {
    canonical:
      "https://onslog.com/resources/faqs",
  },

  openGraph: {
    title:
      "Logistics FAQs | ONS Logistics",

    description:
      "Shipping costs, freight forwarding, customs clearance, import-export processes, and logistics FAQs answered by ONS Logistics experts.",

    url: "https://onslog.com/resources/faqs",

    type: "website",
  },

  other: {
    keywords:
      "logistics FAQ India, customs clearance FAQ, freight forwarding FAQ, import export FAQ India, shipping FAQ, warehousing FAQ, logistics knowledge hub",
  },
};

// ─────────────────────────────────────────────────────────────
// FAQ SCHEMA
// ─────────────────────────────────────────────────────────────

function buildFaqSchema() {
  const allItems = getAllItems();

  return {
    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    mainEntity:
      allItems.map((item) => ({
        "@type":
          "Question",

        name: item.q,

        acceptedAnswer: {
          "@type":
            "Answer",

          text:
            item.directAnswer
              ? `${item.directAnswer} ${item.a}`
              : item.a,
        },
      })),
  };
}

// ─────────────────────────────────────────────────────────────
// BREADCRUMB SCHEMA
// ─────────────────────────────────────────────────────────────

const breadcrumbSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "BreadcrumbList",

  itemListElement: [
    {
      "@type":
        "ListItem",

      position: 1,

      name: "Home",

      item: "https://onslog.com",
    },

    {
      "@type":
        "ListItem",

      position: 2,

      name: "Resources",

      item: "https://onslog.com/resources",
    },

    {
      "@type":
        "ListItem",

      position: 3,

      name: "FAQs",

      item: "https://onslog.com/resources/faqs",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// LOCAL BUSINESS SCHEMA
// ─────────────────────────────────────────────────────────────

const localBusinessSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "LocalBusiness",

  name: "ONS Logistics",

  description:
    "International freight forwarder and customs clearance company serving importers and exporters across India.",

  url: "https://onslog.com",

  telephone:
    "+91-1800-890-7365",

  address: {
    "@type":
      "PostalAddress",

    addressLocality:
      "Ludhiana",

    addressRegion:
      "Punjab",

    addressCountry: "IN",
  },

  areaServed: [
    "India",
    "USA",
    "UAE",
    "UK",
    "Australia",
    "Canada",
    "Singapore",
  ],

  serviceType: [
    "Freight Forwarding",
    "Customs Clearance",
    "Air Freight",
    "Sea Freight",
    "Import Export Documentation",
    "Warehousing",
  ],
};

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <>
      {/* FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              buildFaqSchema()
            ),
        }}
      />

      {/* BREADCRUMB */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      {/* LOCAL BUSINESS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              localBusinessSchema
            ),
        }}
      />

      <FAQClient
        initialCategory="all"
      />
    </>
  );
}