"use client";
import Image from "next/image";
import Hero from "../Components/Hero";
import { Truck, Globe, Shield, Clock, CheckCircle2, Award } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Multi-Modal Transport",
      description: "Sea, air, and road freight solutions"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Coverage across 50+ countries"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Customs Expertise",
      description: "Seamless clearance & compliance"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Real-time tracking & assistance"
    }
  ];

  const certifications = [
    { image: "/concor.png", text: "Concor's Empanelled CHA" },
    { image: "/crissCross.png", text: "Member" },
    { image: "/msme.png", text: "MSME Registered" },
    { image: "/dgos.png", text: "MTO Registration" },
  ];

  return (
    <main className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* HERO SECTION */}
      <Hero />

      {/* ABOUT SECTION */}
      <section className="relative px-6 py-20 lg:py-12" id="about">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Trusted Logistics Partner
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">ONS Logistics</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in global shipping, logistics, and customs clearance. 
              We deliver efficiency, reliability, and transparency across every shipment.
            </p>
          </div>

          {/* Hero Image with Stats Overlay */}
          <div className="relative mb-20">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="/About-us.webp" 
                alt="About ONS Logistics - Professional freight forwarding services" 
                width={1000}
                height={1000}
                className="aspect-video w-full h-[30rem] "
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/40 to-transparent"></div>
              
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="grid grid-cols-3 gap-6 md:gap-12">
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">15+</div>
                    <div className="text-sm md:text-base text-blue-100">Years in Business</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">5000+</div>
                    <div className="text-sm md:text-base text-blue-100">Shipments Delivered</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">99.8%</div>
                    <div className="text-sm md:text-base text-blue-100">On-Time Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content Cards */}
          <div className="space-y-12 p-10 bg-white rounded-3xl shadow-xl ">
            
            {/* Card 1 - Image Left */}
            <div className=" overflow-hidden ">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="/about-photo.jpg"
                    alt="Global logistics and freight forwarding operations by ONS Logistics"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-4">
                    <Globe className="w-4 h-4" />
                    Our Mission
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    We Move the World Forward
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    At ONS Logistics India Pvt. Ltd., every shipment reflects our commitment to
                    precision, trust, and seamless global movement. We understand
                    that in today's fast-paced trade environment, businesses rely on
                    logistics partners who can deliver reliability, transparency,
                    and speed across every stage of transportation.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our expertise spans international freight forwarding,
                    multimodal transportation, customs clearance, warehousing, and
                    supply chain optimization. With strong partnerships across
                    shipping lines, air carriers, and port authorities, we ensure
                    every shipment is handled with the highest standards of safety
                    and efficiency.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Image Right */}
            <div className="overflow-hidden ">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                  <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-4">
                    <Shield className="w-4 h-4" />
                    Our Commitment
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Tailored Solutions for Your Needs
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    From containerized shipments and industrial cargo to
                    time-critical deliveries and specialized freight, we tailor our
                    logistics solutions to your exact requirements.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Our advanced tracking systems provide real-time visibility,
                    while our dedicated operations team manages documentation,
                    compliance, customs guidance, and last-mile coordination with
                    unmatched accuracy.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    At ONS Logistics India Pvt. Ltd., we don't just move cargo — we move global trade
                    forward with reliability, expertise, and a promise of on-time
                    delivery across oceans, skies, roads, and borders.
                  </p>
                </div>
                <div className="relative h-64 md:h-auto order-1 md:order-2">
                  <Image
                    src="/about-photo2.jpg"
                    alt="International shipping containers and cranes handled by ONS Logistics"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Certifications & Partnerships */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Certifications & Partnerships
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Trusted & Certified
              </h3>
            </div>

            {/* Animated Logo Carousel */}
            <div className="relative overflow-hidden">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
              
              <div className="flex animate-loop">
                {[...certifications, ...certifications].map((cert, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[280px] mx-6 group"
                  >
                    <div className=" p-8 transition-all duration-300 flex flex-col items-center">
                      <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                        <Image
                          src={cert.image}
                          alt={cert.text}
                          width={200}
                          height={160}
                          className="object-contain  transition-all duration-300"
                        />
                      </div>
                      {cert.text && (
                        <p className="text-sm font-medium text-gray-700 text-center">
                          {cert.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Add the animation to your global CSS or tailwind.config.js */}
      <style jsx>{`
        @keyframes loop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-loop {
          animation: loop 30s linear infinite;
        }
        .animate-loop:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  );
}