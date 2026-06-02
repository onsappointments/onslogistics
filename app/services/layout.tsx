import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Logistics Services in India | Freight Forwarding, Customs Clearance & Transportation | ONS Logistics India",

  description:
    "ONS Logistics India provides freight forwarding, customs clearance, air freight, sea freight, road transportation, project cargo, import-export consulting, and end-to-end logistics solutions across India and global trade routes.",

  alternates: {
    canonical: "https://www.onslog.com/services",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title:
      "Logistics Services in India | ONS Logistics India",
    description:
      "Freight forwarding, customs clearance, air freight, sea freight, road transportation, project cargo and supply chain solutions across India.",
    url: "https://www.onslog.com/services",
    siteName: "ONS Logistics India",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Logistics Services in India | ONS Logistics India",
    description:
      "Freight forwarding, customs clearance, air freight, sea freight, road transportation and logistics solutions across India.",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Logistics Services in India",
  description:
    "ONS Logistics India provides freight forwarding, customs clearance, air freight, sea freight, road transportation, project cargo and import-export logistics services across India and international trade routes.",
  provider: {
    "@type": "Organization",
    name: "ONS Logistics India",
    url: "https://www.onslog.com",
    logo: "https://www.onslog.com/logo.png",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  serviceType: [
    "Freight Forwarding",
    "Customs Clearance",
    "Air Freight",
    "Sea Freight",
    "Road Transportation",
    "Import Export Consultation",
    "Project Cargo",
    "Supply Chain Solutions",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.onslog.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://www.onslog.com/services",
    },
  ],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {children}
    </>
  );
}