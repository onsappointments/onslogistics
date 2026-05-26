"use client";

import Link from "next/link";

import {
  MapPin,
  Globe2,
  ArrowRight,
  Ship,
  Plane,
  Truck,
} from "lucide-react";

const locations = [
  {
    city: "Ludhiana",
    slug: "ludhiana",
  },

  {
    city: "Mumbai",
    slug: "mumbai",
  },

  {
    city: "Delhi NCR",
    slug: "new-delhi",
  },

  {
    city: "Chennai",
    slug: "chennai" ,
  },

  {
    city: "Ahmedabad",
    slug: "ahmedabad" ,
  },

  {
    city: "Mundra",
    slug: "mundra",
  },
];

const services = [
  {
    title: "Freight Forwarding",
    icon: Ship,
    href: "/services/freight-forwarding",
  },

  {
    title: "Air Cargo",
    icon: Plane,
    href: "/services/air-freight",
  },

  {
    title: "Road Transportation",
    icon: Truck,
    href: "/services/road-transportation",
  },
];

export default function GeoPresenceSection({
    currentService,
   }) {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>

            {/* Badge */}
            <div className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-400/20
              bg-blue-500/10
              px-4
              py-2
              text-sm
              font-medium
              text-blue-300
              mb-6
              backdrop-blur-md
            ">

              <Globe2 className="w-4 h-4" />

              Regional Logistics Expertise

            </div>

            {/* Heading */}
            <h2 className="
              text-4xl
              md:text-5xl
              font-bold
              leading-tight
              text-white
              mb-6
            ">

              Logistics Services Across

              <span className="text-blue-400">
                {" "}
                Ludhiana, Punjab & India
              </span>

            </h2>

            {/* Description */}
            <p className="
              text-lg
              leading-relaxed
              text-slate-300
              mb-10
              max-w-2xl
            ">

              ONS Logistics supports exporters, importers,
              and manufacturers across Ludhiana, Punjab,
              North India, and major business hubs throughout
              India with freight forwarding, customs clearance,
              transportation, air cargo, and global shipping
              solutions.

            </p>

            {/* Service Chips */}
            <div className="flex flex-wrap gap-4">

              {services.map((service) => {

                const Icon = service.icon;

                return (

                  <Link
                    href={service.href}
                    key={service.title}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      px-5
                      py-4
                      backdrop-blur-md
                      hover:bg-white/10
                      hover:border-blue-400/20
                      transition-all
                      duration-300
                    "
                  >

                    {/* Icon */}
                    <div className="
                      flex
                      items-center
                      justify-center
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-500/10
                      text-blue-300
                    ">

                      <Icon className="w-5 h-5" />

                    </div>

                    {/* Text */}
                    <span className="font-medium text-white">

                      {service.title}

                    </span>

                  </Link>

                );

              })}

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="relative">

            {/* Main Glass Card */}
            <div className="
              rounded-[2rem]
              border
              border-white/10
              bg-white/5
              backdrop-blur-2xl
              p-8
              shadow-2xl
            ">

              {/* Grid */}
              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-5
              ">

                {locations.map((location) => (

                  <Link
                    href={
                      currentService
                        ? `/locations/${location.slug}/${currentService}`
                        : `/locations/${location.slug}/freight-forwarding`
                   }
                    key={location.city}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-gradient-to-br
                      from-white/5
                      to-white/[0.03]
                      p-5
                      hover:border-blue-400/30
                      hover:-translate-y-1
                      hover:bg-white/[0.06]
                      transition-all
                      duration-300
                    "
                  >

                    {/* Hover Glow */}
                    <div className="
                      absolute
                      inset-0
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      duration-300
                      bg-gradient-to-r
                      from-blue-500/10
                      to-cyan-500/10
                    " />

                    <div className="
                      relative
                      flex
                      items-center
                      gap-4
                    ">

                      {/* Icon */}
                      <div className="
                        flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-500/10
                        text-blue-300
                      ">

                        <MapPin className="w-5 h-5" />

                      </div>

                      {/* Text */}
                      <div>

                        <h3 className="
                          text-lg
                          font-semibold
                          text-white
                        ">

                          {location.city}

                        </h3>

                        <div className="
                          flex
                          items-center
                          gap-1
                          text-sm
                          text-slate-400
                          mt-1
                        ">

                          Logistics Network

                          <ArrowRight className="w-3 h-3" />

                        </div>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

              {/* Bottom Stats */}
              <div className="
                grid
                grid-cols-3
                gap-5
                mt-8
              ">

                <div className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  text-center
                ">

                  <div className="
                    text-3xl
                    font-bold
                    text-white
                    mb-1
                  ">

                    50+

                  </div>

                  <div className="
                    text-sm
                    text-slate-400
                  ">

                    Countries

                  </div>

                </div>

                <div className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  text-center
                ">

                  <div className="
                    text-3xl
                    font-bold
                    text-white
                    mb-1
                  ">

                    24/7

                  </div>

                  <div className="
                    text-sm
                    text-slate-400
                  ">

                    Support

                  </div>

                </div>

                <div className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  text-center
                ">

                  <div className="
                    text-3xl
                    font-bold
                    text-white
                    mb-1
                  ">

                    Pan

                  </div>

                  <div className="
                    text-sm
                    text-slate-400
                  ">

                    India Network

                  </div>

                </div>

              </div>

            </div>

            {/* Floating Glow */}
            <div className="
              absolute
              -top-10
              -right-10
              w-40
              h-40
              bg-blue-500/20
              blur-3xl
              rounded-full
            " />

          </div>

        </div>

      </div>

    </section>
  );
}