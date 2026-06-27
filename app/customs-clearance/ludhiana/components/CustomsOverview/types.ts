export interface EntityItem {
  id: string;

  icon: string;

  title: string;

  slug: string;

  description: string;

  quickAnswer: string;

  expertTip: string;

  commonMistake: string;

  href: string;

  tags: string[];

  searchIntent:
    | "commercial"
    | "informational"
    | "transactional";

  primaryKeyword: string;

  secondaryKeywords: string[];

  relatedArticles: string[];

  cta: {
    title: string;
    href: string;
  };
}