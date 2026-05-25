"use client";
import Image from "next/image";
import { Plane, Ship, Truck, FileText, Globe, Briefcase, Package, ArrowRight, CheckCircle2, MapPin,Building2 } from "lucide-react";
import Link from "next/link";

const services = [
  { 
    slug: "freight-forwarding" ,
    name: "Freight Forwarding", 
    icon: Ship,
    description:  "International freight forwarding services including air freight, sea freight, cargo coordination, and global shipping support.",
    highlights: ["Air & Sea Freight", "Global Cargo", "Export Support"],
  },
  { 
    slug: "road-transportation",
    name: "Road Transportation", 
    icon: Truck,
    description: "Reliable domestic and cross-border transportation solutions for manufacturers, exporters, and businesses.",
     highlights: ["Pan India", "Safe Delivery", "Fast Transit"],
  },
  { 
    slug: "sea-freight", 
    name: "Sea Freight", 
    icon: Globe,
    description:
      "FCL and LCL sea cargo services with efficient international shipping and port coordination.",
    highlights: ["FCL & LCL", "Global Ports", "Container Shipping"],
  },
  { 
    slug: "air-freight",
    name: "Air Cargo",
    icon: Plane,
    description:
      "Fast and secure air cargo services for urgent international shipments and high-value goods.",
    highlights: ["Fast Shipping", "Global Air Cargo", "Express Handling"],
  },
  { 
    slug: "licensing", 
    name: "Licensing", 
    icon: FileText,
    description:
      "Import-export licensing support and documentation guidance for Indian businesses.",
    highlights: ["IEC Support", "Documentation", "Compliance"],
  },
  { 
    slug: "import-export-consultation", 
    name: "Export / Import Consultation", 
    icon: Briefcase,
    description:
      "Expert consultation for exporters and importers including shipping strategy and logistics planning.",
    highlights: ["Export Guidance", "Shipping Strategy", "Trade Support"],
  },
  { 
    slug: "customs-clearance", 
    name: "Custom Clearance", 
    icon: Package,
    description:
      "Smooth customs clearance services with documentation handling and shipment coordination.",
    highlights: ["Import Clearance", "Export Clearance", "Documentation"],
  },
];

const industries = [
  "Textile Exporters",
  "Bicycle Parts Manufacturers",
  "Industrial Machinery",
  "Consumer Goods",
  "Electronics",
  "Automotive Components",
];

export default function ServiceHero() {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br  from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px]">
        {/* Background Image */}
        <Image
          rel="preload"
          src="/services-bg.jpg"
          alt="ONS Logistics Services"
          fill
          className="object-cover"
          priority
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-blue-800/30"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Comprehensive Logistics Solutions
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Our <span className="text-blue-300">Services</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-3xl mx-auto leading-relaxed">
              From freight forwarding to customs clearance, we provide end-to-end logistics solutions tailored to your business needs.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">7+</div>
                <div className="text-sm text-blue-100">Core Services</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-sm text-blue-100">Countries Covered</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-blue-100">Customer Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 -mt-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our <span className="text-blue-600">Capabilities</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any service to learn more about how we can help your business
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map(({ slug, name, icon: Icon, description , highlights }) => (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Icon className="w-8 h-8" />
              </div>

              {/* Service Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">
                {description}
              </p>

              {/* Highlights */}
                <div className="relative z-10 flex flex-wrap gap-2 mb-6">
                  {highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>

              {/* Learn More Link */}
              <div className="flex items-center gap-2 text-sm md:opacity-100 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>


        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Our team can create a tailored logistics package that combines multiple services to meet your unique business requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <a
                href="/request-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-600 px-6 py-3 font-semibold hover:bg-blue-50 transition-all"
              >
                Request Quote
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 text-white px-6 py-3 font-semibold hover:bg-blue-900 transition-all"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}