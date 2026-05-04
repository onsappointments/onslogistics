import { articles } from "@/lib/data";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/utils";

import { generateTOC } from "@/lib/toc";

import HighlightBox from "@/Components/resources/HighlightBox";
import RelatedArticles from "@/Components/resources/RelatedArticles";
import TableOfContents from "@/Components/resources/TableOfContents";
import CTASection from "@/Components/resources/CTASection";
import { extractFAQs } from "@/lib/faqExtractor";
import RelatedFAQs from "@/Components/resources/RelatedFAQs";

// 🔹 Static generation (SEO boost)
export async function generateStaticParams() {
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

// 🔹 Helper (same as toc)
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug, articles);

  if (!article) return <div>Not found</div>;

  const related = getRelatedArticles(article, articles);
  const toc = generateTOC(article);
  const faqs = extractFAQs(article);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

      {/* MAIN CONTENT */}
      <div className="md:col-span-3">

        {/* HEADER */}
        <div className="mb-8">
          <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            {article.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            {article.title}
          </h1>

          <p className="text-gray-600">
            {article.description}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            {article.readTime} min read
          </p>
        </div>

        {/* DIRECT ANSWER */}
        <HighlightBox>
          {article.directAnswer}
        </HighlightBox>

        {/* INTRO */}
        <div className="mt-8 space-y-4 text-gray-700">
          {article.intro?.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* SECTIONS */}
        {article.sections.map((section, i) => (
          <div key={i} className="mt-12">

            {/* H2 */}
            <h2
              id={slugify(section.heading)}
              className="text-2xl font-semibold scroll-mt-28"
            >
              {section.heading}
            </h2>

            {/* NORMAL CONTENT */}
            {section.content?.map((block, j) => {
              if (block.type === "p") {
                return (
                  <p key={j} className="mt-4 text-gray-700">
                    {block.text}
                  </p>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={j} className="list-disc pl-6 mt-4 space-y-2">
                    {block.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (block.type === "table") {
                return (
                  <div key={j} className="overflow-x-auto mt-6">
                    <table className="w-full border rounded-xl overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          {block.headers.map((h, idx) => (
                            <th key={idx} className="p-3 text-left text-sm">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, idx) => (
                          <tr key={idx} className="border-t">
                            {row.map((cell, cidx) => (
                              <td key={cidx} className="p-3 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
            })}

            {/* STEPS */}
            {section.steps?.map((step, k) => (
              <div key={k} className="mt-6">

                <h3
                  id={slugify(step.title)}
                  className="text-xl font-semibold scroll-mt-28"
                >
                  {step.title}
                </h3>

                {step.content.map((block, j) => {
                  if (block.type === "p") {
                    return (
                      <p key={j} className="mt-2 text-gray-700">
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === "list") {
                    return (
                      <ul key={j} className="list-disc pl-6 mt-2">
                        {block.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                })}
              </div>
            ))}
          </div>
        ))}

        {/* KEY TAKEAWAYS */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-2xl mt-16">
          <h3 className="font-semibold mb-3">
            Key Takeaways
          </h3>

          <ul className="list-disc pl-6 space-y-2">
            {article.keyTakeaways.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </div>

        <RelatedFAQs faqs={faqs} />

        {/* RELATED */}
        <RelatedArticles articles={related} />

        {/* CTA */}
        <CTASection />
      </div>

      {/* SIDEBAR */}
      <div className="hidden md:block">
        <div className="sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">

          {/* SCROLLABLE TOC */}
          <div className="overflow-y-auto pr-2">
            <TableOfContents toc={toc} />
          </div>

        </div>
      </div>
    </div>
  );
}