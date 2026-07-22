import schemeExplorer from "../../data/schemeExplorer";

import SchemeCategoryCard from "./SchemeCategoryCard";

export default function SchemeExplorer({ onSelect }) {
  return (
    <section
      id="scheme-explorer"
      aria-labelledby="scheme-explorer-heading"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Government Trade Schemes
          </span>

          <h2
            id="scheme-explorer-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl"
          >
            Find the Right Scheme for Your Business
          </h2>

          <p className="mt-3 text-lg leading-8 text-gray-600">
            Different businesses benefit from different government
            programmes. Explore schemes based on your business goals,
            import-export activities, manufacturing operations, and
            compliance requirements.
          </p>
        </div>

        {/* Grid */}

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {schemeExplorer.map((item) => (
            <SchemeCategoryCard
              key={item.id}
              {...item}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}