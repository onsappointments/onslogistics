import FlowchartExplorer from "@/Components/resources/FlowchartExplorer";

export async function generateStaticParams() {
  return [
    {
      slug:
        "freight-forwarding",
    },

    {
      slug:
        "customs-clearance",
    },

    {
      slug:
        "export-import-consultation",
    },

    {
      slug:
        "licensing-documentation",
    },
  ];
}

export async function generateMetadata({
  params,
}) {
  const { slug } =
    await params;

  const titles = {
    "freight-forwarding":
      "Freight Forwarding Services | Sea, Air & Road Logistics",

    "customs-clearance":
      "Customs Clearance & Compliance Guide",

    "export-import-consultation":
      "Export Import Consultation Services",

    "licensing-documentation":
      "Import Export Licensing & Documentation",
  };

  const descriptions =
    {
      "freight-forwarding":
        "Learn how freight forwarding works across sea freight, air freight, and road logistics in India.",

      "customs-clearance":
        "Understand customs clearance procedures, compliance requirements, duties, and import-export regulations in India.",

      "export-import-consultation":
        "Explore export-import consultation services including DGFT compliance, IEC registration, and logistics planning.",

      "licensing-documentation":
        "Learn about import-export licensing, shipping documentation, GST, IEC, and trade compliance requirements.",
    };

  return {
    title:
      titles[slug] ??
      "Logistics Knowledge",

    description:
      descriptions[
        slug
      ] ??
      "Interactive logistics knowledge explorer.",

    alternates: {
      canonical: `https://onslog.com/resources/flowchart/${slug}`,
    },

    openGraph: {
      title:
        titles[slug],

      description:
        descriptions[
          slug
        ],

      url: `https://onslog.com/resources/flowchart/${slug}`,

      type: "article",
    },
  };
}

export default function FlowchartNodePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">

      <div className="max-w-[1800px] mx-auto px-6 py-10">

        <FlowchartExplorer
          fullPage
        />

      </div>
    </main>
  );
}