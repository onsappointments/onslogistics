"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-[#F5F5F7] text-gray-700">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">

          {/* Left */}
          <div className="flex max-w-sm flex-col space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="ONS Logistics Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                ONS Logistics
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              Your trusted partner in shipping, logistics, and custom clearance.
              We deliver efficiency and reliability worldwide.
            </p>
          </div>

          {/* Center */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/services" className="hover:text-blue-600">Services</Link></li>
              <li><Link href="/book-appointment" className="hover:text-blue-600">Book Appointment</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
            </ul>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Connect with Us
            </h3>
            <div className="flex gap-5">
              <Link href="https://www.facebook.com/bestcustombroker" target="_blank">
                <Facebook className="h-6 w-6 hover:text-blue-600" />
              </Link>
              <Link href="https://www.instagram.com/onslogistics486" target="_blank">
                <Instagram className="h-6 w-6 hover:text-pink-500" />
              </Link>
              <Link href="https://www.linkedin.com/in/anil-verma-62691333" target="_blank">
                <Linkedin className="h-6 w-6 hover:text-blue-700" />
              </Link>
              <Link href="https://x.com/OnsPvt" target="_blank">
                <Twitter className="h-6 w-6 hover:text-sky-500" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ONS Logistics India Pvt. Ltd. | All Rights Reserved
      </div>
    </footer>
  );
}
