"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  FileText,
  Package,
  DollarSign,
  Truck,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Search,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Topics", icon: HelpCircle },
  { id: "basics", label: "Trade Basics", icon: Package },
  { id: "customs", label: "Customs", icon: CheckCircle2 },
  { id: "docs", label: "Documents", icon: FileText },
  { id: "duties", label: "Duties & Taxes", icon: DollarSign },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "india", label: "India-Specific", icon: MapPin },
];

const faqs = [
  {
    cat: "basics",
    group: "Trade Basics",
    items: [
      {
        q: "What is the difference between import and export?",
        a: "Importing means bringing goods into your country from abroad, while exporting means sending goods out of your country to a foreign buyer. Both require compliance with the trade regulations of the countries involved, including customs declarations, duties, and licensing. As an importer, you are the consignee; as an exporter, you are the consignor.",
        links: [
          { label: "DGFT India", url: "https://www.dgft.gov.in" },
          {
            label: "WTO Trade Glossary",
            url: "https://www.wto.org/english/thewto_e/glossary_e/glossary_e.htm",
          },
        ],
      },
      {
        q: "What is an IEC (Importer Exporter Code) and do I need one?",
        a: "An IEC (Importer Exporter Code) is a 10-digit unique identification number issued by DGFT, Government of India. It is mandatory for any business or individual who wants to import or export goods from India. Without a valid IEC, customs will not allow clearance of your shipment.",
        links: [
          {
            label: "Apply IEC — DGFT",
            url: "https://www.dgft.gov.in/CP/?opt=iec",
          },
          {
            label: "IEC Guidelines",
            url: "https://www.dgft.gov.in/CP/?opt=ln",
          },
        ],
      },
      {
        q: "What is the role of a Customs House Agent (CHA)?",
        a: "A Customs House Agent (CHA), also called a Licensed Customs Broker, is a licensed professional who files import/export entries on behalf of importers and exporters with customs authorities. They handle documentation, duty payments, and coordinate with government departments. Hiring a CHA simplifies the clearance process and avoids compliance errors.",
        links: [
          {
            label: "CBIC CHA Licensing",
            url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-act&rules/cha-regulations2018",
          },
          { label: "Find Licensed CHAs", url: "https://www.cbic.gov.in" },
        ],
      },
    ],
  },
  {
    cat: "customs",
    group: "Customs Clearance",
    items: [
      {
        q: "What is the customs clearance process in India?",
        a: "Customs clearance in India involves: (1) Filing a Bill of Entry on the ICEGATE portal, (2) Assessment by customs officers for duty calculation, (3) Payment of applicable customs duties, (4) Physical or document examination if selected, and (5) Release/out-of-charge order. For exports, a Shipping Bill is filed instead. Most clearances are now processed electronically under SWIFT.",
        links: [
          { label: "ICEGATE Portal", url: "https://www.icegate.gov.in" },
          { label: "CBIC Customs", url: "https://www.cbic.gov.in" },
          {
            label: "SWIFT System",
            url: "https://www.cbic.gov.in/htdocs-cbec/customs/cs-act/cs-swift",
          },
        ],
      },
      {
        q: "What happens if my goods are held at customs?",
        a: "Goods can be held for examination, mis-declaration queries, missing documents, or suspected prohibited items. You will receive a notice and must respond within the stipulated time. If duties are unpaid or documents are incomplete, customs can issue a Show Cause Notice (SCN). In serious cases, goods may be seized under Section 110 of the Customs Act. A CHA or trade lawyer can help resolve disputes quickly.",
        links: [
          {
            label: "Customs Act 1962",
            url: "https://www.indiacode.nic.in/handle/123456789/1495",
          },
          { label: "CBIC Grievance", url: "https://cpgrams.gov.in" },
        ],
      },
      {
        q: "What is an HS Code and how do I find the right one?",
        a: "An HS Code (Harmonized System Code) is an internationally standardized numerical classification for traded goods. In India, an 8-digit ITC-HS code is used. The correct HS code determines your applicable customs duty, GST rate, and any export/import restrictions. Mis-classification can lead to penalties. You can search for the correct code using DGFT's trade portal.",
        links: [
          {
            label: "Search ITC-HS — DGFT",
            url: "https://www.dgft.gov.in/CP/?opt=itchs",
          },
          {
            label: "Customs Tariff India",
            url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-act&rules/customs-tariff-amnd",
          },
          { label: "WTO HS Database", url: "https://hstracker.wto.org" },
        ],
      },
    ],
  },
  {
    cat: "docs",
    group: "Required Documents",
    items: [
      {
        q: "What documents are required for importing goods into India?",
        a: "Key documents for import into India include: Bill of Entry, Commercial Invoice, Packing List, Bill of Lading or Airway Bill, Certificate of Origin, Import License (if applicable), Letter of Credit or payment proof, and any product-specific certificates (e.g. FSSAI for food, BIS for electronics). All documents must match exactly — discrepancies cause delays.",
        links: [
          { label: "CBIC Import Docs Guide", url: "https://www.cbic.gov.in" },
          {
            label: "FSSAI Import",
            url: "https://www.fssai.gov.in/cms/import.php",
          },
          { label: "BIS India", url: "https://www.bis.gov.in" },
        ],
      },
      {
        q: "What is a Certificate of Origin and when is it required?",
        a: "A Certificate of Origin (CoO) is a document certifying the country in which goods were produced. It is required to claim preferential duty rates under Free Trade Agreements (FTAs) like India-UAE CEPA or India-ASEAN FTA. Without it, you pay standard MFN duties. CoOs are issued by Chambers of Commerce or Export Promotion Councils.",
        links: [
          {
            label: "FIEO CoO",
            url: "https://www.fieo.org/view_section.php?lang=0&id=0,376,399",
          },
          {
            label: "India FTA List — DGFT",
            url: "https://www.dgft.gov.in/CP/?opt=TreatyAgreement",
          },
        ],
      },
      {
        q: "What is a Bill of Lading vs an Airway Bill?",
        a: "A Bill of Lading (BoL) is a legal document issued by a shipping carrier for sea freight, confirming receipt of goods and terms of transport. An Airway Bill (AWB) serves the same purpose for air freight. The BoL can be negotiable (transferable) while an AWB is non-negotiable. Both are essential for customs clearance and releasing cargo at the destination port.",
        links: [
          {
            label: "IATA AWB Guide",
            url: "https://www.iata.org/en/programs/cargo/airwaybill/",
          },
          { label: "IMO Shipping", url: "https://www.imo.org" },
        ],
      },
    ],
  },
  {
    cat: "duties",
    group: "Duties & Taxes",
    items: [
      {
        q: "How are import duties calculated in India?",
        a: "Import duty in India is calculated on the CIF value (Cost + Insurance + Freight) of goods. The total tax burden includes: Basic Customs Duty (BCD), Social Welfare Surcharge (SWS at 10% of BCD), IGST (typically 5–28%), and in some cases AIDC (Agriculture Infrastructure Development Cess). You can estimate duties using the CBIC Duty Calculator before shipping.",
        links: [
          {
            label: "CBIC Duty Calculator",
            url: "https://www.cbic-gst.gov.in/cbieccounters/cst.html",
          },
          {
            label: "Customs Tariff",
            url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-act&rules/customs-tariff-amnd",
          },
        ],
      },
      {
        q: "What is GST on imports and how does it work?",
        a: "IGST (Integrated GST) is levied on all imports into India at the same rate as domestic supply. It is calculated on the CIF value plus customs duties. Importers registered under GST can claim Input Tax Credit (ITC) of IGST paid on imports, which can be used to offset their output GST liability, making it effectively cost-neutral for most businesses.",
        links: [
          { label: "GST Portal", url: "https://www.gst.gov.in" },
          {
            label: "CBIC GST Import Guide",
            url: "https://www.cbic-gst.gov.in",
          },
        ],
      },
      {
        q: "Are there any goods that are prohibited or restricted for import/export in India?",
        a: "Yes. India's Foreign Trade Policy (FTP) classifies goods as Free, Restricted, Canalised, or Prohibited. Prohibited items include certain wildlife, narcotics, and counterfeit currency. Restricted items (like certain chemicals, weapons, or seeds) require a special import/export license. Canalised items (like petroleum) can only be traded through designated agencies like STC or MMTC.",
        links: [
          {
            label: "ITC-HS Import Policy — DGFT",
            url: "https://www.dgft.gov.in/CP/?opt=itchs",
          },
          {
            label: "Foreign Trade Policy 2023",
            url: "https://www.dgft.gov.in/CP/?opt=ftp",
          },
        ],
      },
    ],
  },
  {
    cat: "logistics",
    group: "Logistics & Shipping",
    items: [
      {
        q: "What is Incoterms and why does it matter for my shipment?",
        a: "Incoterms (International Commercial Terms) are globally recognized trade terms that define who — buyer or seller — is responsible for costs, risk, and insurance at each stage of shipment. Common terms include EXW (Ex Works), FOB (Free on Board), CIF (Cost Insurance Freight), and DDP (Delivered Duty Paid). Choosing the wrong Incoterm can lead to unexpected costs or liability disputes.",
        links: [
          {
            label: "ICC Incoterms 2020",
            url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/",
          },
          {
            label: "Incoterms Guide",
            url: "https://www.trade.gov/know-your-incoterms",
          },
        ],
      },
      {
        q: "How do I track my shipment through Indian customs?",
        a: "You can track the status of your import/export shipment on the ICEGATE portal using your Bill of Entry or Shipping Bill number. For sea cargo, you can also check with your shipping line or the port's community system (e.g., JNPT's GEMS or Chennai Port's system). Many courier services like DHL, FedEx, and BlueDart also show customs status in their tracking.",
        links: [
          {
            label: "ICEGATE Tracking",
            url: "https://www.icegate.gov.in/Webappl/esanchit",
          },
          { label: "JNPT Port", url: "https://www.jnport.gov.in" },
        ],
      },
    ],
  },
  {
    cat: "india",
    group: "India-Specific Regulations",
    items: [
      {
        q: "What is the Foreign Trade Policy (FTP) and how does it affect my business?",
        a: "India's Foreign Trade Policy (FTP) 2023, released by DGFT, governs all import and export activity. It introduces schemes like Advance Authorization (duty-free input procurement), EPCG (for capital goods), and RoDTEP (duty remission for exporters). Compliance with FTP is mandatory and violations can result in cancellation of IEC and prosecution under the Foreign Trade Act.",
        links: [
          {
            label: "FTP 2023 — DGFT",
            url: "https://www.dgft.gov.in/CP/?opt=ftp",
          },
          {
            label: "Advance Authorization",
            url: "https://www.dgft.gov.in/CP/?opt=AA",
          },
        ],
      },
      {
        q: "What is FSSAI import registration for food products?",
        a: "Any food product imported into India requires prior clearance from FSSAI (Food Safety and Standards Authority of India). The importer must obtain an FSSAI Import License (Central License) and each consignment must be tested and cleared at the port. Products must comply with Indian food safety standards. Failure to comply results in rejection and re-export of the consignment.",
        links: [
          {
            label: "FSSAI Import Regulations",
            url: "https://www.fssai.gov.in/cms/import.php",
          },
          { label: "FoSCoS Portal", url: "https://foscos.fssai.gov.in" },
        ],
      },
      {
        q: "What are the export promotion schemes available in India?",
        a: "India offers several schemes to promote exports: RoDTEP (Remission of Duties and Taxes on Exported Products), Advance Authorization for duty-free raw materials, EPCG for capital goods at zero/concessional duty, SEZ (Special Economic Zones) for tax exemptions, and EOU (Export Oriented Units). ECGC also provides export credit insurance to protect against buyer default.",
        links: [
          { label: "Export Schemes — DGFT", url: "https://www.dgft.gov.in" },
          { label: "ECGC Insurance", url: "https://www.ecgc.in" },
          { label: "SEZ India", url: "https://www.sezindia.nic.in" },
          { label: "FIEO Exporters", url: "https://www.fieo.org" },
        ],
      },
    ],
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-blue-200 shadow-md shadow-blue-50"
          : "border-gray-100 hover:border-blue-100 hover:shadow-sm"
      } bg-white`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span
          className={`text-sm md:text-base font-semibold leading-snug transition-colors ${
            open ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {item.q}
        </span>
        <span
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
            open
              ? "bg-blue-600 text-white rotate-180"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-50">
          <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-4">
            {item.a}
          </p>
          <div className="flex flex-wrap gap-2">
            {item.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <ExternalLink className="w-3 h-3" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQClient() {
  const [activecat, setActivecat] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = faqs
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesCat = activecat === "all" || group.cat === activecat;
        const matchesSearch =
          search === "" ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const totalResults = filtered.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <main className="bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen">
      {/* ── Hero Banner ── */}
      <section className="relative pt-10 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Expert answers on import, export, customs clearance, duties, and
            international trade — with direct links to official government
            sources.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── Category Filters ── */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActivecat(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activecat === cat.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
          {search && (
            <p className="text-center text-sm text-gray-500 mt-4">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;
              {search}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* ── FAQ Content ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No questions found.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filtered.map((group) => (
                <div key={group.cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 rounded-full bg-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">
                      {group.group}
                    </h2>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-medium">
                      {group.items.length} question
                      {group.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, i) => (
                      <FAQItem key={i} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CTA Card ── */}
          <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center shadow-2xl shadow-blue-200">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Our trade experts are available 24/7 to help you navigate import,
              export, and customs requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block px-8 py-3.5 rounded-xl bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors shadow-md"
              >
                Contact Us
              </Link>
              <Link
                href="/book-appointment"
                className="inline-block px-8 py-3.5 rounded-xl bg-blue-500 text-white font-semibold text-sm border border-blue-400 hover:bg-blue-400 transition-colors"
              >
                Book Appointment
              </Link>
              <a
                href="tel:18008907365"
                className="inline-block px-8 py-3.5 rounded-xl bg-blue-800/40 text-white font-semibold text-sm border border-blue-500 hover:bg-blue-800/60 transition-colors"
              >
                1800-890-7365
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}