// app/industries/[slug]/page.jsx

import { notFound } from "next/navigation";
import { getIndustryBySlug, industries } from "@/lib/industry-data";
import { IndustryHero, IndustryStats, IndustryContent, IndustryFAQs, IndustryArticles, IndustryCTA } from "@/Components/industry/Index";

/* ── Static Params ─────────────────────────────── */
export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

/* ── Metadata ───────────────────────────────────── */
export async function generateMetadata({ params }) {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) return {};
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    keywords: industry.keywords,
    alternates: {
      canonical: `https://onslog.com/industries/${params.slug}`,
    },
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      type: "website",
      url: `https://onslog.com/industries/${params.slug}`,
    },
  };
}
/* ── Page ───────────────────────────────────────── */
export default function IndustryPage({ params }) {
  const   industry = getIndustryBySlug(params.slug);
  if (!industry) notFound();

  return (
    <main className="bg-white">
      <IndustryHero industry={industry} />
      {/* <IndustryStats stats={industry.stats} /> */}
      <IndustryContent sections={industry.sections} />
      <IndustryFAQs faqs={industry.faqs} industryTitle={industry.title} />
      <IndustryArticles articles={industry.articles} />
      <IndustryCTA industry={industry} />
    </main>
  );
}