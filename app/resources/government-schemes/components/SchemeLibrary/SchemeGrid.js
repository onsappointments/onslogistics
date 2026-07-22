import SchemeCard from "./SchemeCard";

export default function SchemeGrid({ articles }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <SchemeCard
          key={article.slug}
          article={article}
        />
      ))}
    </div>
  );
}