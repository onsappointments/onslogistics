import Hero from "./components/Hero/Hero";
import TrustBar from "./components/TrustBar/TrustBar";

import CustomsOverview from "./components/CustomsOverview/CustomsOverview";
import Journey from "./components/Journey/Journey";
import Documentation from "./components/Documentation/Documentation";
import Industries from "./components/Industries/Industries";
import WhyONS from "./components/WhyONS/WhyONS";
import Challenges from "./components/Challenges/Challenges";

import ReadyForClearance from "./components/CTA/ReadyForClearance";
import FAQ from "./components/FAQ/FAQ";
import FinalCTA from "./components/CTA/FinalCTA";
import { customsClearanceSchema } from "./schema";
// Future Sections
// import KnowledgeHub from "./components/KnowledgeHub/KnowledgeHub";
// import NearbyInfrastructure from "./components/ICDGuide/ICDGuide";
// import StickyCTA from "./components/CTA/StickyCTA";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Custom Broker in Ludhiana | Import & Export Customs Clearance | ONS Logistics India";

  const description =
    "Looking for a licensed customs broker in Ludhiana? ONS Logistics provides import and export customs clearance, Bill of Entry filing, Shipping Bill preparation, ICEGATE guidance, HS Code assistance, documentation review and freight coordination for businesses shipping through Ludhiana, CONCOR Dhandari Kalan, GRFL ICD and Pristine Logistics Park.";

  const url =
    "https://www.onslog.com/customs-clearance/ludhiana";

  return {
    metadataBase: new URL("https://www.onslog.com"),

    title,

    description,

    applicationName: "ONS Logistics India",

    keywords: [
      "Custom Broker Ludhiana",
      "Customs Broker Ludhiana",
      "Customs Clearance Ludhiana",
      "CHA Ludhiana",
      "Import Customs Clearance",
      "Export Customs Clearance",
      "Bill of Entry",
      "Shipping Bill",
      "ICEGATE",
      "HS Code",
      "DGFT",
      "Freight Forwarding",
      "CONCOR Dhandari Kalan",
      "GRFL ICD",
      "Pristine Logistics Park",
    ],

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    openGraph: {
      type: "website",

      url,

      siteName: "ONS Logistics India",

      title,

      description,

      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,
    },

    category: "Logistics",

    creator: "ONS Logistics India",

    publisher: "ONS Logistics India",
  };
}

export const dynamic = "force-static";

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(customsClearanceSchema),
  }}
/>

export default function CustomsClearanceLudhianaPage() {
  return (
    <main className="bg-white overflow-x-hidden">

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= TRUST BAR ================= */}
      <TrustBar />

      {/* ================= OVERVIEW ================= */}
      <CustomsOverview />

      {/* ================= IMPORT / EXPORT JOURNEY ================= */}
      <Journey />

      {/* ================= DOCUMENTATION ================= */}
      <Documentation />

      {/* ================= INDUSTRY EXPERTISE ================= */}
      <Industries />

      {/* ================= WHY ONS ================= */}
      <WhyONS />

      {/* ================= CHALLENGES ================= */}
      <Challenges />

      {/* ================= PRE-QUOTE SECTION ================= */}
      <ReadyForClearance />

      {/* ================= FAQ ================= */}
      <FAQ />

      {/* ================= KNOWLEDGE HUB ================= */}
      {/* <KnowledgeHub /> */}

      {/* ================= FINAL CTA ================= */}
      <FinalCTA />

      {/* ================= STICKY CTA ================= */}
      {/* <StickyCTA /> */}

    </main>
  );
}