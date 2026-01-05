"use client";

import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-between gap-10 ">
          {/* Company Info */}
          <div className="flex flex-col space-y-6 justify-between md:col-span-8 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ONS Logistics Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain brightness-0 invert"
              />
              <h2 className="text-xl font-bold text-white">
                ONS Logistics
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-900 whitespace-normal word-break w-80">
              Leading provider of end-to-end logistics solutions. We deliver excellence in shipping, customs clearance, and supply chain management across India and globally.
            </p>
            <div className="flex gap-4 pt-2">
              <Link 
                href="https://www.facebook.com/bestcustombroker" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-white border border-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white  transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.instagram.com/onslogistics486" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-white border border-slate-900 flex items-center justify-center hover:bg-gradient-to-br hover:text-white hover:from-purple-600 hover:to-pink-500 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/anil-verma-62691333" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-white flex border border-slate-900 items-center justify-center hover:bg-blue-700 hover:text-white  transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link 
                href="https://x.com/OnsPvt" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-white border border-slate-900 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="mb-6 text-base font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-8 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Our Services", href: "/services" },
                { name: "About Us", href: "#about" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center items-center">
            <h3 className="mb-6 text-base font-semibold text-blue-600 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-600 font-medium mb-1">Toll Free</p>
                  <Link href="tel:18008907365" className="hover:text-blue-600 transition-colors">
                    1800-890-7365
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-600 font-medium mb-1">Email</p>
                  <Link href="mailto:info@onslogistics.com" className="hover:text-blue-600 transition-colors">
                    info@onslogistics.com
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-600 font-medium mb-1">Location</p>
                  <p className="text-gray-900">Ludhiana, Punjab, India</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-600 font-medium mb-1">Business Hours</p>
                  <p className="text-gray-900">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* CTA Strip */}
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
      <div className="border-t border-gray-400 bg-gray-400 py-6 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-900">
            <p>
              © {new Date().getFullYear()} ONS Logistics India Pvt. Ltd. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-slate-300 transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/sitemap" className="hover:text-slate-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}