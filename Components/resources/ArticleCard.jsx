import Link from "next/link";

export default function ArticleCard({ article, featured = false }) {
  return (
    <Link href={`/resources/${article.slug}`}>

      <div
        className={`group relative h-full rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${
          featured
            ? "bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-md hover:shadow-lg"
            : "bg-white border-gray-200 hover:shadow-md"
        }`}
      >

        {/* CONTENT */}
        <div className="p-5 flex flex-col h-full">

          {/* TOP META */}
          <div className="flex items-center justify-between mb-3">

            {/* CATEGORY */}
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
              {article.category}
            </span>

            {/* READ TIME */}
            <span className="text-xs text-gray-400">
              {article.readTime} min read
            </span>
          </div>

          {/* TITLE */}
          <h3 className="text-lg font-semibold mb-2 leading-snug group-hover:text-blue-600 transition">
            {article.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {article.description}
          </p>

          {/* SPACER */}
          <div className="flex-grow" />

          {/* FOOTER */}
          <div className="mt-4 flex items-center justify-between">

            {/* READ MORE */}
            <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              Read Guide
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>

            {/* OPTIONAL TAG */}
            {article.featured && (
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-t from-black/5 to-transparent" />

      </div>
    </Link>
  );
}