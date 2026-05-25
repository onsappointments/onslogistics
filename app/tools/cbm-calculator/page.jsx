// app/tools/cbm-calculator/page.jsx

import CBMcalculator from "@/Components/resources/CBMcalculator";

/* ──────────────────────────────────────────────────────────────
   SEO OPTIMIZATION NOTES
   ✓ CTR-optimized title (~58 chars)
   ✓ Description optimized for Google truncation
   ✓ Added high-intent logistics keywords
   ✓ Added OpenGraph images
   ✓ Added Twitter large image card
   ✓ Expanded FAQ answers for rich snippets
   ✓ Added HowTo schema
   ✓ Added inLanguage + dates
   ✓ Added featureList enhancements
   ✓ Added container capacity keywords
   ✓ Optimized for AI search + featured snippets
────────────────────────────────────────────────────────────── */

export const metadata = {
  title:
    "CBM Calculator for Shipping & Freight | ONS Logistics",

  description:
    "Free CBM calculator for shipping, freight & logistics. Calculate cargo volume, volumetric weight, container capacity & chargeable weight instantly.",

  keywords: [
    "CBM calculator",
    "CBM calculator shipping",
    "cargo volume calculator",
    "cubic meter calculator",
    "container loading calculator",
    "volumetric weight calculator",
    "chargeable weight calculator",
    "air freight volumetric calculator",
    "sea freight CBM calculator",
    "freight volume calculator",
    "shipment volume calculator",
    "container capacity calculator",
    "logistics calculator India",
    "20ft container CBM",
    "40ft container CBM",
    "cargo cubic meter calculator",
    "air cargo volume calculator",
    "shipping container calculator",
    "LCL cargo calculator",
    "FCL volume calculator",
    "freight planning calculator",
    "volumetric weight formula",
    "CBM formula shipping",
    "container utilization calculator",
  ],

  openGraph: {
    title:
      "CBM Calculator for Shipping & Freight | ONS Logistics",

    description:
      "Calculate cargo CBM, volumetric weight, chargeable weight & container utilization instantly with our free logistics calculator.",

    url: "https://www.onslog.com/tools/cbm-calculator",

    siteName: "ONS Logistics",

    type: "website",

    images: [
      {
        url: "https://www.onslog.com/og-cbm-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "CBM Calculator for Shipping & Freight — ONS Logistics",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "CBM Calculator for Shipping & Freight | ONS Logistics",

    description:
      "Free CBM calculator to calculate cargo volume, volumetric weight, and shipping container capacity.",

    images: [
      "https://www.onslog.com/og-cbm-calculator.jpg",
    ],
  },

  alternates: {
    canonical:
      "https://www.onslog.com/tools/cbm-calculator",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/* ──────────────────────────────────────────────────────────────
   JSON-LD STRUCTURED DATA
────────────────────────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",

  "@graph": [
    /* ──────────────────────────────
       1. WebApplication
    ────────────────────────────── */

    {
      "@type": "WebApplication",

      "@id":
        "https://www.onslog.com/tools/cbm-calculator#tool",

      name:
        "CBM Calculator for Shipping & Freight",

      url:
        "https://www.onslog.com/tools/cbm-calculator",

      applicationCategory:
        "BusinessApplication",

      operatingSystem: "Any",

      inLanguage: "en-IN",

      datePublished: "2024-04-01",

      dateModified: "2026-05-23",

      description:
        "Free online CBM calculator for calculating cargo volume, volumetric weight, chargeable weight, and shipping container utilization for sea freight, air freight, logistics, and freight forwarding operations.",

      featureList: [
        "Calculate cargo volume in cubic meters (CBM)",
        "Volumetric weight calculation for air freight",
        "Chargeable weight estimation",
        "Supports centimeters, inches, feet, and meters",
        "Container capacity estimation",
        "20ft and 40ft container utilization calculation",
        "Multi-carton shipment support",
        "LCL and FCL shipment planning",
        "Real-time logistics volume calculation",
        "Sea freight and air freight compatibility",
        "Freight planning optimization",
        "Cargo density estimation",
      ],

      offers: {
        "@type": "Offer",

        price: "0",

        priceCurrency: "INR",
      },

      provider: {
        "@type": "Organization",

        "@id":
          "https://www.onslog.com#about-us",

        name:
          "ONS Logistics India Pvt Ltd",

        url: "https://www.onslog.com",
      },
    },

    /* ──────────────────────────────
       2. HowTo Schema
    ────────────────────────────── */

    {
      "@type": "HowTo",

      "@id":
        "https://www.onslog.com/tools/cbm-calculator#howto",

      name:
        "How to Calculate CBM for Shipping",

      description:
        "Use the ONS Logistics CBM Calculator to calculate cargo volume, volumetric weight, and container utilization in minutes.",

      totalTime: "PT2M",

      tool: [
        {
          "@type": "HowToTool",

          name: "CBM Calculator",
        },
      ],

      step: [
        {
          "@type": "HowToStep",

          position: 1,

          name:
            "Enter cargo dimensions",

          text:
            "Enter the length, width, and height of your shipment in centimeters, meters, inches, or feet. The calculator automatically converts units into cubic meters (CBM).",
        },

        {
          "@type": "HowToStep",

          position: 2,

          name:
            "Enter quantity and weight",

          text:
            "Add the number of cartons or packages and the actual cargo weight to calculate total shipment volume and compare gross weight with volumetric weight.",
        },

        {
          "@type": "HowToStep",

          position: 3,

          name:
            "Choose shipment type",

          text:
            "Select whether the cargo is being shipped via sea freight, air freight, LCL, or FCL to calculate chargeable weight and estimated container utilization.",
        },

        {
          "@type": "HowToStep",

          position: 4,

          name:
            "View CBM and freight results",

          text:
            "The calculator instantly shows total CBM, volumetric weight, chargeable weight, estimated container capacity usage, and freight planning insights for logistics optimization.",
        },
      ],
    },

    /* ──────────────────────────────
       3. FAQ Schema
    ────────────────────────────── */

    {
      "@type": "FAQPage",

      "@id":
        "https://www.onslog.com/tools/cbm-calculator#faq",

      mainEntity: [
        {
          "@type": "Question",

          name:
            "What is CBM in shipping and logistics?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "CBM stands for Cubic Meter, which is the standard unit used globally in shipping and logistics to measure cargo volume. Freight forwarders, shipping lines, airlines, and logistics companies use CBM to determine how much space cargo occupies inside a shipping container, aircraft, truck, or warehouse. CBM plays a critical role in calculating freight costs, volumetric weight, chargeable weight, and container utilization for both air freight and sea freight shipments.",
          },
        },

        {
          "@type": "Question",

          name:
            "How do I calculate CBM for cargo shipments?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "CBM is calculated using the formula Length × Width × Height. All dimensions must be converted into meters before multiplication. For example, a shipment measuring 2m × 1.5m × 1m has a volume of 3 CBM. If multiple cartons are being shipped, multiply the CBM of one carton by the total quantity to calculate total cargo volume.",
          },
        },

        {
          "@type": "Question",

          name:
            "Why is CBM important in freight forwarding?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "CBM is one of the most important metrics in freight forwarding because shipping companies use cargo volume to determine freight pricing, container planning, pallet optimization, and warehouse space allocation. In air freight, volumetric weight is calculated using cargo dimensions rather than actual weight, making CBM critical for estimating shipping costs accurately.",
          },
        },

        {
          "@type": "Question",

          name:
            "What is the CBM capacity of a 20-foot container?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "A standard 20-foot shipping container typically has an internal cargo volume capacity of approximately 33 cubic meters (CBM). The actual usable capacity may vary slightly depending on pallet configuration, cargo shape, stacking limitations, and packaging dimensions. The maximum payload weight of a 20ft container is generally around 28 metric tonnes.",
          },
        },

        {
          "@type": "Question",

          name:
            "What is the CBM capacity of a 40-foot container?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "A standard 40-foot shipping container usually provides approximately 67 cubic meters (CBM) of internal cargo space. High Cube (HC) containers offer slightly higher volume capacity at around 76 CBM. Actual utilization depends on carton dimensions, palletization, stacking restrictions, and cargo type.",
          },
        },

        {
          "@type": "Question",

          name:
            "How is volumetric weight calculated in air freight?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "Volumetric weight in air freight is calculated using the formula Length × Width × Height ÷ 5000 when dimensions are entered in centimeters. Airlines compare volumetric weight with actual gross weight and charge based on whichever is higher. This is known as chargeable weight and is widely used in air cargo pricing.",
          },
        },

        {
          "@type": "Question",

          name:
            "What is chargeable weight in logistics?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "Chargeable weight is the higher value between actual cargo weight and volumetric weight. Logistics companies and airlines use chargeable weight to determine freight charges because lightweight but bulky cargo occupies significant cargo space even if it weighs less physically.",
          },
        },
      ],
    },

    /* ──────────────────────────────
       4. Breadcrumb Schema
    ────────────────────────────── */

    {
      "@type": "BreadcrumbList",

      "@id":
        "https://www.onslog.com/tools/cbm-calculator#breadcrumb",

      itemListElement: [
        {
          "@type": "ListItem",

          position: 1,

          name: "Home",

          item:
            "https://www.onslog.com",
        },

        {
          "@type": "ListItem",

          position: 2,

          name: "Tools",

          item:
            "https://www.onslog.com/tools",
        },

        {
          "@type": "ListItem",

          position: 3,

          name: "CBM Calculator",

          item:
            "https://www.onslog.com/tools/cbm-calculator",
        },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────── */

export default function CbmCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <CBMcalculator />
    </>
  );
}