
import GlobalTradeIntelligenceDashboard from "@/Components/global-trade-intelligence/GlobalTradeIntelligenceDashboard";

export const metadata = {
  title: "Global Trade Intelligence | ONS Logistics India",
  description:
    "Explore global commodity prices, international trade developments and market intelligence for importers, exporters and businesses.",
  alternates: {
    canonical: "/global-trade-intelligence",
  },
  openGraph: {
    title: "Global Trade Intelligence | ONS Logistics India",
    description:
      "Explore global commodity markets and international trade developments.",
    type: "website",
  },
};

export default function GlobalTradeIntelligencePage() {
  return <GlobalTradeIntelligenceDashboard />;
}
