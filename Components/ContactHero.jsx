"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { a } from "framer-motion/client";

export default function ContactHero() {
  const phoneNumbers = [
    { text: "+91-99888-87971", href: "tel:+919988887971" },
    { text: "+91-99888-86501", href: "tel:+919988886501" },
    { text: "+91-99888-86500", href: "tel:+919988886500" },
    { text: "+91-99888-13766", href: "tel:+919988813766" },
  ];

  const emails = [
    { text: "info@onslog.com", href: "mailto:info@onslog.com" },
    { text: "exim@onslogistics.org", href: "mailto:exim@onslogistics.org" },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Image Section */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <Image
          rel="preload"
          src="/contactUs.jpg"
          alt="Contact ONS Logistics"
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-900/30 to-blue-900/20"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                We're Here to Help
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Let's discuss your logistics needs
              </p>

              
                <a href="/contact#contact-form"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1"
              >
                Contact Us Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div id="contact-details" className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact <span className="text-blue-600">Information</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reach out to us through any of the following channels
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Address Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Head Office
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  #24, Aatma Nagar, Near Radha Swami Satsang Bhawan Gate No.7<br />
                  Mundian Kalan, Chandigarh Road<br />
                  Ludhiana-140015, Punjab, India
                </p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Phone Numbers
                </h3>
                <div className="space-y-2">
                  {phoneNumbers.map((phone, idx) => (
                    <a
                      key={idx}
                      href={phone.href}
                      className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {phone.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Email Addresses
                </h3>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <a
                      key={idx}
                      href={email.href}
                      className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {email.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Working Hours
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p><strong className="text-gray-900">Monday – Saturday:</strong></p>
                  <p>9:00 AM – 6:00 PM</p>
                  <p className="pt-2"><strong className="text-gray-900">Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Contact Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-blue-100 leading-relaxed">
                Our customer support team is available during business hours to answer your questions and provide expert guidance on your shipping and logistics needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <a
                href="tel:18008907365"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-600 px-6 py-3 font-semibold hover:bg-blue-50 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Toll Free
              </a>
              <a
                href="mailto:info@onslog.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 text-white px-6 py-3 font-semibold hover:bg-blue-900 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Visit Our <span className="text-blue-600">Office</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Located in Ludhiana, Punjab, we're easily accessible for in-person consultations
          </p>
        </div>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <div className="w-full h-[400px] md:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3423.234567890!2d75.8572!3d30.9010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDU0JzAzLjYiTiA3NcKwNTEnMjUuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ONS Logistics Office Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}