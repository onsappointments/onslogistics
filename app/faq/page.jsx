// app/faq/page.jsx  —  main FAQ index page
import FAQClient from "./FAQClient";
import { faqs, getAllItems } from "./faq-data";

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export const metadata = {
  title: "Import Export FAQ | Freight Forwarding & Customs Clearance | ONS Logistics",
  description:
    "Get expert answers on international shipping costs, transit times, customs clearance in India, duties, and trade documents — from ONS Logistics, Ludhiana.",
  alternates: { canonical: "https://onslog.com/faq" },
  openGraph: {
    title: "Import Export FAQ | ONS Logistics",
    description:
      "Shipping costs, air vs sea freight, customs clearance timelines, and India trade regulations — answered by ONS Logistics experts.",
    url: "https://onslog.com/faq",
    type: "website",
  },
  // Keywords hint for crawlers (not a ranking factor but useful for context)
  other: {
    keywords:
      "international shipping cost from India, customs clearance Ludhiana, air freight India, sea freight India, IEC code, import duties India, freight forwarder Punjab",
  },
};

// ─── FAQ Schema (FAQPage + local business breadcrumb) ─────────────────────────
function buildFaqSchema() {
  const allItems = getAllItems();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        // AEO: direct answer first, then full answer
        text: item.directAnswer
          ? `${item.directAnswer} ${item.a}`
          : item.a,
      },
    })),
  };
}

// ─── Breadcrumb Schema ────────────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://onslog.com" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://onslog.com/faq" },
  ],
};

// ─── Local Business Schema ────────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ONS Logistics",
  description:
    "International freight forwarder and customs clearance agent based in Ludhiana, Punjab, serving importers and exporters across India.",
  url: "https://onslog.com",
  telephone: "+91-1800-890-7365",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ludhiana",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
  areaServed: ["India", "UAE", "USA", "UK", "Australia", "Canada", "Singapore"],
  serviceType: [
    "Freight Forwarding",
    "Customs Clearance",
    "Air Freight",
    "Sea Freight",
    "Import Export Documentation",
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <FAQClient initialCategory="all" />
    </>
  );
}