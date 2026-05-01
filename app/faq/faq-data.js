// ─────────────────────────────────────────────────────────────────────────────
// faq-data.js  —  AEO + GEO optimised FAQ content for ONS Logistics
//
// AEO RULES applied to every answer:
//  1. First sentence = direct, standalone answer (≤ 20 words)
//  2. Conversational, not textbook
//  3. Numbers, specifics, local intent where possible
//  4. Links to authoritative official sources
// ─────────────────────────────────────────────────────────────────────────────

export const categories = [
    { id: "all", label: "All Topics", icon: "HelpCircle" },
    { id: "pricing", label: "Shipping & Pricing", icon: "DollarSign" },
    { id: "services", label: "ONS Logistics Services", icon: "Star" },
    { id: "time", label: "Time & Process", icon: "Clock" },
    { id: "comparison", label: "Comparisons", icon: "BarChart2" },
    { id: "basics", label: "Trade Basics", icon: "Package" },
    { id: "customs", label: "Customs", icon: "CheckCircle2" },
    { id: "docs", label: "Documents", icon: "FileText" },
    { id: "duties", label: "Duties & Taxes", icon: "Receipt" },
    { id: "logistics", label: "Logistics", icon: "Truck" },
    { id: "india", label: "India-Specific", icon: "MapPin" },
];

// ─── category meta used for dynamic routes ───────────────────────────────────
export const categoryMeta = {
    pricing: {
        title: "Shipping & Freight Pricing | ONS Logistics FAQ",
        description: "Find out how much international shipping costs from India, what affects freight charges, and how to reduce your logistics costs.",
        h1: "Shipping & Pricing Questions",
    },
    services: {
        title: "ONS Logistics Services — Freight & Customs | FAQ",
        description: "Learn about ONS Logistics' freight forwarding, customs clearance, door-to-door delivery, and coverage across India and 150+ countries.",
        h1: "ONS Logistics Services",
    },
    time: {
        title: "Shipping Transit Times & Customs Clearance Duration | FAQ",
        description: "How long does sea freight, air freight, or customs clearance take from India? Get realistic timelines from ONS Logistics.",
        h1: "Time & Process Questions",
    },
    comparison: {
        title: "Air Freight vs Sea Freight vs Courier — Which Should You Choose?",
        description: "Compare air vs sea freight, FCL vs LCL, and courier vs cargo shipping to pick the best option for your India import/export.",
        h1: "Shipping Comparisons",
    },
    basics: {
        title: "Import Export Basics — IEC, CHA, Trade Terms | ONS FAQ",
        description: "Understand the basics of importing and exporting from India — IEC code, Customs House Agents, and how international trade works.",
        h1: "Trade Basics",
    },
    customs: {
        title: "Customs Clearance in India — Process, HS Codes & Delays | FAQ",
        description: "Everything you need to know about customs clearance in India — how it works, HS codes, what happens if goods are held, and more.",
        h1: "Customs Clearance",
    },
    docs: {
        title: "Import Export Documents Required in India | ONS Logistics FAQ",
        description: "Complete list of documents required for importing or exporting goods in India — Bill of Entry, CoO, AWB, and more.",
        h1: "Required Documents",
    },
    duties: {
        title: "Import Duties, GST & Customs Taxes in India | ONS FAQ",
        description: "How are import duties calculated in India? Learn about BCD, IGST, surcharges, and how to check duty rates before you ship.",
        h1: "Duties & Taxes",
    },
    logistics: {
        title: "International Logistics & Freight Tracking | ONS Logistics FAQ",
        description: "Understand Incoterms, shipment tracking, and how to manage your international logistics smoothly from India.",
        h1: "Logistics & Shipping",
    },
    india: {
        title: "India Trade Policy, FTP, FSSAI & Export Schemes | ONS FAQ",
        description: "India-specific trade regulations — Foreign Trade Policy 2023, FSSAI import requirements, export promotion schemes and more.",
        h1: "India-Specific Regulations",
    },
};

