export type JourneyType = "import" | "export";

export interface JourneyDocument {
  id: string;
  name: string;
  required: boolean;
}

export interface JourneyStep {
  id: string;

  journey: JourneyType;

  stepNumber: number;

  title: string;

  shortDescription: string;

  detailedDescription: string;

  quickAnswer: string;

  expertTip: string;

  commonMistake: string;

  onsSupport: string;

  learnMoreHref: string;

  documents?: JourneyDocument[];

  entities?: string[];
}