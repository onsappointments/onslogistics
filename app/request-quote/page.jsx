"use client";
import ShowStatus from "@/Components/ShowStatus";
import { useRef, useState, useEffect } from "react";
import RequestQuoteForm from "@/Components/RequestQuoteForm";

/* ─── FAQ item ───────────────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${open ? "shadow-md" : ""}`}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span
          className="font-semibold text-gray-900 text-base leading-snug"
          itemProp="name"
        >
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        className={`transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <p className="px-6 pb-5 text-gray-600 leading-relaxed text-sm" itemProp="text">
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function RequestQuotePage() {
  const [status, setStatus] = useState({ title: "", message: "" });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [quoteId, setQuoteId] = useState(null);
  const [statusType, setStatusType] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const formSectionRef = useRef(null);


  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showStatus = (type, title, message) => {
    setStatusType(type);
    setStatus({ title, message });
    setShowStatusModal(true);
  };

  const handleSubmitClick = async () => {
    if (formRef.current?.handleSubmit) {
      const result = await formRef.current.handleSubmit(showStatus);
      if (result) {
        setQuoteId(result.otpId);
        setShowOtpModal(true);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      showStatus("warning", "Please enter the OTP", "");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quotes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        showStatus("error", "Invalid OTP", data.error || "Invalid OTP");
        setLoading(false);
        return;
      }
      showStatus("success", "Quote Submitted", "Your quote request has been submitted successfully!");
      setShowOtpModal(false);
      setOtp("");
      setQuoteId(null);
    } catch (err) {
      console.error(err);
      showStatus("error", "Verification Failed", "Verification failed");
    }
    setLoading(false);
  };

  /* ── FAQ data (SEO-rich) ────────────────────────────────────────────── */
  const faqs = [
    {
      q: "Is requesting a freight quote from ONS Logistics free?",
      a: "Absolutely. Requesting a quote is completely free with no obligation to proceed. Simply fill out the form and our logistics experts will analyse your requirements and send you a competitive, customised quote — typically within a few business hours.",
    },
    {
      q: "How long does it take to receive my freight quote?",
      a: "Most quotes are delivered within 4–8 business hours. For standard FCL sea freight or domestic road shipments, we often respond even faster. Complex multimodal routes or specialised cargo may require up to 24 hours to ensure accuracy.",
    },
    {
      q: "What information do I need to request a quote?",
      a: "You'll need the origin and destination (country, city, port/door), shipment details (cargo type, dimensions, weight, number of pieces), mode of transport preference (sea/air/road), and your contact information. The more detail you provide, the more precise your quote will be.",
    },
    {
      q: "Can ONS Logistics handle customs clearance along with freight?",
      a: "Yes. ONS Logistics is a licensed Customs House Agent (CHA) empanelled by CONCOR and holds MTO registration. We handle end-to-end customs documentation, duty payments, and clearance for both imports and exports across all major Indian ports and ICDs.",
    },
    {
      q: "What freight modes does ONS Logistics offer?",
      a: "We offer sea freight (FCL and LCL), air freight, air courier, and road transportation. Our sea freight covers major trade lanes between India, UAE, Europe, the USA, and Southeast Asia. Air freight is ideal for time-sensitive or high-value cargo.",
    },
    {
      q: "Do you handle LCL (Less than Container Load) shipments?",
      a: "Yes. We consolidate LCL cargo from multiple shippers into a single container, making international shipping cost-effective for smaller volumes. Your goods are professionally packed, insured during consolidation, and tracked end-to-end.",
    },
    {
      q: "Can you ship hazardous or temperature-controlled goods?",
      a: "Yes. The quote form allows you to specify IMO codes for dangerous goods and temperature requirements for cold-chain cargo. Our team will confirm compliance requirements and special handling procedures before confirming your shipment.",
    },
    {
      q: "Which countries does ONS Logistics ship to?",
      a: "ONS Logistics operates across 50+ countries globally. Our primary corridors include India ↔ UAE, India ↔ Europe (via Rotterdam), India ↔ USA, and India ↔ Singapore. We can also arrange freight to virtually any destination through our global agent network.",
    },
  ];

  /* ── Benefits data ──────────────────────────────────────────────────── */
  const benefits = [
    {
      icon: "🆓",
      title: "Completely Free",
      desc: "No hidden charges, no commitment. Get a detailed quote at zero cost.",
    },
    {
      icon: "⚡",
      title: "Fast Turnaround",
      desc: "Receive a tailored freight quote in as little as 4–8 business hours.",
    },
    {
      icon: "🎯",
      title: "Custom Pricing",
      desc: "Every quote is built around your cargo, route, and timeline — not a generic rate card.",
    },
    {
      icon: "🛡️",
      title: "Expert Guidance",
      desc: "Our 15+ year team advises on mode selection, Incoterms, and documentation upfront.",
    },
  ];

  /* ── Services data ──────────────────────────────────────────────────── */
  const services = [
    { icon: "🚢", label: "Sea Freight", sub: "FCL & LCL" },
    { icon: "✈️", label: "Air Freight", sub: "Express & Standard" },
    { icon: "🚛", label: "Road Transport", sub: "Pan-India" },
    { icon: "📦", label: "Customs Clearance", sub: "Import & Export" },
    { icon: "🏭", label: "Warehousing", sub: "Short & Long Term" },
    { icon: "🌍", label: "Supply Chain", sub: "End-to-End" },
  ];

  return (
    <>
      {/* ── Google Fonts ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ons-font { font-family: 'Plus Jakarta Sans', sans-serif; }

        .trust-pill {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
        }

        .step-connector::after {
          content: '';
          position: absolute;
          top: 28px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #bfdbfe, #3b82f6);
          z-index: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.35s; }
        .delay-4 { animation-delay: 0.5s; }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(29, 98, 214, 0.12);
        }

        .benefit-card:hover .benefit-icon {
          transform: scale(1.15);
        }
      `}</style>

      <main className="ons-font bg-[#F5F5F7] min-h-screen">

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{
            background: [
              "linear-gradient(90deg,rgba(30,58,138,0.92) 0%,rgba(30,58,138,0.65) 50%,rgba(30,58,138,0.28) 100%)",
              "url('/quote-hero.png')",
            ].join(", "),
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        >
          {/* Subtle grid pattern — same as duty calculator */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: [
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "48px 48px",
              opacity: 0.6,
            }}
          />
          {/* Orange warmth glow top-right */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-15%", right: "8%",
              width: 480, height: 480,
              borderRadius: "50%",
              background: "rgba(240,123,16,0.11)",
              filter: "blur(90px)",
            }}
          />
          {/* Subtle blue glow bottom-left */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-10%", left: "5%",
              width: 320, height: 320,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.12)",
              filter: "blur(72px)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-300/40 text-blue-100 text-xs font-semibold uppercase tracking-widest rounded-full px-4 py-1.5 mb-6 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Free · No Obligation · Fast Response
            </div>

            {/* H1 — primary SEO headline */}
            <h1 className="fade-up delay-1 text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Get a Free Freight Quote<br className="hidden md:block" />
              <span className="text-blue-300"> in Minutes</span>
            </h1>

            <p className="fade-up delay-2 text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Sea freight, air freight, road transport, and customs clearance — tell us your shipment details and our experts will deliver a competitive, custom quote tailored to your cargo and budget.
            </p>

            {/* CTA */}
            <div className="fade-up delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button
                onClick={scrollToForm}
                className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                Request My Free Quote →
              </button>
              <a
                href="tel:18008907365"
                className="px-8 py-4 border border-white/40 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-base"
              >
                📞 Call 1800-890-7365
              </a>
            </div>

            {/* Trust pills */}
            <div className="fade-up delay-4 flex flex-wrap justify-center gap-3">
              {[
                "✅ CONCOR Empanelled CHA",
                "✅ MSME Registered",
                "✅ MTO Certified",
                "✅ 50+ Countries",
              ].map((pill) => (
                <span key={pill} className="trust-pill text-white text-xs font-medium px-4 py-2 rounded-full">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — WHY GET A QUOTE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white" aria-labelledby="why-quote-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">
                Why Choose ONS Logistics
              </p>
              <h2
                id="why-quote-heading"
                className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
              >
                Your Shipment. Our Priority.
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                From a single parcel to full container loads, we build freight solutions around your business — not the other way around.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="benefit-card bg-[#F5F5F7] rounded-2xl p-6 flex flex-col gap-4 hover:bg-blue-50 transition-colors duration-300 cursor-default"
                >
                  <div
                    className="benefit-icon text-4xl transition-transform duration-300 w-fit"
                    role="img"
                    aria-label={title}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — HOW IT WORKS
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-[#F5F5F7]" aria-labelledby="how-it-works-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">
                Simple 3-Step Process
              </p>
              <h2
                id="how-it-works-heading"
                className="text-3xl md:text-4xl font-extrabold text-gray-900"
              >
                How to Get Your Freight Quote
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line — desktop only */}
              <div className="hidden md:block absolute top-[38px] left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

              {[
                {
                  step: "01",
                  title: "Fill the Form",
                  desc: "Provide your shipment details — origin, destination, cargo type, weight, and dimensions. Takes under 3 minutes.",
                  color: "bg-blue-600",
                },
                {
                  step: "02",
                  title: "We Analyse",
                  desc: "Our freight specialists review your requirements and source the best rates across our global carrier network.",
                  color: "bg-blue-700",
                },
                {
                  step: "03",
                  title: "Receive Your Quote",
                  desc: "Get a detailed, transparent quote via email within hours. No hidden fees, no surprises — just honest pricing.",
                  color: "bg-blue-800",
                },
              ].map(({ step, title, desc, color }) => (
                <div key={step} className="relative flex flex-col items-center text-center">
                  <div
                    className={`relative z-10 w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-5 shadow-lg`}
                  >
                    {step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Your Quote Now →
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — SERVICES WE QUOTE FOR
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white" aria-labelledby="services-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">
                What We Quote For
              </p>
              <h2
                id="services-heading"
                className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
              >
                All Freight Modes, One Quote
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Whether you're shipping a pallet or a full container, domestic or international — we've got you covered.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {services.map(({ icon, label, sub }) => (
                <div
                  key={label}
                  className="service-card bg-[#F5F5F7] rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 cursor-default"
                >
                  <span className="text-3xl flex-shrink-0" role="img" aria-label={label}>
                    {icon}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{label}</p>
                    <p className="text-gray-400 text-sm">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — SOCIAL PROOF STRIP
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-14 px-6 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white text-2xl md:text-3xl font-extrabold leading-snug mb-3">
              "ONS Logistics reduced our freight costs by 22% and our shipments always arrive on time. Best decision we made for our supply chain."
            </p>
            <p className="text-blue-200 text-sm font-medium">
              — Export Manager, Punjab-based Textile Manufacturer
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 7 — FAQ (SEO SCHEMA)
        ═══════════════════════════════════════════════════════════════ */}
        <section
          className="py-20 px-6 bg-[#F5F5F7]"
          aria-labelledby="faq-heading"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">
                Frequently Asked Questions
              </p>
              <h2
                id="faq-heading"
                className="text-3xl md:text-4xl font-extrabold text-gray-900"
              >
                Freight Quotes — Answered
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 8 — FORM (existing logic preserved)
        ═══════════════════════════════════════════════════════════════ */}
        <section
          ref={formSectionRef}
          className="py-20 px-6 bg-white scroll-mt-4"
          aria-labelledby="form-heading"
          id="quote-form"
        >
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">
                Get Started
              </p>
              <h2
                id="form-heading"
                className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
              >
                Request Your Free Freight Quote
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Fill in your shipment details below. The more information you provide, the more accurate and competitive your quote will be.
              </p>
            </div>

            {/* Trust micro-copy */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-gray-500">
              {[
                "🔒 Your data is secure",
                "⏱ Response within 8 hours",
                "📧 OTP-verified submission",
                "🆓 Always free to quote",
              ].map((item) => (
                <span key={item} className="font-medium">
                  {item}
                </span>
              ))}
            </div>

            {/* ── Escape hatch — shown ABOVE the form ────────────────── */}
            <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <p className="text-center text-sm font-semibold text-gray-500 mb-5 tracking-wide uppercase">
                Prefer a quicker route? We've got you covered.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Book Appointment */}
                <a
                  href="/book-appointment"
                  className="group flex items-start gap-4 bg-white rounded-2xl border border-blue-100 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 no-underline"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    📅
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">Book an Appointment</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Schedule a free 15-min call with a freight expert. We'll build the quote together.
                    </p>
                    <span className="inline-block mt-2 text-blue-600 text-xs font-bold tracking-wide">
                      Pick a time slot →
                    </span>
                  </div>
                </a>

                {/* Contact Us */}
                <a
                  href="/contact"
                  className="group flex items-start gap-4 bg-white rounded-2xl border border-blue-100 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 no-underline"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    💬
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">Talk to Us Directly</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Call, email, or WhatsApp us. Our team responds within the hour on business days.
                    </p>
                    <span className="inline-block mt-2 text-blue-600 text-xs font-bold tracking-wide">
                      Get in touch →
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* The existing form component */}
            <RequestQuoteForm ref={formRef} setParentLoading={setLoading} adminMode={false} />

            {/* Submit */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitClick}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:bg-blue-300 disabled:cursor-not-allowed text-base"
              >
                {loading ? "Submitting..." : "Submit Quote Request →"}
              </button>
              <p className="text-gray-400 text-xs">
                By submitting, you agree to be contacted by ONS Logistics regarding your shipment.
              </p>

              {/* ── Fallback strip below submit ───────────────────────── */}
              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
                <span className="font-medium">Not ready to submit?</span>
                <div className="flex items-center gap-3">
                  <a
                    href="/book-appointment"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition-all text-xs"
                  >
                    📅 Book a Call
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition-all text-xs"
                  >
                    💬 Contact Us
                  </a>
                  <a
                    href="tel:18008907365"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition-all text-xs"
                  >
                    📞 1800-890-7365
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            OTP MODAL — unchanged logic, updated styling
        ═══════════════════════════════════════════════════════════════ */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mx-auto mb-5">
                📧
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Verify Your Email</h3>
              <p className="text-gray-500 text-sm mb-6">
                Enter the 6-digit OTP sent to your email address to confirm your quote request.
              </p>

              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-2xl px-4 py-4 text-center text-2xl tracking-[0.6em] outline-none transition-colors font-bold"
                placeholder="······"
              />

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:bg-blue-300 transition-colors"
                >
                  {loading ? "Verifying..." : "Verify & Submit"}
                </button>
              </div>

              {status.message && (
                <p className="text-red-500 text-sm mt-4">{status.message}</p>
              )}
            </div>
          </div>
        )}
      </main>

      {showStatusModal && (
        <ShowStatus
          type={statusType}
          title={status.title}
          message={status.message}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </>
  );
}