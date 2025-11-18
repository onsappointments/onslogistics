import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F7] text-gray-700 py-6 border-t border-gray-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start px-6">
        
         {/* Left Section — Logo + Description */}
        <div className="flex flex-col items-start space-y-3 w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="ONS Logistics Logo" 
              className="w-12 h-12 object-contain" 
            />
            <h2 className="text-xl font-semibold">ONS Logistics</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your trusted partner in shipping, logistics, and custom clearance.
            We deliver efficiency and reliability worldwide.
          </p>
        </div>

        {/* Center Section - Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link></li>
            <li><Link href="/book-appointment" className="hover:text-blue-600 transition-colors">Book Appointment</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Right Section - Socials */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Connect with Us</h3>
          <div className="flex space-x-5">
            <Link href="https://www.facebook.com/bestcustombroker" target="_blank" aria-label="Facebook">
              <Facebook className="w-6 h-6 hover:text-blue-600 transition-colors" />
            </Link>
            <Link href="https://www.instagram.com/onslog500/" target="_blank" aria-label="Instagram">
              <Instagram className="w-6 h-6 hover:text-pink-500 transition-colors" />
            </Link>
            <Link href="https://www.linkedin.com/in/anil-verma-62691333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6 hover:text-blue-700 transition-colors" />
            </Link>
            <Link href="https://x.com/OnsPvt" target="_blank" aria-label="Twitter">
              <Twitter className="w-6 h-6 hover:text-sky-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ONS Logistics India Pvt. Ltd. | All Rights Reserved
      </div>
    </footer>
  );
}