// ─── FAQ groups ───────────────────────────────────────────────────────────────
export const faqs = [

    // ══════════════════════════════════════════════════════════════
    //  💰  PRICING  (highest commercial intent — put first)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "pricing",
        group: "Shipping & Pricing",
        items: [
            {
                q: "How much does international shipping cost from India?",
                directAnswer: "International shipping from India typically costs ₹15,000–₹2,00,000+ depending on weight, destination, and mode (air vs sea).",
                a: "International shipping from India typically costs ₹15,000–₹2,00,000+ depending on weight, destination, and mode. Air freight runs roughly ₹250–₹600 per kg; sea freight (LCL) costs ₹8,000–₹25,000 per CBM. A full 20-ft container (FCL) to the UAE or USA is around ₹85,000–₹1,50,000. Exact rates depend on the port of origin, commodity type, and whether you need door-to-door service. Contact ONS Logistics for a custom quote.",
                links: [
                    { label: "Get a Free Quote — ONS", url: "/contact" },
                    { label: "IATA Cargo Rates", url: "https://www.iata.org/en/programs/cargo/" },
                ],
            },
            {
                q: "What affects international freight charges?",
                directAnswer: "Freight charges depend mainly on weight, volume (CBM), destination, shipping mode, and current fuel surcharges.",
                a: "Freight charges depend on weight, volume, destination, shipping mode, and surcharges. Other factors include: (1) Dimensional (volumetric) weight — carriers charge whichever is higher, actual or volumetric weight; (2) Fuel Adjustment Factor (FAF) and Peak Season Surcharges; (3) Origin and destination port handling fees; (4) Customs duties and clearance fees at destination; (5) Insurance premiums. Choosing the right mode (air vs sea vs courier) and packaging your cargo efficiently can significantly reduce your landed cost.",
                links: [
                    { label: "Freight Cost Guide — ONS", url: "/contact" },
                    { label: "FIATA Freight Standards", url: "https://fiata.org" },
                ],
            },
            {
                q: "How can I reduce my shipping costs from India?",
                directAnswer: "You can reduce shipping costs by consolidating cargo (LCL groupage), choosing sea over air for non-urgent goods, and planning shipments in advance.",
                a: "Here are proven ways to reduce shipping costs from India: (1) Use LCL (Less than Container Load) consolidation if your cargo is under 15 CBM — you only pay for the space you use; (2) Switch from air to sea freight for non-time-sensitive goods — sea is typically 6–10× cheaper; (3) Book in advance to avoid peak season surcharges; (4) Optimize packaging to reduce volumetric weight; (5) Use export promotion schemes like RoDTEP for duty refunds; (6) Work with a freight forwarder like ONS Logistics who can negotiate better carrier rates.",
                links: [
                    { label: "LCL Consolidation — ONS", url: "/services" },
                    { label: "RoDTEP Scheme — DGFT", url: "https://www.dgft.gov.in" },
                ],
            },
            {
                q: "Do you provide freight charges for shipments from Punjab or Ludhiana?",
                directAnswer: "Yes — ONS Logistics provides door-to-door freight services from Ludhiana, Amritsar, and across Punjab to 150+ countries.",
                a: "Yes, ONS Logistics provides freight forwarding from Ludhiana, Amritsar, Jalandhar, and all major industrial hubs across Punjab. We arrange pickup from your factory or warehouse, handle export customs clearance at ICD Ludhiana or JNPT, and deliver to your buyer's door anywhere in the world. We also handle import shipments into Punjab. Call us or request a quote to get rates specific to your cargo type and destination.",
                links: [
                    { label: "Get Punjab Freight Quote", url: "/contact" },
                    { label: "ICD Ludhiana — CONCOR", url: "https://www.concorindia.co.in" },
                ],
            },
            {
                q: "Is there a minimum shipment size or weight for freight forwarding?",
                directAnswer: "No — ONS Logistics handles everything from small parcels to full container loads (FCL).",
                a: "No minimum is required. ONS Logistics handles small parcels (under 50 kg), LCL groupage shipments, and full container loads (FCL — 20ft or 40ft). For very small shipments (under 70 kg), international courier (DHL, FedEx) is often more cost-effective. For 70 kg to 2 CBM, air cargo through a freight forwarder usually beats retail courier rates. For anything above 2 CBM, LCL or FCL sea freight is typically the most economical option.",
                links: [
                    { label: "Contact ONS for Rates", url: "/contact" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  ⭐  ONS LOGISTICS SERVICES  (brand + conversion)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "services",
        group: "ONS Logistics Services",
        items: [
            {
                q: "What services does ONS Logistics provide?",
                directAnswer: "ONS Logistics provides international freight forwarding, customs clearance, air and sea cargo, and door-to-door delivery across India and 150+ countries.",
                a: "ONS Logistics offers a full suite of trade logistics services: international air freight, sea freight (FCL & LCL), customs clearance and brokerage, project cargo, import/export documentation support, insurance, and warehouse services. We also assist exporters with DGFT compliance, BRC (Bank Realisation Certificates), and export scheme benefits like RoDTEP and Advance Authorization. Our team is based in Ludhiana and serves clients across India.",
                links: [
                    { label: "Our Services", url: "/services" },
                    { label: "Book Appointment", url: "/book-appointment" },
                ],
            },
            {
                q: "Do you offer door-to-door delivery for international shipments?",
                directAnswer: "Yes — ONS Logistics offers complete door-to-door import and export services, including pickup, customs clearance, and last-mile delivery.",
                a: "Yes. Our door-to-door service covers pickup from your origin address (factory, warehouse, or port), export customs clearance in India, sea or air freight to destination, import customs clearance at destination, and delivery to the consignee's address. This is commonly known as DDP (Delivered Duty Paid) or DAP (Delivered at Place) shipping, depending on who pays destination duties. We handle the entire process so you don't need to coordinate with multiple agencies.",
                links: [
                    { label: "Door-to-Door Shipping", url: "/services" },
                    { label: "Contact Us", url: "/contact" },
                ],
            },
            {
                q: "Which countries does ONS Logistics ship to?",
                directAnswer: "ONS Logistics ships to 150+ countries, including the UAE, USA, UK, Australia, Canada, Singapore, Germany, and all major markets.",
                a: "ONS Logistics has an active network covering 150+ countries worldwide. Our most-served trade lanes from India include: UAE, Saudi Arabia, USA, UK, Australia, Canada, Germany, Netherlands, Singapore, Malaysia, Kenya, and South Africa. For import shipments into India, we handle cargo from China, USA, Germany, Italy, Taiwan, and all major manufacturing hubs. Don't see your country? Contact us — we can arrange service through our global partner network.",
                links: [
                    { label: "Our Global Network", url: "/services" },
                    { label: "Contact ONS", url: "/contact" },
                ],
            },
            {
                q: "Do you provide customs clearance services in Ludhiana?",
                directAnswer: "Yes — ONS Logistics provides customs clearance at ICD Ludhiana, JNPT Mumbai, Delhi Air Cargo, and all major Indian ports.",
                a: "Yes. ONS Logistics handles customs clearance at ICD Ludhiana (Inland Container Depot), which is the most convenient option for exporters and importers in Punjab. We also clear cargo at JNPT (Mumbai), Nhava Sheva, Delhi Air Cargo Complex, and Chennai Sea Port depending on your shipment. Our licensed Customs House Agents (CHAs) manage all documentation, duty payments, and examination coordination so your goods clear without delays.",
                links: [
                    { label: "Customs Services — ONS", url: "/services" },
                    { label: "ICD Ludhiana", url: "https://www.concorindia.co.in" },
                    { label: "ICEGATE Portal", url: "https://www.icegate.gov.in" },
                ],
            },
            {
                q: "Why should I choose ONS Logistics for freight forwarding?",
                directAnswer: "ONS Logistics combines local expertise in Punjab with a global partner network, handling everything from documentation to customs so you can focus on your business.",
                a: "ONS Logistics offers: (1) Local presence in Ludhiana with deep knowledge of Punjab's export industries (hosiery, auto parts, bicycle, fabrics); (2) End-to-end service — we handle pickup, packing, documentation, customs, freight, and delivery; (3) Competitive rates through volume-based carrier agreements; (4) Dedicated account managers who know your business; (5) DGFT compliance support including IEC assistance, export schemes, and documentation; (6) Transparent tracking and proactive communication. We've helped hundreds of Punjab exporters and importers since our founding.",
                links: [
                    { label: "About ONS Logistics", url: "/about" },
                    { label: "Client Testimonials", url: "/reviews" },
                    { label: "Book a Consultation", url: "/book-appointment" },
                ],
            },
            {
                q: "Can ONS Logistics help me get an IEC code?",
                directAnswer: "Yes — ONS Logistics assists new importers and exporters in applying for their IEC (Importer Exporter Code) from DGFT.",
                a: "Yes. If you're starting out in import/export, we can guide you through the IEC application process on DGFT's portal. The IEC is a mandatory 10-digit code for any business or individual importing or exporting from India. The application is done online via DGFT and typically takes 2–3 working days. We help you prepare the documents — Aadhar, PAN, bank details, and business registration — and ensure the application is filed correctly.",
                links: [
                    { label: "Contact ONS for IEC Help", url: "/contact" },
                    { label: "Apply IEC — DGFT", url: "https://www.dgft.gov.in/CP/?opt=iec" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  ⏱  TIME & PROCESS
    // ══════════════════════════════════════════════════════════════
    {
        cat: "time",
        group: "Time & Process Questions",
        items: [
            {
                q: "How long does customs clearance take in India?",
                directAnswer: "Most import customs clearances in India are completed in 1–3 working days under the SWIFT system, though some shipments take longer.",
                a: "Most import customs clearances in India take 1–3 working days under SWIFT (Single Window Interface for Facilitating Trade). Shipments that are auto-assessed without examination clear in as little as a few hours. However, clearance can take 5–10 days if your goods are selected for physical examination, documents are incomplete, or there's a mis-declaration query. Export clearances (Shipping Bill) are typically faster — 1–2 days. Working with a licensed CHA like ONS Logistics significantly reduces delays.",
                links: [
                    { label: "ICEGATE Portal", url: "https://www.icegate.gov.in" },
                    { label: "SWIFT System — CBIC", url: "https://www.cbic.gov.in" },
                ],
            },
            {
                q: "How long does sea freight take from India to major destinations?",
                directAnswer: "Sea freight from India takes 8–30 days depending on destination — UAE is 6–10 days, USA is 22–30 days, and UK is 18–25 days.",
                a: "Approximate sea freight transit times from India (from JNPT/Nhava Sheva): UAE/Dubai: 6–10 days | USA (East Coast): 22–28 days | USA (West Coast): 18–24 days | UK/Europe: 18–28 days | Australia: 18–25 days | Singapore: 10–15 days | Kenya/East Africa: 16–20 days. Add 2–5 days for inland transit to ICD Ludhiana and 1–3 days for customs at destination. These are door-to-door timelines. Container vessel schedules vary by carrier — ONS Logistics will share accurate ETDs when booking.",
                links: [
                    { label: "Book Sea Freight — ONS", url: "/contact" },
                    { label: "JNPT Schedule", url: "https://www.jnport.gov.in" },
                ],
            },
            {
                q: "How long does air freight take from India?",
                directAnswer: "Air freight from India takes 2–7 days depending on the destination and airline schedule.",
                a: "Air freight from India typically takes 2–7 days door-to-door. Direct routes: UAE: 1–2 days | UK/Europe: 2–4 days | USA: 3–5 days | Australia: 3–5 days | Southeast Asia: 2–3 days. These timelines include airline transit plus origin and destination customs clearance. India's major air cargo hubs are Delhi (IGIA), Mumbai (CSIA), and Chennai. From Ludhiana, cargo is trucked to Delhi Airport (approximately 5–6 hours) before departure. ONS Logistics can arrange express air freight when you need speed.",
                links: [
                    { label: "Air Freight — ONS", url: "/contact" },
                    { label: "Delhi Air Cargo", url: "https://www.newdelhiairport.in" },
                ],
            },
            {
                q: "How long does it take to get an IEC code?",
                directAnswer: "An IEC code is typically issued by DGFT within 2–3 working days of submitting a complete online application.",
                a: "DGFT issues IEC codes within 2–3 working days after a complete online application is submitted at dgft.gov.in. The process is fully digital — you need your PAN, Aadhar, and bank account details. Once the payment of ₹500 is made and documents are verified, the IEC is generated automatically. In some cases, DGFT may request clarification, which can add 1–2 more days. ONS Logistics can help prepare your documents to ensure a first-time approval.",
                links: [
                    { label: "Apply IEC — DGFT", url: "https://www.dgft.gov.in/CP/?opt=iec" },
                    { label: "ONS IEC Support", url: "/contact" },
                ],
            },
            {
                q: "How long does it take to ship from India to UAE?",
                directAnswer: "Shipping from India to UAE takes 6–10 days by sea and 1–2 days by air freight.",
                a: "India to UAE (Dubai/Abu Dhabi/Sharjah) is one of India's busiest trade lanes. Sea freight takes 6–10 days from JNPT and 9–13 days from Chennai Port. Air freight takes 1–2 days. Most shipments go through Jebel Ali Port (Dubai). Under the India-UAE CEPA (Free Trade Agreement), many Indian goods attract 0% or reduced duty in the UAE, which makes this route very cost-effective for exporters. ONS Logistics ships regularly to the UAE and can get you competitive rates.",
                links: [
                    { label: "India-UAE Shipping — ONS", url: "/contact" },
                    { label: "India-UAE CEPA — DGFT", url: "https://www.dgft.gov.in/CP/?opt=TreatyAgreement" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  ⚖  COMPARISONS  (GEO goldmine)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "comparison",
        group: "Shipping Comparisons",
        items: [
            {
                q: "Air freight vs sea freight — which is better for my shipment?",
                directAnswer: "Choose air freight for urgent, high-value, or lightweight goods; choose sea freight for heavy, bulky, or non-urgent cargo where cost matters most.",
                a: "Air freight vs sea freight — a quick comparison: | Criteria | Air Freight | Sea Freight | | Cost | 6–10× more expensive | Most economical | | Speed | 2–7 days | 8–30 days | | Best for | Electronics, pharma, perishables, urgent goods | Machinery, textiles, commodities, bulk cargo | | Weight limit | No limit (charged by actual/volumetric weight) | No limit (charged per CBM or per container) | | Risk | Lower (faster transit = less exposure) | Higher for fragile goods in long transit | Rule of thumb: if shipping cost is less than 5% of the cargo value and you need it fast, air freight makes sense. For everything else, sea freight saves money.",
                links: [
                    { label: "Air vs Sea Freight — ONS", url: "/contact" },
                    { label: "IATA Cargo", url: "https://www.iata.org/en/programs/cargo/" },
                ],
            },
            {
                q: "FCL vs LCL — what is the difference and which should I choose?",
                directAnswer: "FCL (Full Container Load) is cheaper per unit for large shipments; LCL (Less than Container Load) is better when you have less than 15 CBM of cargo.",
                a: "FCL vs LCL explained: FCL means you book an entire container (20ft ≈ 28 CBM, 40ft ≈ 58 CBM) — it's cheaper per CBM once you fill it and faster since your goods aren't consolidated with others. LCL means you share container space with other shippers and pay only for the space you use. Typically: under 10–12 CBM → LCL is more economical; above 15 CBM → FCL becomes cost-effective. FCL also reduces handling risk since your cargo isn't unloaded and reloaded mid-transit. ONS Logistics offers both options and can advise based on your cargo volume.",
                links: [
                    { label: "FCL & LCL Services — ONS", url: "/services" },
                    { label: "Contact for Quote", url: "/contact" },
                ],
            },
            {
                q: "Courier vs cargo shipping — what is the difference?",
                directAnswer: "Courier (DHL, FedEx, UPS) is best for small parcels under 70 kg; cargo freight forwarding is more economical for larger, heavier shipments.",
                a: "Courier vs cargo shipping: Courier (DHL/FedEx/UPS): Door-to-door, fast (2–5 days), best for documents, samples, and small packages under 70 kg. Expensive on a per-kg basis for large loads. Air Cargo (via freight forwarder like ONS): More economical for 70 kg+, uses airline cargo hold, requires airport pickup or local delivery arrangement. Sea Cargo: Best for 100 kg+ / 1 CBM+, much cheaper, slower (8–30 days). As a rule: under 70 kg → international courier; 70 kg–2 CBM → air cargo; 2 CBM+ → sea freight (LCL or FCL).",
                links: [
                    { label: "Cargo vs Courier — Contact ONS", url: "/contact" },
                ],
            },
            {
                q: "What is the difference between EXW, FOB, CIF, and DDP shipping terms?",
                directAnswer: "These are Incoterms — international rules that define who (buyer or seller) pays for and is responsible for freight, insurance, and customs at each stage.",
                a: "Key Incoterms compared: EXW (Ex Works): Buyer takes all responsibility from the seller's factory gate — highest risk/cost for buyer. FOB (Free on Board): Seller handles export clearance and loads cargo on the vessel; buyer handles ocean freight and beyond. Most common for Indian exporters. CIF (Cost, Insurance, Freight): Seller pays freight and insurance to destination port; buyer handles import customs. DDP (Delivered Duty Paid): Seller handles everything including destination customs and delivery — most convenient for buyer, highest responsibility for seller. For Indian exporters, FOB is most common. For importers buying from abroad, DDP gives you the simplest experience.",
                links: [
                    { label: "ICC Incoterms 2020", url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" },
                    { label: "Trade Terms Guide — ONS", url: "/contact" },
                ],
            },
            {
                q: "India Post vs courier vs freight forwarder — which is best for exporting?",
                directAnswer: "India Post is cheapest for very small B2C parcels; couriers are faster for small B2B samples; a freight forwarder is best for commercial export shipments.",
                a: "Comparison for Indian exporters: India Post (registered parcel/Speed Post): Cheapest for small packets (under 2 kg), useful for e-commerce exports, slow (7–21 days), limited tracking. International Couriers (DHL, FedEx, UPS): Fast (2–5 days), excellent tracking, good for high-value samples and documents, expensive above 50 kg. Freight Forwarder (like ONS Logistics): Best for commercial shipments, lower per-kg rates for air cargo above 70 kg, sea freight for large cargo, handles B/L, customs, and all compliance. Also assists with export documentation, RCMC, and DGFT schemes. Most established Indian exporters use freight forwarders for regular commercial shipments.",
                links: [
                    { label: "ONS Freight Forwarding", url: "/services" },
                    { label: "India Post International", url: "https://www.indiapost.gov.in" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  📦  TRADE BASICS  (reformatted for AEO)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "basics",
        group: "Trade Basics",
        items: [
            {
                q: "What is the difference between import and export?",
                directAnswer: "Importing means bringing foreign goods into India; exporting means sending Indian goods to another country.",
                a: "Importing means bringing goods into India from abroad — you are the consignee (buyer/receiver). Exporting means sending goods from India to a foreign buyer — you are the consignor (seller/shipper). Both require an IEC code, customs declarations, and compliance with India's Foreign Trade Policy. Import shipments attract customs duties and IGST; exports are generally zero-rated for GST. The process differs too: imports use a Bill of Entry, exports use a Shipping Bill.",
                links: [
                    { label: "DGFT India", url: "https://www.dgft.gov.in" },
                    { label: "WTO Trade Glossary", url: "https://www.wto.org/english/thewto_e/glossary_e/glossary_e.htm" },
                ],
            },
            {
                q: "What is an IEC (Importer Exporter Code) and do I need one?",
                directAnswer: "An IEC is a mandatory 10-digit number issued by DGFT — without it, you cannot legally import or export from India.",
                a: "An IEC (Importer Exporter Code) is a 10-digit unique identification number issued by DGFT, Government of India. It is mandatory for any business or individual importing or exporting goods from India. Without a valid IEC, customs will not allow clearance of your shipment. The application is entirely online at dgft.gov.in, costs ₹500, and takes 2–3 working days. Individuals can also use their PAN as IEC for certain categories. ONS Logistics can assist you with the IEC application if you're just starting out.",
                links: [
                    { label: "Apply IEC — DGFT", url: "https://www.dgft.gov.in/CP/?opt=iec" },
                    { label: "ONS IEC Support", url: "/contact" },
                ],
            },
            {
                q: "What is the role of a Customs House Agent (CHA)?",
                directAnswer: "A CHA is a licensed professional who files import/export customs documents on your behalf and handles clearance with Indian customs authorities.",
                a: "A Customs House Agent (CHA), also called a Licensed Customs Broker, is licensed by CBIC to file customs entries (Bill of Entry for imports, Shipping Bill for exports) on behalf of traders. They handle all paperwork, coordinate duty payments, liaise with customs officers during examinations, and ensure your goods clear without delays. Hiring a good CHA — like the team at ONS Logistics — saves time, reduces compliance errors, and avoids costly penalties. Especially important if you're new to international trade.",
                links: [
                    { label: "CBIC CHA Licensing", url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-act&rules/cha-regulations2018" },
                    { label: "ONS Customs Services", url: "/services" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  🛃  CUSTOMS  (reformatted for AEO)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "customs",
        group: "Customs Clearance",
        items: [
            {
                q: "What is the customs clearance process in India?",
                directAnswer: "Customs clearance in India involves filing a Bill of Entry on ICEGATE, paying duties, and obtaining a release order — most take 1–3 days.",
                a: "The import customs clearance process in India: (1) File a Bill of Entry on the ICEGATE portal (your CHA does this); (2) Customs assesses duty based on your HS code and CIF value; (3) You pay applicable duties (BCD + SWS + IGST); (4) Customs may select your shipment for physical examination or document verification; (5) Once cleared, an out-of-charge (OOC) order is issued and goods are released. For exports, a Shipping Bill replaces the Bill of Entry. Most clearances are processed under the SWIFT electronic system with minimal human intervention.",
                links: [
                    { label: "ICEGATE Portal", url: "https://www.icegate.gov.in" },
                    { label: "CBIC Customs", url: "https://www.cbic.gov.in" },
                ],
            },
            {
                q: "What happens if my goods are held at customs?",
                directAnswer: "If your goods are held at customs, you'll receive a notice requiring you to provide documents or clarification — act quickly to avoid demurrage charges.",
                a: "Goods are held at customs for reasons like: document discrepancies, undervaluation queries, mis-declared HS codes, prohibited/restricted goods, or random examination. You'll receive a notice (sometimes called a query) and must respond within the given timeframe. If duties are unpaid or documents are missing, customs can issue a Show Cause Notice (SCN). In serious cases (smuggling, fraud), goods may be seized under Section 110 of the Customs Act. The longer goods sit at the port, the more demurrage and container rent you pay. A CHA or trade lawyer can resolve most disputes quickly — contact ONS Logistics immediately if your goods are held.",
                links: [
                    { label: "Customs Act 1962", url: "https://www.indiacode.nic.in/handle/123456789/1495" },
                    { label: "Contact ONS for Help", url: "/contact" },
                ],
            },
            {
                q: "What is an HS Code and how do I find the right one for my goods?",
                directAnswer: "An HS Code is an international product classification number — in India, it's 8 digits and determines your customs duty rate.",
                a: "An HS Code (Harmonized System Code) is an internationally standardized 6-digit (8-digit in India — called ITC-HS) number that classifies every traded product. The correct HS code is critical — it determines your customs duty rate, GST rate, and whether your goods need a special license or are prohibited. Wrong HS codes attract penalties and can cause your goods to be seized. You can search for the right ITC-HS code using DGFT's portal or the CBIC customs tariff. When in doubt, ask ONS Logistics — our team regularly works with hundreds of different product categories.",
                links: [
                    { label: "Search ITC-HS — DGFT", url: "https://www.dgft.gov.in/CP/?opt=itchs" },
                    { label: "Customs Tariff — CBIC", url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-act&rules/customs-tariff-amnd" },
                    { label: "WTO HS Database", url: "https://hstracker.wto.org" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  📄  DOCUMENTS  (reformatted for AEO)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "docs",
        group: "Required Documents",
        items: [
            {
                q: "What documents are required for importing goods into India?",
                directAnswer: "The core documents for India import are: Bill of Entry, Commercial Invoice, Packing List, and Bill of Lading or Airway Bill.",
                a: "Key documents for import into India include: (1) Bill of Entry — filed on ICEGATE by your CHA; (2) Commercial Invoice — showing value, quantity, and description; (3) Packing List — item-by-item breakdown of the consignment; (4) Bill of Lading (sea) or Airway Bill (air) — issued by the carrier; (5) Certificate of Origin — needed to claim FTA benefits; (6) Import License — required for restricted goods; (7) Product-specific certificates — FSSAI for food, BIS for electronics, Drug License for pharma. All documents must match exactly — any discrepancy triggers a customs query.",
                links: [
                    { label: "CBIC Import Guide", url: "https://www.cbic.gov.in" },
                    { label: "FSSAI Import", url: "https://www.fssai.gov.in/cms/import.php" },
                    { label: "BIS India", url: "https://www.bis.gov.in" },
                ],
            },
            {
                q: "What is a Certificate of Origin and when is it required?",
                directAnswer: "A Certificate of Origin proves where your goods were made — it's required to claim reduced or zero duty under Free Trade Agreements.",
                a: "A Certificate of Origin (CoO) certifies the country in which your goods were produced or manufactured. It is required when importing under an FTA (Free Trade Agreement) to claim preferential (lower) duty rates. For example, under the India-UAE CEPA, Indian goods can enter the UAE at 0% duty with a valid CoO. Without it, you pay standard MFN duties. CoOs are issued by Chambers of Commerce (like FICCI, CII) or Export Promotion Councils. There are different types — Preferential CoO, Non-Preferential CoO, and Form-specific CoOs (like Form A, Form AI).",
                links: [
                    { label: "FIEO CoO", url: "https://www.fieo.org/view_section.php?lang=0&id=0,376,399" },
                    { label: "India FTA List — DGFT", url: "https://www.dgft.gov.in/CP/?opt=TreatyAgreement" },
                ],
            },
            {
                q: "What is a Bill of Lading vs an Airway Bill?",
                directAnswer: "A Bill of Lading is for sea freight; an Airway Bill is for air freight — both are the key transport documents needed for customs clearance.",
                a: "A Bill of Lading (BoL) is issued by the shipping line for sea cargo and acts as receipt, contract of carriage, and title document. It can be negotiable (transferable to another party), making it a valuable financial instrument in trade finance. An Airway Bill (AWB) serves the same purpose for air cargo but is always non-negotiable — the consignee named on the AWB receives the goods. Both documents are required for customs clearance and releasing cargo at the destination. Losing either can cause serious delays and legal complications.",
                links: [
                    { label: "IATA AWB Guide", url: "https://www.iata.org/en/programs/cargo/airwaybill/" },
                    { label: "IMO Shipping", url: "https://www.imo.org" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  💵  DUTIES & TAXES  (reformatted for AEO)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "duties",
        group: "Duties & Taxes",
        items: [
            {
                q: "How are import duties calculated in India?",
                directAnswer: "Import duty in India is calculated on the CIF value (Cost + Insurance + Freight) and includes Basic Customs Duty, IGST, and a Social Welfare Surcharge.",
                a: "Import duty calculation in India: (1) Start with CIF value (Cost of goods + Insurance + Freight to Indian port); (2) Add Basic Customs Duty (BCD) — varies by product, typically 0–40%; (3) Add Social Welfare Surcharge (SWS) — 10% of BCD; (4) Add IGST — typically 5%, 12%, or 18% on (CIF + BCD + SWS); (5) In some cases, add AIDC (Agriculture Infrastructure Development Cess). Example: ₹1,00,000 CIF value + 10% BCD (₹10,000) + 1,000 SWS + 18% IGST on ₹1,11,000 = approximately ₹1,30,980 landed cost. Use CBIC's duty calculator for exact figures.",
                links: [
                    { label: "CBIC Duty Calculator", url: "https://www.cbic-gst.gov.in/cbieccounters/cst.html" },
                    { label: "Customs Tariff", url: "https://www.cbic.gov.in/htdocs-cbec/customs/cst-act&rules/customs-tariff-amnd" },
                ],
            },
            {
                q: "What is IGST on imports and can I claim it back?",
                directAnswer: "IGST is levied on all imports into India — registered GST businesses can claim it back as Input Tax Credit (ITC) against their output GST.",
                a: "IGST (Integrated GST) is applied to all goods imported into India at the same rate as domestic supply — 5%, 12%, or 18% depending on the product. It is calculated on (CIF value + BCD + SWS). The good news: if your business is GST-registered, you can claim the full IGST paid on imports as Input Tax Credit (ITC). This ITC can be offset against your GST output liability (sales), making the import tax effectively cost-neutral for most businesses. Non-registered individuals and businesses pay IGST without reclaim.",
                links: [
                    { label: "GST Portal", url: "https://www.gst.gov.in" },
                    { label: "CBIC GST Import Guide", url: "https://www.cbic-gst.gov.in" },
                ],
            },
            {
                q: "Are there any goods prohibited or restricted for import/export in India?",
                directAnswer: "Yes — India classifies goods as Free, Restricted, Canalised, or Prohibited under its Foreign Trade Policy. Restricted goods need special licenses.",
                a: "India's Foreign Trade Policy (FTP) classifies goods in four categories: Free (no restriction — most goods), Restricted (need a special import/export license — e.g., certain chemicals, weapons, seeds, live animals), Canalised (can only be traded through designated government agencies like STC or MMTC — e.g., petroleum, some fertilizers), and Prohibited (cannot be imported or exported at all — e.g., certain wildlife products, narcotics, counterfeit currency). You can check the trade policy classification for any product by its ITC-HS code on DGFT's portal.",
                links: [
                    { label: "ITC-HS Import Policy — DGFT", url: "https://www.dgft.gov.in/CP/?opt=itchs" },
                    { label: "Foreign Trade Policy 2023", url: "https://www.dgft.gov.in/CP/?opt=ftp" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  🚚  LOGISTICS  (reformatted for AEO)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "logistics",
        group: "Logistics & Shipping",
        items: [
            {
                q: "What is Incoterms and why does it matter for my shipment?",
                directAnswer: "Incoterms are international shipping rules that define who (buyer or seller) pays for freight, insurance, and customs at each stage of delivery.",
                a: "Incoterms (International Commercial Terms), published by the ICC, are globally recognized rules defining the division of costs, risks, and responsibilities between buyer and seller. Choosing the wrong Incoterm can leave you liable for unexpected freight costs, customs delays, or cargo damage. Common terms: EXW — buyer takes responsibility from seller's premises; FOB — seller handles export clearance and vessel loading; CIF — seller pays ocean freight and insurance; DDP — seller handles everything including destination duties. Most Indian exporters use FOB; most importers prefer CIF or DDP for convenience.",
                links: [
                    { label: "ICC Incoterms 2020", url: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" },
                    { label: "Know Your Incoterms", url: "https://www.trade.gov/know-your-incoterms" },
                ],
            },
            {
                q: "How do I track my shipment through Indian customs?",
                directAnswer: "Track your import/export shipment using your Bill of Entry or Shipping Bill number on the ICEGATE portal at icegate.gov.in.",
                a: "You can track your shipment's customs status on the ICEGATE portal (icegate.gov.in) using your Bill of Entry number (for imports) or Shipping Bill number (for exports). For sea cargo, shipping lines like Maersk, MSC, and COSCO have their own tracking portals using the container number or B/L number. For port-level status, check JNPT's GEMS system or Chennai Port's e-Port. For air cargo, use the airline's cargo tracking with your AWB number. ONS Logistics provides proactive shipment updates to all our clients so you're never in the dark.",
                links: [
                    { label: "ICEGATE Tracking", url: "https://www.icegate.gov.in/Webappl/esanchit" },
                    { label: "JNPT Port", url: "https://www.jnport.gov.in" },
                    { label: "Track via ONS", url: "/contact" },
                ],
            },
        ],
    },

    // ══════════════════════════════════════════════════════════════
    //  🇮🇳  INDIA-SPECIFIC  (reformatted for AEO)
    // ══════════════════════════════════════════════════════════════
    {
        cat: "india",
        group: "India-Specific Regulations",
        items: [
            {
                q: "What is the Foreign Trade Policy (FTP) 2023 and how does it affect exporters?",
                directAnswer: "India's FTP 2023 governs all import and export activity and offers schemes like Advance Authorization, EPCG, and RoDTEP to reduce costs for exporters.",
                a: "India's Foreign Trade Policy (FTP) 2023, released by DGFT, sets the rules for all import and export activity in India. For exporters, it introduces and continues key benefit schemes: RoDTEP (Remission of Duties and Taxes on Exported Products — refunds embedded duties in export prices), Advance Authorization (duty-free procurement of raw materials for export production), and EPCG (zero/concessional duty on capital goods for export use). Compliance with FTP is mandatory — violations can result in IEC cancellation and prosecution under the Foreign Trade (Development & Regulation) Act.",
                links: [
                    { label: "FTP 2023 — DGFT", url: "https://www.dgft.gov.in/CP/?opt=ftp" },
                    { label: "Advance Authorization", url: "https://www.dgft.gov.in/CP/?opt=AA" },
                ],
            },
            {
                q: "What is FSSAI import registration for food products?",
                directAnswer: "All food products imported into India require FSSAI clearance — the importer must hold an FSSAI Central License and every consignment is tested at the port.",
                a: "Any food product imported into India — including processed foods, spices, health supplements, beverages, and agricultural produce — requires prior clearance from FSSAI (Food Safety and Standards Authority of India). The importer must hold an FSSAI Central License (Import License). At the port, each consignment undergoes document review and lab testing. Products must comply with Indian food safety standards on labeling, additives, and composition. Non-compliant consignments are rejected and must be re-exported. FSSAI clearance adds 5–15 working days to the customs process. Plan your food imports accordingly.",
                links: [
                    { label: "FSSAI Import Regulations", url: "https://www.fssai.gov.in/cms/import.php" },
                    { label: "FoSCoS Portal", url: "https://foscos.fssai.gov.in" },
                ],
            },
            {
                q: "What are the export promotion schemes available in India?",
                directAnswer: "India's main export schemes include RoDTEP, Advance Authorization, EPCG, SEZ, and EOU — all designed to reduce costs and boost export competitiveness.",
                a: "India offers several government schemes to promote exports: RoDTEP — refunds embedded taxes and duties on exported goods (claimed as transferable scrips or direct credit); Advance Authorization — duty-free import of inputs used in export production; EPCG — zero/concessional duty on capital goods with export obligation; SEZ (Special Economic Zones) — tax exemptions, simplified procedures for units set up inside zones; EOU (Export Oriented Units) — similar benefits outside SEZs. ECGC provides export credit insurance to protect against buyer default and country risk. ONS Logistics can help you identify and apply for the right scheme for your business.",
                links: [
                    { label: "Export Schemes — DGFT", url: "https://www.dgft.gov.in" },
                    { label: "ECGC Insurance", url: "https://www.ecgc.in" },
                    { label: "SEZ India", url: "https://www.sezindia.nic.in" },
                    { label: "Contact ONS", url: "/contact" },
                ],
            },
        ],
    },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
export const getAllItems = () => faqs.flatMap((g) => g.items.map((item) => ({ ...item, group: g.group, cat: g.cat })));

export const getCategoryGroups = (catId) =>
    catId === "all" ? faqs : faqs.filter((g) => g.cat === catId);

export const getValidCategoryIds = () =>
    [...new Set(faqs.map((g) => g.cat))];