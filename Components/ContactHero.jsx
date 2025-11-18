"use client";
import Image from "next/image";

export default function ContactHero() {
  const handleScroll = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex flex-col md:flex-row justify-between items-center bg-[#F5F5F7] px-8 md:px-16 py-24 gap-12">
      {/* Left: Hero Image with Button */}
      <div className="relative w-full md:w-1/2 h-[360px] rounded-3xl overflow-hidden shadow-xl">
        <Image
          src="/contact-bg.jpg"
          alt="Contact ONS Logistics"
          fill
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 font-['SF Pro Display']">
            Get in Touch
          </h1>
          <button
            onClick={handleScroll}
            className="px-8 py-3 bg-white text-[#1d1d1f] rounded-full hover:bg-gray-200 transition font-medium text-lg"
          >
            Send a Message
          </button>
        </div>
      </div>

      {/* Right: Contact Details */}
      <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">Contact Details</h2>
        <p className="text-gray-700 mb-3">
          📍 <strong>Head Office:</strong> # 24, Aatma Nagar, Near Radha Swami Satsang Bhawan Gate No.7, Mundian Kalan, Chandigarh Road, Ludhiana-140015
        </p>
        <p className="text-gray-700 mb-3">
          ☎️ <strong>Phone:</strong> +91-99888-87971 ,+91-99888-86501 ,+91-99888-86500 ,+91-99888-13766
        </p>
        <p className="text-gray-700 mb-3">
          📧 <strong>Email:</strong> info@onslogistics.com , exim@onslogistics.org
        </p>
        <p className="text-gray-700">
          🕒 <strong>Working Hours:</strong> Mon – Sat: 9:00 AM – 6:00 PM
        </p>
      </div>
    </section>
  );
}
