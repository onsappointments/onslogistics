"use client";

import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="bg-[#F5F5F7]">
      {/* Image Section */}
      <div className="relative w-full">
        <a
          href="#contact-form"
          className="absolute z-20 text-2xl text-white bottom-5 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          Contact Us
        </a>

        <div className="absolute inset-0 bg-black/40 z-10 flex items-start justify-center">
          <h1 className="text-white font-bold text-4xl md:text-5xl tracking-wide ml-8 mt-20">
            Get In Touch
          </h1>
        </div>

        <Image
          src="/contactUs.jpg"
          alt="Contact Us"
          width={1920}
          height={500}
          className="w-full h-[300px] md:h-[400px] object-cover"
          priority
        />
      </div>

      {/* Contact Details */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
          Contact Details
        </h2>

        {/* Address */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          📍 <strong>Head Office:</strong> #24, Aatma Nagar, Near Radha Swami
          Satsang Bhawan Gate No.7, Mundian Kalan, Chandigarh Road,
          Ludhiana-140015
        </p>

        {/* Phone Numbers */}
        <div className="text-gray-700 mb-4">
          ☎️ <strong>Phone:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>
              <a
                href="tel:+919988887971"
                className="text-blue-600 hover:underline"
              >
                +91-99888-87971
              </a>
            </li>
            <li>
              <a
                href="tel:+919988886501"
                className="text-blue-600 hover:underline"
              >
                +91-99888-86501
              </a>
            </li>
            <li>
              <a
                href="tel:+919988886500"
                className="text-blue-600 hover:underline"
              >
                +91-99888-86500
              </a>
            </li>
            <li>
              <a
                href="tel:+919988813766"
                className="text-blue-600 hover:underline"
              >
                +91-99888-13766
              </a>
            </li>
          </ul>
        </div>

        {/* Emails */}
        <div className="text-gray-700 mb-4">
          📧 <strong>Email:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>
              <a
                href="mailto:info@onslog.com"
                className="text-blue-600 hover:underline"
              >
                info@onslog.com
              </a>
            </li>
            <li>
              <a
                href="mailto:exim@onslogistics.org"
                className="text-blue-600 hover:underline"
              >
                exim@onslogistics.org
              </a>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <p className="text-gray-700">
          🕒 <strong>Working Hours:</strong> Mon – Sat: 9:00 AM – 6:00 PM
        </p>
      </div>
    </section>
  );
}
