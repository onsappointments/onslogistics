import FAQClient from "./FAQClient";

export const metadata = {
  title: "Import Export FAQ | ONS Logistics",
  description:
    "Answers to frequently asked questions on import, export, customs clearance, duties, and trade documents in India.",
  alternates: { canonical: "https://onslog.com/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between import and export?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Importing means bringing goods into your country from abroad, while exporting means sending goods out of your country to a foreign buyer. Both require customs declarations, duties, and licensing compliance.",
      },
    },
    {
      "@type": "Question",
      name: "What is an IEC (Importer Exporter Code) and do I need one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An IEC is a mandatory 10-digit number issued by DGFT for anyone importing or exporting goods from India. Without a valid IEC, customs will not allow clearance of your shipment.",
      },
    },
    {
      "@type": "Question",
      name: "What is the customs clearance process in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Customs clearance involves filing a Bill of Entry on ICEGATE, duty assessment, payment, examination if selected, and release order. Most clearances are processed electronically under the SWIFT system.",
      },
    },
    {
      "@type": "Question",
      name: "What documents are required for importing goods into India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key documents include Bill of Entry, Commercial Invoice, Packing List, Bill of Lading or Airway Bill, Certificate of Origin, Import License (if applicable), and product-specific certificates.",
      },
    },
    {
      "@type": "Question",
      name: "How are import duties calculated in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Import duty is calculated on CIF value (Cost + Insurance + Freight). Total taxes include Basic Customs Duty, Social Welfare Surcharge, IGST, and in some cases AIDC.",
      },
    },
    {
      "@type": "Question",
      name: "What is an HS Code and how do I find the right one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An HS Code is an internationally standardized numerical classification for traded goods. In India, an 8-digit ITC-HS code is used. You can search the correct code on the DGFT trade portal.",
      },
    },
    {
      "@type": "Question",
      name: "What is GST on imports and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IGST is levied on all imports into India at the same rate as domestic supply. Importers registered under GST can claim Input Tax Credit (ITC) of IGST paid on imports.",
      },
    },
    {
      "@type": "Question",
      name: "What is Incoterms and why does it matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Incoterms are globally recognized trade terms defining who is responsible for costs, risk, and insurance at each stage of shipment. Common terms include EXW, FOB, CIF, and DDP.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Foreign Trade Policy (FTP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "India's FTP 2023, released by DGFT, governs all import and export activity and introduces schemes like Advance Authorization, EPCG, and RoDTEP for exporters.",
      },
    },
    {
      "@type": "Question",
      name: "What are the export promotion schemes available in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "India offers RoDTEP, Advance Authorization, EPCG, SEZ, and EOU schemes. ECGC also provides export credit insurance to protect against buyer default.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </>
  );
}
