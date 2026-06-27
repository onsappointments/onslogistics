import { faqData } from "./components/FAQ/faq.data";

const BASE_URL = "https://www.onslog.com";

const PAGE_URL = `${BASE_URL}/customs-clearance/ludhiana`;

export const customsClearanceSchema = {
  "@context": "https://schema.org",
  "@graph": [
    // ---------------------------------------------------------------------
    // ORGANIZATION
    // ---------------------------------------------------------------------

    {
      "@type": "Organization",

      "@id": `${BASE_URL}#organization`,

      name: "ONS Logistics India Pvt. Ltd.",

      url: BASE_URL,

      logo: `${BASE_URL}/logo.png`,

      description:
        "ONS Logistics India Pvt. Ltd. provides freight forwarding, customs clearance, international shipping and supply chain solutions across India.",

      telephone: "+91-1800-890-7365",

      email: "info@onslog.com",

      sameAs: [
        "https://www.linkedin.com/company/ons-logistics-india-pvt-ltd/",
      ],
    },

    // ---------------------------------------------------------------------
    // LOCAL BUSINESS
    // ---------------------------------------------------------------------

    {
      "@type": "LocalBusiness",

      "@id": `${PAGE_URL}#localbusiness`,

      name: "ONS Logistics India Pvt. Ltd.",

      image: `${BASE_URL}/og-image.jpg`,

      url: PAGE_URL,

      telephone: "+91-1800-890-7365",

      email: "info@onslog.com",

      address: {
        "@type": "PostalAddress",

        streetAddress:
          "Gate No. 7, Chandigarh Road, Near Radha Soami Satsang Bhawan, Aatma Nagar, Mundian",

        addressLocality: "Ludhiana",

        addressRegion: "Punjab",

        postalCode: "141015",

        addressCountry: "IN",
      },

      areaServed: [
        "Ludhiana",
        "Punjab",
        "India",
      ],

      priceRange: "$$",
    },

    // ---------------------------------------------------------------------
    // SERVICE
    // ---------------------------------------------------------------------

    {
      "@type": "Service",

      "@id": `${PAGE_URL}#service`,

      serviceType: "Customs Clearance",

      name: "Import & Export Customs Clearance Services",

      provider: {
        "@id": `${BASE_URL}#organization`,
      },

      areaServed: {
        "@type": "City",

        name: "Ludhiana",
      },

      description:
        "Professional import and export customs clearance, documentation review, Bill of Entry filing, Shipping Bill filing, ICEGATE guidance, HS Code assistance and freight coordination.",

      hasOfferCatalog: {
        "@type": "OfferCatalog",

        name: "Customs Clearance Services",

        itemListElement: [
          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",

              name: "Import Customs Clearance",
            },
          },
          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",

              name: "Export Customs Clearance",
            },
          },
          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",

              name: "Bill of Entry Filing",
            },
          },
          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",

              name: "Shipping Bill Filing",
            },
          },
          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",

              name: "ICEGATE Assistance",
            },
          },
        ],
      },
    },

    // ---------------------------------------------------------------------
    // WEBPAGE
    // ---------------------------------------------------------------------

    {
      "@type": "WebPage",

      "@id": PAGE_URL,

      url: PAGE_URL,

      name: "Custom Broker in Ludhiana | Customs Clearance Services",

      isPartOf: {
        "@id": `${BASE_URL}#website`,
      },

      about: {
        "@id": `${PAGE_URL}#service`,
      },

      primaryImageOfPage: `${BASE_URL}/og-image.jpg`,

      inLanguage: "en-IN",

      description:
        "Import and export customs clearance services for businesses in Ludhiana and nearby ICD facilities.",
    },

    // ---------------------------------------------------------------------
    // WEBSITE
    // ---------------------------------------------------------------------

    {
      "@type": "WebSite",

      "@id": `${BASE_URL}#website`,

      url: BASE_URL,

      name: "ONS Logistics India",

      publisher: {
        "@id": `${BASE_URL}#organization`,
      },
    },

    // ---------------------------------------------------------------------
    // BREADCRUMB
    // ---------------------------------------------------------------------

    {
      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",

          position: 1,

          name: "Home",

          item: BASE_URL,
        },

        {
          "@type": "ListItem",

          position: 2,

          name: "Customs Clearance",

          item: `${BASE_URL}/customs-clearance`,
        },

        {
          "@type": "ListItem",

          position: 3,

          name: "Ludhiana",

          item: PAGE_URL,
        },
      ],
    },

    // ---------------------------------------------------------------------
    // FAQ
    // ---------------------------------------------------------------------

    {
      "@type": "FAQPage",

      mainEntity: faqData.map((faq) => ({
        "@type": "Question",

        name: faq.question,

        acceptedAnswer: {
          "@type": "Answer",

          text: faq.answer,
        },
      })),
    },
  ],
};