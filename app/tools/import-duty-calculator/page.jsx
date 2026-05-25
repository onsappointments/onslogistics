// app/resources/import-duty-calculator/page.jsx

import ImportDutyCalculator from "@/Components/resources/Importdutycalculator";

/* ─── SEO Metadata ──────────────────────────────────────────────────────────
   FIXES APPLIED:
   ✓ Title trimmed from 74 → 55 chars (Google truncates at ~60)
   ✓ Description trimmed from 195 → 155 chars (Google truncates at ~160)
   ✓ "18 product categories" corrected to "6 product categories"
   ✓ og:image added (critical for WhatsApp / LinkedIn / Twitter previews)
   ✓ FAQ answers expanded to 50+ words each (required for Google rich results)
   ✓ HowTo schema added (boosts SERP appearance for tool pages)
   ✓ datePublished + dateModified added to WebApplication
   ✓ inLanguage added
──────────────────────────────────────────────────────────────────────────── */

export const metadata = {
  title: "India Import Duty Calculator FY2025-26 | ONS Logistics",
  description:
    "Free India customs duty calculator for FY2025-26. Estimate BCD, IGST, SWS, and AIDC with FTA rates for ASEAN, Japan, UAE & South Korea. Instant landed cost.",

  keywords: [
    "customs duty calculator India",
    "import duty calculator India 2025",
    "BCD IGST calculator",
    "India import tax calculator",
    "customs duty on mobile phones India",
    "import duty on laptops India",
    "IGST on imports India",
    "India customs tariff 2025",
    "CIF value customs India",
    "FTA import duty India",
    "landed cost calculator India",
    "CBIC duty calculator",
  ],

  openGraph: {
    title: "India Import Duty Calculator FY2025-26 | ONS Logistics",
    description:
      "Calculate BCD, IGST, SWS and total landed cost for imports into India. Covers 6 product categories with live FTA concession rates.",
    url: "https://www.onslog.com/tools/import-duty-calculator",
    siteName: "ONS Logistics",
    type: "website",
    images: [
      {
        url: "https://www.onslog.com/og-duty-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "India Import Duty Calculator — ONS Logistics",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "India Import Duty Calculator FY2025-26 | ONS Logistics",
    description:
      "Free tool to estimate BCD, IGST, SWS, and total landed cost on imports into India. Includes FTA rates.",
    images: ["https://www.onslog.com/og-duty-calculator.jpg"],
  },

  alternates: {
    canonical: "https://www.onslog.com/tools/import-duty-calculator",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

/* ─── JSON-LD Schema ────────────────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    /* ── 1. WebApplication ── */
    {
      "@type": "WebApplication",
      "@id": "https://www.onslog.com/tools/import-duty-calculator#tool",
      name: "India Import Duty Calculator FY2025-26",
      url: "https://www.onslog.com/tools/import-duty-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "en-IN",
      datePublished: "2024-04-01",
      dateModified: "2026-05-21",
      description:
        "A free web-based calculator to estimate India customs import duty including Basic Customs Duty (BCD), Social Welfare Surcharge (SWS), IGST, and AIDC across 6 product categories for FY2025-26. Supports FTA concession rates and live currency conversion.",
      featureList: [
        "BCD calculation based on HS code category",
        "IGST computation on assessable value",
        "Social Welfare Surcharge (SWS) breakdown",
        "AIDC (Agriculture Infrastructure Development Cess) calculation",
        "FTA concession rates for ASEAN, Japan, UAE, South Korea",
        "Anti-dumping duty risk flagging",
        "Port and handling charge estimation",
        "Sea vs Air freight scenario comparison",
        "Live CIF-to-INR currency conversion for 7 currencies",
        "Total landed cost estimation",
        "One-click export of duty breakdown",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      provider: {
        "@type": "Organization",
        "@id": "https://www.onslog.com#about-us",
        name: "ONS Logistics India Pvt Ltd",
        url: "https://www.onslog.com",
      },
    },

    /* ── 2. HowTo — boosts SERP appearance for tool pages ── */
    {
      "@type": "HowTo",
      "@id": "https://www.onslog.com/tools/import-duty-calculator#howto",
      name: "How to Calculate India Import Duty Online",
      description:
        "Use the ONS Logistics Import Duty Calculator to estimate BCD, IGST, and total landed cost in four steps.",
      totalTime: "PT2M",
      tool: [{ "@type": "HowToTool", name: "India Import Duty Calculator" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Select your product category",
          text: "Choose from 6 HS-code-mapped product categories — Mobile Phones, Laptops, Electronic Components, Solar Panels, Automobile Parts, or Gold. The calculator automatically loads the applicable BCD, IGST, and AIDC rates for that category.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Enter your CIF value and currency",
          text: "Type the CIF (Cost, Insurance, Freight) value of your shipment. Select the invoice currency — USD, EUR, GBP, JPY, AED, CNY, or INR. The calculator converts to INR using live indicative exchange rates.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Set shipment variables",
          text: "Choose whether you are importing under an FTA (ASEAN, Japan, South Korea, or UAE), select Sea or Air freight, FCL or LCL container, and toggle port handling charges on or off.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Read your duty breakdown and landed cost",
          text: "The results panel shows BCD, SWS, IGST, compensation cess, handling charges, estimated anti-dumping duty (if applicable), total duty payable, effective duty rate, and total landed cost. Use the Export button to copy the summary.",
        },
      ],
    },

    /* ── 3. FAQPage ── */
    {
      "@type": "FAQPage",
      "@id": "https://www.onslog.com/tools/import-duty-calculator#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the customs duty on importing mobile phones into India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mobile phones classified under HS code 8517.12 attract a Basic Customs Duty (BCD) of 20% on the CIF value. On top of BCD, a Social Welfare Surcharge (SWS) of 10% of the BCD is levied. IGST at 18% is then applied on the total assessable value, which equals CIF plus BCD plus SWS. The combined effective duty rate for mobile phones works out to approximately 42–44% on the CIF value. There are currently no FTA concessions available for mobile phones from ASEAN, Japan, UAE, or South Korea — the BCD rate remains 20% regardless of origin.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate import duty on laptops in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laptops and computers classified under HS code 8471.30 currently attract nil Basic Customs Duty (BCD) under India's commitments to the WTO Information Technology Agreement (ITA). Although BCD is zero, IGST at 18% is still levied on the assessable value, which means the effective duty burden is approximately 18–20% when port and handling charges are included. The BCD nil rate is subject to annual Union Budget notifications and can be revised. Importers should verify the current rate on the CBIC ICES portal (ICEGATE) before placing their order.",
          },
        },
        {
          "@type": "Question",
          name: "What is IGST on imports and is it refundable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "IGST (Integrated Goods and Services Tax) is levied on all imports into India at the same rate as the domestic GST applicable to the same goods. For example, if mobile phones attract 18% GST domestically, they also attract 18% IGST on import. The IGST paid at customs can be fully claimed as Input Tax Credit (ITC) by GST-registered importers against their domestic GST liability on sales, making it effectively a working-capital cost rather than a permanent expense. Non-GST-registered importers, however, cannot claim ITC and bear IGST as a final cost.",
          },
        },
        {
          "@type": "Question",
          name: "Which countries have FTA agreements with India for lower import duty?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "India has active Free Trade Agreements (FTAs) and Comprehensive Economic Partnership Agreements (CEPAs) with ASEAN nations (including Indonesia, Vietnam, Thailand, Malaysia, Singapore), Japan, South Korea, and the UAE. Goods imported from these countries may qualify for reduced or nil BCD rates under the respective agreement, subject to Rules of Origin compliance and submission of a valid Certificate of Origin (CoO) from the exporting country. The actual FTA rate varies by product HS code — our calculator displays the applicable rate for each product category from each FTA partner.",
          },
        },
        {
          "@type": "Question",
          name: "What is CIF value for customs calculation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CIF (Cost, Insurance, Freight) is the transaction value of goods at the Indian port of entry, calculated as the sum of the cost of goods, export packing charges, marine insurance, and international freight up to the Indian port. Indian Customs uses CIF as the primary assessable value for computing import duty. If your supplier quotes FOB (Free on Board), you must add actual freight and insurance — typically 1.5–3% of FOB value for sea cargo — to arrive at the CIF figure before entering it into this calculator.",
          },
        },
        {
          "@type": "Question",
          name: "Does import duty apply to goods imported under the EPCG scheme?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under the Export Promotion Capital Goods (EPCG) scheme administered by DGFT, importers can bring in capital goods at 0% Basic Customs Duty. This exemption is conditional on fulfilling an export obligation equal to 6 times the duty saved, to be completed within 6 years from the date of issue of the EPCG licence. IGST exemption under EPCG requires a separate notification. The EPCG licence must be obtained before the import takes place — retrospective claims are not permitted.",
          },
        },
      ],
    },

    /* ── 4. BreadcrumbList ── */
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.onslog.com/tools/import-duty-calculator#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",  item: "https://www.onslog.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.onslog.com/tools" },
        { "@type": "ListItem", position: 3, name: "Import Duty Calculator", item: "https://www.onslog.com/tools/import-duty-calculator" },
      ],
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function ImportDutyCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImportDutyCalculator />
    </>
  );
}