export interface FAQItem {
  id: string;

  question: string;

  answer: string;

  relatedLinks?: {
    title: string;
    href: string;
  }[];
}