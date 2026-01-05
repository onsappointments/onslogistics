"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const services = [
    { name: "Freight Forwarding", href: "/services#freight" },
    { name: "Road Transportation", href: "/services#road" },
    { name: "Sea Cargo", href: "/services#sea" },
    { name: "Air Cargo", href: "/services#air" },
    { name: "Licensing", href: "/services#licensing" },
    { name: "Export / Import Consultation", href: "/services#export" },
    { name: "Custom Clearance", href: "/services#custom" },
  ];

  return (
    <footer className="bg-white text-gray-900">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-between gap-10">

          {/* Company Info */}
          <div className="flex flex-col space-y-6 justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ONS Logistics Logo"
                width={70}
                height={70}
              />
              <h2 className="text-xl font-bold text-slate-900">
                ONS Logistics India Pvt. Ltd.
              </h2>
            </div>

            <p className="text-md leading-relaxed text-gray-900 w-80">
              Leading provider of end-to-end logistics solutions. We deliver
              excellence in shipping, customs clearance, and supply chain
              management across India and globally.
            </p>

            <div className="flex gap-4 pt-2">
              <Link
                href="https://www.facebook.com/bestcustombroker"
                target="_blank"
                className="h-10 w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/onslogistics486"
                target="_blank"
                className="h-10 w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/anil-verma-62691333"
                target="_blank"
                className="h-10 w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/OnsPvt"
                target="_blank"
                className="h-10 w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-base font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-all">
                  → Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-blue-600 transition-all">
                  → About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-all">
                  → Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-base font-semibold uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-4 text-sm">
              {services.map((service, idx) => (
                <li key={idx}>
                  <Link
                    href={service.href}
                    className="hover:text-blue-600 transition-all"
                  >
                    → {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-base font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 hover:text-blue-600 transition-all cursor-pointer">
                <Phone className="h-5 w-5 text-blue-600 " />
                <Link href="tel:18008907365">1800-890-7365</Link>
              </li>
              <li className="flex gap-3 hover:text-blue-600 transition-all cursor-pointer">
                <Mail className="h-5 w-5 text-blue-600" />
                <Link href="mailto:info@onslogistics.com">
                  info@onslogistics.com
                </Link>
              </li>
              <li className="hover:text-blue-600 transition-all cursor-pointer flex gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
               <Link  href="https://www.google.com/maps?sca_esv=8b6848c6fe0124b8&rlz=1C1CHBD_enIN1132IN1133&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFG9uc2xvZ2lzdGljcyBsdWhkaW5hMgYQABgeGA0yCxAAGIAEGIoFGIYDMgsQABiABBiKBRiGAzILEAAYgAQYigUYhgMyCBAAGIAEGKIEMggQABiABBiiBDIIEAAYgAQYogQyCBAAGIAEGKIEMggQABiJBRiiBEiALFCdBFj3KXACeAGQAQOYAcQIoAHVLKoBDzAuMy4yLjEuMi4xLjEuMrgBA8gBAPgBAZgCCqACvxbCAgoQABhHGNYEGLADwgINEAAYRxjWBBjJAxiwA8ICDhAAGIAEGIoFGJIDGLADwgINEAAYgAQYigUYQxiwA8ICDhAAGOQCGNYEGLAD2AEBwgITEC4YgAQYigUYQxjIAxiwA9gBAcICBBAAGB7CAgIQJsICBxAAGIAEGA3CAhAQLhgNGK8BGMcBGIAEGI4FwgIIEAAYCBgeGA3CAhAQLhiABBgNGMcBGK8BGI4FwgIGEAAYFhgemAMA4gMFEgExIECIBgGQBhG6BgYIARABGAmSBwsyLjMuMS4xLjIuMaAH01qyBwswLjMuMS4xLjIuMbgHkxbCBwkwLjEuNi4yLjHIB1iACAE&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KREglzUFnRo5McSbvqdJ73eS&daddr=24,+Aatma+Nagar,+Near+Radha+Soami+Satsang+Bhawan+Gate+No.7,+Chandigarh+Road,+Mundian+Kalan,+National+Highway+95,+Focal+Point,+Ludhiana,+Punjab+141003"> Ludhiana, Punjab, India</Link>
              </li>
              <li className="flex gap-3 hover:text-blue-600 transition-all">
                <Clock className="h-5 w-5 text-blue-600" />
                Mon - Sat: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>

        </div>
        </div>

        {/* Call to Action Bar */}
      <div className="bg-gray-300 py-6">
      <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-slate-900 font-semibold text-lg mb-1">
                  Ready to streamline your logistics?
                </h3>
                <p className="text-gray-600 text-sm">
                  Get a free quote or book a consultation today
                </p>
              </div>
              <div className="flex gap-4">
                <Link 
                  href="/request-quote"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Request Quote
                </Link>
                <Link 
                  href="/book-appointment"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-400 py-6">
        <p className="text-center text-sm text-slate-900">
          © {new Date().getFullYear()} ONS Logistics India Pvt. Ltd. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}