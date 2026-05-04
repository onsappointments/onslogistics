import ArticleCard from "./ArticleCard";

export default function RelatedArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <div className="mt-16">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-semibold">
          Continue Reading
        </h3>

        <span className="text-sm text-gray-400">
          Related guides
        </span>
      </div>

      {/* GRID */}
      <div
        className={`grid gap-6 ${
          articles.length === 1
            ? "md:grid-cols-1"
            : articles.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
        }`}
      >
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {/* OPTIONAL BOTTOM LINK */}
      <div className="mt-8 text-center">
        <a
          href="/resources"
          className="text-blue-600 font-medium hover:underline"
        >
          Explore all articles →
        </a>
      </div>
    </div>
  );
}