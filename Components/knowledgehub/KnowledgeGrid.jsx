"use client";

import FeaturedKnowledgeCard from "./FeaturedKnowledgeCard";
import KnowledgeCard from "./KnowledgeCard";

import { knowledgeAreas } from "./data";

export default function KnowledgeGrid() {
  const featured = knowledgeAreas.find(
    (item) => item.id === "government-schemes"
  );

  const customs = knowledgeAreas.find(
    (item) => item.id === "customs"
  );

  const imports = knowledgeAreas.find(
    (item) => item.id === "imports-exports"
  );

  const learning = knowledgeAreas.find(
    (item) => item.id === "interactive"
  );

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
      <div className="h-full">
        <FeaturedKnowledgeCard {...featured} />
      </div>

      <div className="h-full">
        <KnowledgeCard {...customs} />
      </div>

      <div className="h-full">
        <KnowledgeCard {...imports} />
      </div>

      <div className="h-full">
        <KnowledgeCard {...learning} />
      </div>
    </div>
  );
}