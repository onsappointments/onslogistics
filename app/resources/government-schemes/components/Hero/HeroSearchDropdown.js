import HeroSearchItem from "./HeroSearchItem";

export default function HeroSearchDropdown({
  query,
  results,
  onSelect,
  activeIndex,
}) {
  if (!query) return null;

  return (
    <div className="absolute left-0 right-0 z-50 mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      {results.length ? (
        results.map((article, index) => (
          <HeroSearchItem
            key={article.slug}
            article={article}
            active={activeIndex === index}
            onClick={() => onSelect(article)}
          />
        ))
      ) : (
        <div className="p-6 text-center text-gray-500">
          No matching government scheme found.
        </div>
      )}
    </div>
  );
}