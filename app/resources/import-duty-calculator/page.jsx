// app/resources/import-duty-calculator/page.jsx
// Drop ImportDutyCalculator.jsx alongside this file, or adjust the import path.

import ImportDutyCalculator from "@/Components/resources/Importdutycalculator";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

export const metadata = {
  title: "India Import Duty Calculator 2025 | Customs Duty Estimator — ONS Logistics",
  description:
    "Free India customs duty calculator for 2025. Estimate Basic Customs Duty (BCD), IGST, SWS, and AIDC on 18 product categories. Includes FTA concession rates for Japan, UAE, South Korea, and ASEAN.",
  keywords: [
    "customs duty calculator India",
    "import duty calculator India 2025",
    "BCD IGST calculator",
    "India import tax calculator",
    "customs duty on mobile phones India",
    "import duty on laptops India",
    "IGST on imports India",
    "India customs tariff 2025",
    "freight forwarder customs duty",
    "CIF value customs India",
  ],
  openGraph: {
    title: "India Import Duty Calculator 2025 — Free Customs Estimator",
    description:
      "Calculate BCD, IGST, SWS and total landed cost for imports into India. Covers 18 product categories with FTA concession rates.",
    url: "https://www.onslogistics.in/resources/import-duty-calculator",
    siteName: "ONS Logistics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Import Duty Calculator 2025 — ONS Logistics",
    description:
      "Free tool to estimate customs duty, IGST, and total landed cost on imports into India.",
  },
  alternates: {
    canonical: "https://www.onslogistics.in/resources/import-duty-calculator",
  },
};

// ─── JSON-LD Schema ──────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://www.onslogistics.in/resources/import-duty-calculator#tool",
      name: "India Import Duty Calculator 2025",
      url: "https://www.onslogistics.in/resources/import-duty-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "A free web-based calculator to estimate India customs import duty including Basic Customs Duty (BCD), Social Welfare Surcharge (SWS), IGST, and AIDC across 18 product categories for FY2025-26.",
      featureList: [
        "BCD calculation based on HS code category",
        "IGST computation on assessable value",
        "SWS and AIDC breakdown",
        "FTA concession rates for ASEAN, Japan, UAE, South Korea",
        "Total landed cost estimation",
        "Currency conversion support",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      provider: {
        "@type": "Organization",
        "@id": "https://www.onslogistics.in#organization",
        name: "ONS Logistics India Pvt Ltd",
        url: "https://www.onslogistics.in",
      },
    },
    {
      "@type": "FAQPage",
      "@id":
        "https://www.onslogistics.in/resources/import-duty-calculator#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the customs duty on importing mobile phones into India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mobile phones (HS code 8517.12) attract a Basic Customs Duty (BCD) of 20% on the CIF value, plus 10% Social Welfare Surcharge on the BCD, and 18% IGST on the total assessable value. The effective total duty rate works out to approximately 42–44% on the CIF value.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate import duty on laptops in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laptops and computers (HS code 8471) currently attract nil Basic Customs Duty under India's commitments to the WTO Information Technology Agreement (ITA). However, 18% IGST is applicable on the CIF value. The effective duty is therefore around 18–20% when handling is included.",
          },
        },
        {
          "@type": "Question",
          name: "What is IGST on imports and is it refundable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "IGST (Integrated GST) is levied on all imports at the same rate as domestic supply of the same goods. The IGST paid at customs can be fully claimed as Input Tax Credit (ITC) against the importer's GST liability, making it effectively a working-capital requirement rather than a final cost for GST-registered importers.",
          },
        },
        {
          "@type": "Question",
          name: "Which countries have FTA agreements with India for lower import duty?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "India has active FTAs and CEPAs with ASEAN nations, Japan, South Korea, UAE, and Mauritius. Goods from these countries may qualify for reduced BCD rates, subject to Rules of Origin compliance and a valid Certificate of Origin.",
          },
        },
        {
          "@type": "Question",
          name: "What is CIF value for customs calculation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CIF (Cost, Insurance, Freight) is the value of goods at the Indian port of entry, including product cost, export packing, insurance, and international freight. Indian customs uses CIF as the assessable value for duty calculation.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id":
        "https://www.onslogistics.in/resources/import-duty-calculator#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.onslogistics.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resources",
          item: "https://www.onslogistics.in/resources",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Import Duty Calculator",
          item: "https://www.onslogistics.in/resources/import-duty-calculator",
        },
      ],
    },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImportDutyCalculatorPage() {
  return (
    <>
      {/* JSON-LD structured data — read by Google, invisible to users */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ImportDutyCalculator />
    </>
  );
}