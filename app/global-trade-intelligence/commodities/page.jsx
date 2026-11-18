
import GlobalTradeIntelligenceDashboard from "@/Components/global-trade-intelligence/GlobalTradeIntelligenceDashboard";

export const metadata = {
  title: "Commodity Markets | Global Trade Intelligence | ONS Logistics India",
  description:
    "Track global commodity benchmark prices, market movements, commodity indices and historical trends through ONS Logistics Global Trade Intelligence.",
  alternates: {
    canonical: "/global-trade-intelligence/commodities",
  },
  openGraph: {
    title: "Commodity Markets | Global Trade Intelligence",
    description:
      "Explore global commodity prices, market movers, benchmark trends and commodity group indices.",
    type: "website",
  },
};

export default function CommoditiesPage() {
  return <GlobalTradeIntelligenceDashboard />;
}
