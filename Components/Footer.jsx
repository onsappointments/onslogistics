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
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .fade-in-delay-1 {
          animation: fadeIn 0.6s ease-out 0.1s backwards;
        }

        .fade-in-delay-2 {
          animation: fadeIn 0.6s ease-out 0.2s backwards;
        }

        .fade-in-delay-3 {
          animation: fadeIn 0.6s ease-out 0.3s backwards;
        }

        .slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }

        .slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }
      `}</style>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Company Info */}
          <div className="flex flex-col space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1 fade-in">
            <div className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Image src={"/logo.png"} alt="logo" width={70} height={70} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                ONS
              </h2>
            </div>

            <p className="text-sm sm:text-md leading-relaxed text-gray-900 max-w-md lg:max-w-xs transition-all duration-300 hover:text-gray-700">
              Leading provider of end-to-end logistics solutions. We deliver
              excellence in shipping, customs clearance, and supply chain
              management across India and globally.
            </p>

            <div className="flex gap-3 sm:gap-4 pt-2">
              <a
                href="https://www.facebook.com/bestcustombroker"
                target="_blank"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://www.instagram.com/onslogistics486"
                target="_blank"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/anil-verma-62691333"
                target="_blank"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://x.com/OnsPvt"
                target="_blank"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-900 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col fade-in-delay-1">
            <h3 className="mb-4 sm:mb-6 text-sm sm:text-base font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-blue-600">
              Quick Links
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <a href="/" className="hover:text-blue-600 transition-all duration-300 inline-block">
                  → Home
                </a>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <a href="/#about" className="hover:text-blue-600 transition-all duration-300 inline-block">
                  → About Us
                </a>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <a href="/contact" className="hover:text-blue-600 transition-all duration-300 inline-block">
                  → Contact Us
                </a>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <a href="/tracking" className="hover:text-blue-600 transition-all duration-300 inline-block">
                  → Track Your Shipment 
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="flex flex-col fade-in-delay-2">
            <a href="/services" className="mb-4 sm:mb-6 text-sm sm:text-base font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-blue-600">
              Services
            </a>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              {services.map((service, idx) => (
                <li key={idx} className="transform transition-all duration-300 hover:translate-x-2">
                  <a
                    href={service.href}
                    className="hover:text-blue-600 transition-all duration-300 inline-block"
                  >
                    → {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col fade-in-delay-3">
            <h3 className="mb-4 sm:mb-6 text-sm sm:text-base font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-blue-600">
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li className="flex gap-2 sm:gap-3 group transition-all duration-300 hover:translate-x-1">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <a href="tel:18008907365" className="break-words hover:text-blue-600 transition-colors duration-300">1800-890-7365</a>
              </li>
              <li className="flex gap-2 sm:gap-3 group transition-all duration-300 hover:translate-x-1">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <a href="mailto:info@onslogistics.com" className="break-words hover:text-blue-600 transition-colors duration-300">
                  info@onslogistics.com
                </a>
              </li>
              <li className="flex gap-2 sm:gap-3 group transition-all duration-300 hover:translate-x-1">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
                <a 
                  href="https://maps.google.com"
                  target="_blank"
                  className="break-words hover:text-blue-600 transition-colors duration-300"
                >
                  Ludhiana, Punjab, India
                </a>
              </li>
              <li className="flex gap-2 sm:gap-3 group transition-all duration-300 hover:translate-x-1">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                <span className="break-words hover:text-blue-600 transition-colors duration-300">Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="bg-gray-300 py-6 sm:py-8 transition-all duration-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left slide-in-left">
              <h3 className="text-slate-900 font-semibold text-base sm:text-lg mb-1 transition-colors duration-300 hover:text-blue-600">
                Ready to streamline your logistics?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm transition-colors duration-300 hover:text-gray-800">
                Get a free quote or book a consultation today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto slide-in-right">
              <a 
                href="/request-quote"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm sm:text-base transform hover:-translate-y-1 hover:scale-105"
              >
                Request Quote
              </a>
              <a 
                href="/book-appointment"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm sm:text-base transform hover:-translate-y-1 hover:scale-105"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-400 py-4 sm:py-6 transition-all duration-300">
        <p className="text-center text-xs sm:text-sm text-slate-900 px-4 transition-all duration-300 hover:text-blue-600">
          © {new Date().getFullYear()} ONS Logistics India Pvt. Ltd. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}