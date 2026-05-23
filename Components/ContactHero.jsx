"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Truck, Shield, HeadphonesIcon, Star, HelpCircle } from "lucide-react";

export default function ContactHero() {
  const phoneNumbers = [
    { text: "+91-99888-87971", href: "tel:+919988887971" },
    { text: "+91-99888-86501", href: "tel:+919988886501" },
    { text: "+91-99888-86500", href: "tel:+919988886500" },
    { text: "+91-99888-13766", href: "tel:+919988813766" },
  ];

  const emails = [
    { text: "info@onslog.com", href: "mailto:info@onslog.com" },
  ];

  const stats = [
    { value: "22+", label: "Years of Experience" },
    { value: "10K+", label: "Shipments Delivered" },
    { value: "5000+", label: "Happy Clients" },
    { value: "< 2hr", label: "Avg. Response Time" },
  ];

  const reasons = [
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      title: "Dedicated Support",
      desc: "A real person answers your call — no bots, no runaround.",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "End-to-End Logistics",
      desc: "From first mile to last mile, we handle every leg of your shipment.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Fully Insured & Reliable",
      desc: "Your goods are protected with transparent documentation at every step.",
    },
  ];

  return (
    <section className="bg-white">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[580px] md:min-h-[640px] overflow-hidden flex items-center bg-gradient-to-br from-blue-50 via-white to-gray-50">

        {/* Background Image */}
        <Image
          src="/contactUs.jpg"
          alt="Contact ONS Logistics"
          fill
          className="object-cover"
          priority
        />

        {/* Multi-layer gradient overlay — darker on left for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-blue-900/30" />


        {/* Decorative diagonal accent */}
        <div className="absolute -left-20 top-0 h-full w-64 bg-blue-600/10 skew-x-6 blur-2xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-blue-200 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Our team is online — typically replies in under 2 hours
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
              Let's Move Your<br />
              <span className="text-blue-400">Cargo Forward</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-lg leading-relaxed mb-8">
              Whether you need a quick quote, a custom logistics solution, or just have a question — our team is ready to help you ship smarter, faster, and safer.
            </p>

            {/* Trust bullets */}
            <ul className="space-y-2 mb-9">
              {[
                "No-obligation free consultation",
                "Pan-India & international coverage",
                "Transparent pricing, zero hidden charges",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/contact#contact-form"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all hover:-translate-y-0.5"
              >
                Send Us a Message
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="tel:+919988887971"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-7 py-4 text-base font-semibold text-white hover:bg-white/20 transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>

          {/* Right: Floating stats card */}
          <div className="hidden lg:flex flex-col gap-4 items-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl">
              <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-4">
                ONS Logistics at a glance
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-white leading-none mb-1">{s.value}</p>
                    <p className="text-[11px] text-slate-300 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mt-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-slate-300 ml-1">Rated 4.9 / 5 by clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY CONTACT US strip ──────────────────────────────────── */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-500/50 gap-0">
          {reasons.map((r) => (
            <div key={r.title} className="flex items-start gap-4 px-6 first:pl-0 last:pr-0 py-4 md:py-0">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                {r.icon}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{r.title}</p>
                <p className="text-blue-100 text-sm leading-snug mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACT CARDS ─────────────────────────────────────────── */}
      <div id="contact-details" className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Contact <span className="text-blue-600">Information</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Reach out through any channel — we'll get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">

          {/* Address */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Head Office</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  #24, Aatma Nagar, Near Radha Swami Satsang Bhawan Gate No.7<br />
                  Mundian Kalan, Chandigarh Road<br />
                  Ludhiana-140015, Punjab, India
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Phone Numbers</h3>
                <div className="space-y-1.5">
                  {phoneNumbers.map((phone, idx) => (
                    <a key={idx} href={phone.href}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      {phone.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Email Address</h3>
                {emails.map((email, idx) => (
                  <a key={idx} href={email.href}
                    className="block text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                    {email.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Working Hours</h3>
                <div className="space-y-1 text-sm text-gray-500">
                  <p><span className="font-medium text-gray-700">Monday – Saturday:</span> 9:00 AM – 6:00 PM</p>
                  <p><span className="font-medium text-gray-700">Sunday:</span> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick contact banner ───────────────────────────────── */}
          <div className="mt-20 rounded-3xl bg-slate-900 p-10 md:p-14 text-center relative overflow-hidden mb-12">
            {/* decorative circles */}
            <div aria-hidden className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-600/20" />
            <div aria-hidden className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-blue-600/10" />

            <div className="relative z-10">
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">Need Help Now?</p>
              <h2 className="text-3xl font-bold mb-3 text-white">Immediate Assistance, Zero Wait</h2>
              <p className="text-white leading-relaxed text-sm">
                Our team is on standby during business hours. Call us directly or shoot an email — we'll respond with expert advice tailored to your shipment requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <a href="tel:18008907365"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-900 px-6 py-3.5 font-semibold text-sm hover:bg-blue-50 transition-all shadow-lg">
                <Phone className="w-4 h-4" />
                Call Toll Free
              </a>
              <a href="mailto:info@onslog.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-white px-6 py-3.5 font-semibold text-sm hover:bg-white/20 transition-all">
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>
            </div>
          </div>

        {/* ── Map ───────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Visit Our <span className="text-blue-600">Office</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Located in Ludhiana, Punjab — easily accessible for in-person consultations
          </p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="w-full h-[400px] md:h-[500px]">
            <iframe
              src="https://www.google.com/maps?q=ONS+Logistics,+Aatma+Nagar,+Mundian+Kalan,+Ludhiana,+Punjab,+India&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ONS Logistics Office Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}