export interface IndustryItem {
  id: string;

  title: string;

  shortDescription: string;

  overview: string;

  commonImports: string[];

  commonExports: string[];

  keyDocuments: string[];

  commonChallenges: string[];

  onsSupport: string;

  relatedGuides: {
    title: string;
    href: string;
  }[];
}