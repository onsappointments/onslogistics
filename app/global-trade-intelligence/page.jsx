
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Newspaper,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Global Trade Intelligence | ONS Logistics India",
  description:
    "Explore global trade flows, commodity markets, country intelligence, international trade trends and developments through ONS Logistics Global Trade Intelligence.",
  alternates: {
    canonical: "/global-trade-intelligence",
  },
  openGraph: {
    title: "Global Trade Intelligence | ONS Logistics India",
    description:
      "Explore global trade flows, commodity markets and international trade developments.",
    type: "website",
  },
};

const sections = [
  {
    title: "Commodity Markets",
    description:
      "Monitor global commodity benchmarks, market movers, historical prices and commodity group indices.",
    href: "/global-trade-intelligence/commodities",
    icon: TrendingUp,
    status: "Available",
    available: true,
  },
  {
    title: "Trade Flows",
    description:
      "Explore India's import and export activity, trade balances and monthly trade performance.",
    href: "/global-trade-intelligence/trade-flows",
    icon: BarChart3,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Country Intelligence",
    description:
      "Explore trade relationships, country-level indicators and international market information.",
    href: "/global-trade-intelligence/countries",
    icon: Globe2,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Trade Trends",
    description:
      "Identify emerging patterns, shifts in trade activity and broader international trade trends.",
    href: "/global-trade-intelligence/trends",
    icon: BarChart3,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Trade News",
    description:
      "Stay informed about developments affecting global trade, shipping, markets and supply chains.",
    href: "/global-trade-intelligence/news",
    icon: Newspaper,
    status: "Coming soon",
    available: false,
  },
];

export default function GlobalTradeIntelligencePage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Globe2 size={14} />
            GLOBAL TRADE INTELLIGENCE
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Global Trade Intelligence
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
            Explore global markets, international trade flows, commodity
            movements and developments shaping the world of trade.
          </p>
        </div>

        {/* Intelligence modules */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            const cardContent = (
              <div
                className={`group flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition ${
                  section.available
                    ? "border-gray-200 hover:border-blue-200 hover:shadow-md"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      section.available
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {section.status}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-semibold text-gray-900">
                  {section.title}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                  {section.description}
                </p>

                {section.available && (
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Explore module
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                )}
              </div>
            );

            return section.available ? (
              <Link
                key={section.title}
                href={section.href}
                className="block h-full"
              >
                {cardContent}
              </Link>
            ) : (
              <div key={section.title} className="h-full">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
