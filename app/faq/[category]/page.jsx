// app/faq/[category]/page.jsx  —  dynamic per-category FAQ pages
// Each category gets its own URL, title, description, and schema
// e.g.  /faq/pricing  /faq/time  /faq/comparison  /faq/customs  etc.

import { notFound } from "next/navigation";
import FAQClient from "../FAQClient";
import { categoryMeta, getValidCategoryIds, faqs, categories } from "../faq-data";

// ─── Static generation ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getValidCategoryIds().map((cat) => ({ category: cat }));
}

// ─── Dynamic metadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { category } = await params;
  const meta = categoryMeta[category];

  if (!meta) {
    return {
      title: "FAQ | ONS Logistics",
      description: "International trade and freight FAQs from ONS Logistics.",
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://onslog.com/faq/${category}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://onslog.com/faq/${category}`,
      type: "website",
    },
  };
}

// ─── Per-category FAQ schema ───────────────────────────────────────────────
function buildCategorySchema(categoryId, categoryLabel) {
  const group = faqs.find((g) => g.cat === categoryId);
  if (!group) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.directAnswer
          ? `${item.directAnswer} ${item.a}`
          : item.a,
      },
    })),
  };
}

// ─── Breadcrumb for category pages ────────────────────────────────────────
function buildBreadcrumb(categoryId, categoryLabel) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://onslog.com" },
      { "@type": "ListItem", position: 2, name: "FAQ", item: "https://onslog.com/faq" },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: `https://onslog.com/faq/${categoryId}`,
      },
    ],
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function FAQCategoryPage({ params }) {
  const { category } = await params;

  // Guard — redirect unknown slugs to 404
  const validIds = getValidCategoryIds();
  if (!validIds.includes(category)) notFound();

  const catObj    = categories.find((c) => c.id === category);
  const catLabel  = catObj?.label ?? category;
  const faqSchema = buildCategorySchema(category, catLabel);
  const bcSchema  = buildBreadcrumb(category, catLabel);

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bcSchema) }}
      />

      {/* H1 override for category page (screen-reader + SEO) */}
      {categoryMeta[category]?.h1 && (
        <div className="sr-only">
          <h1>{categoryMeta[category].h1}</h1>
        </div>
      )}

      <FAQClient initialCategory={category} />
    </>
  );
}