import { LucideIcon } from "lucide-react";

export interface HeroCapability {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface HeroProcessStep {
  id: string;
  title: string;
  shortLabel: string;
}

export interface HeroTrustItem {
  id: string;
  label: string;
}

export interface HeroAction {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface HeroData {
  eyebrow: string;
  title: string;
  description: string;

  capabilities: HeroCapability[];

  process: HeroProcessStep[];

  trustItems: HeroTrustItem[];

  actions: HeroAction[];
}
export interface HeroLocation {
  id: string;
  label: string;
  icon: LucideIcon;
}