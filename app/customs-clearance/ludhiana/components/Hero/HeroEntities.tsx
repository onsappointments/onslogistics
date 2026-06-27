import { CheckCircle2 } from "lucide-react";

import { HeroCapability } from "./types";

interface HeroEntitiesProps {
  entities: HeroCapability[];
}

export default function HeroEntities({
  entities,
}: HeroEntitiesProps) {
  return (
    <section
      aria-labelledby="hero-entities-heading"
      className="w-full"
    >
      <h2
        id="hero-entities-heading"
        className="sr-only"
      >
        Customs Clearance Expertise
      </h2>

      <div className="flex flex-wrap gap-3">
        {entities.map((entity) => {
          const Icon = entity.icon;

          return (
            <div
              key={entity.id}
              className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-white">
                <Icon className="h-4 w-4 text-blue-700" />
              </div>

              <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
                {entity.label}
              </span>

              <CheckCircle2 className="h-4 w-4 text-green-600 opacity-80" />
            </div>
          );
        })}
      </div>
    </section>
  );
}