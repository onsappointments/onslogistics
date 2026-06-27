/**
 * Which customs workflow primarily uses the document.
 */
export type DocumentCategory =
  | "import"
  | "export"
  | "common";

/**
 * Visual grouping used by the Documentation section.
 */
export type DocumentGroup =
  | "essential"
  | "compliance"
  | "transport";

/**
 * Importance badge shown in the UI.
 */
export type DocumentImportance =
  | "essential"
  | "recommended"
  | "conditional";

/**
 * Search intent for SEO / GEO / AI search optimization.
 */
export type SearchIntent =
  | "informational"
  | "commercial"
  | "transactional";

/**
 * Optional related government authority.
 */
export interface DocumentAuthority {
  name: string;
  shortName?: string;
  website?: string;
}

/**
 * Represents a customs document used throughout the
 * Customs Clearance content system.
 *
 * This interface is intentionally designed to power:
 * - Documentation Intelligence
 * - Import Process
 * - Export Process
 * - Individual document guide pages
 * - Related Resources
 * - JSON-LD generation
 * - AI summaries
 * - FAQ generation
 * - Internal linking
 */
export interface CustomsDocument {
  /**
   * Unique identifier
   * Example: bill-of-entry
   */
  id: string;

  /**
   * Display title
   */
  title: string;

  /**
   * Import / Export / Common
   */
  category: DocumentCategory;

  /**
   * UI grouping
   */
  group: DocumentGroup;

  /**
   * Display priority within a group.
   * Lower number appears first.
   */
  priority: number;

  /**
   * Importance badge
   */
  importance: DocumentImportance;

  /**
   * Primary explanation shown on cards.
   */
  description: string;

  /**
   * Why the document exists.
   */
  purpose: string;

  /**
   * Who issues or prepares this document.
   */
  issuedBy: string;

  /**
   * Optional government or regulatory authority.
   */
  authority?: DocumentAuthority;

  /**
   * Shipment types requiring this document.
   */
  requiredFor: string[];

  /**
   * Customs stage where this document is used.
   */
  usedDuring: string;

  /**
   * Practical expert recommendation.
   */
  expertTip: string;

  /**
   * Frequent business mistake.
   */
  commonMistake: string;

  /**
   * AI-friendly summary.
   * Useful for cards, search, and AI answers.
   */
  summary?: string;

  /**
   * Internal guide URL.
   */
  learnMoreHref: string;

  /**
   * Related entities for tags and internal linking.
   */
  relatedEntities: string[];

  /**
   * Search intent classification.
   */
  searchIntent: SearchIntent;

  /**
   * Optional list of related article URLs.
   */
  relatedArticles?: string[];

  /**
   * Optional government portal URL.
   */
  officialWebsite?: string;

  /**
   * Whether the document is mandatory
   * for most shipments in its category.
   */
  mandatory?: boolean;

  /**
   * Indicates if this document is
   * commonly filed digitally.
   */
  digitalSubmission?: boolean;

  /**
   * Optional remarks displayed in UI.
   */
  notes?: string;
}