// app/locations/[city]/[slug]/page.jsx

import { notFound } from "next/navigation";

import { locationsData } from "@/lib/locations/locationsData";

import LocationHero from "@/Components/locations/LocationHero";
import LocationOverview from "@/Components/locations/LocationOverview";
import LocationLocalContext from "@/Components/locations/LocationLocalContext";
import LocationProcess from "@/Components/locations/LocationProcess";
import LocationArticles from "@/Components/locations/LocationArticles";
import LocationFAQs from "@/Components/locations/LocationFAQs";
import LocationCTA from "@/Components/locations/LocationCTA";


// =========================
// SEO
// =========================

export async function generateMetadata({ params }) {

  const serviceGroup = locationsData[params.slug];

  const pageData = serviceGroup?.[params.city];

  if (!pageData) {
    return {};
  }

  return {
    title: pageData.seoTitle,

    description: pageData.metaDescription,

    keywords: pageData.keywords,

    openGraph: {
      title: pageData.seoTitle,
      description: pageData.metaDescription,
      images: [pageData.heroImage],
    },
  };
}


// =========================
// PAGE
// =========================

export default function LocationPage({ params }) {

  const serviceGroup = locationsData[params.slug];

  const pageData = serviceGroup?.[params.city];

  if (!pageData) {
    notFound();
  }

  return (

    <main className="bg-[#F5F7FA] overflow-hidden">

      <LocationHero data={pageData} />

      <LocationOverview data={pageData} />

      <LocationLocalContext data={pageData} />

      <LocationProcess data={pageData} />

      <LocationArticles data={pageData} />

      <LocationFAQs data={pageData} />

      <LocationCTA data={pageData} />

    </main>

  );
}