import TradeFlowsDashboard from "@/Components/global-trade-intelligence/trade-flows/TradeFlowsDashboard";

export const metadata = {
  title: "India Trade Flows | Global Trade Intelligence | ONS Logistics India",
  description:
    "Explore India's monthly merchandise imports, exports, trade balance and trade performance through ONS Logistics Global Trade Intelligence.",
  alternates: {
    canonical: "/global-trade-intelligence/trade-flows",
  },
  openGraph: {
    title: "India Trade Flows | Global Trade Intelligence",
    description:
      "Explore India's import and export activity, monthly trade performance and trade balance.",
    type: "website",
  },
};

export default function TradeFlowsPage() {
  return <TradeFlowsDashboard />;
}