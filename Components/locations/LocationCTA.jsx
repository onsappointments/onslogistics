// Components/locations/LocationCTA.jsx

import Link from "next/link";

import {
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export default function LocationCTA({ data }) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 overflow-hidden">

      <div className="
        relative
        rounded-[2.5rem]
        bg-gradient-to-r
        from-blue-600
        via-blue-700
        to-slate-900
        p-10
        md:p-16
        text-white
        shadow-2xl
        overflow-hidden
      ">

        {/* GLOW */}
        <div className="
          absolute
          top-0
          right-0
          w-[500px]
          h-[500px]
          bg-white/10
          rounded-full
          blur-3xl
        " />

        {/* SECONDARY GLOW */}
        <div className="
          absolute
          bottom-0
          left-0
          w-[350px]
          h-[350px]
          bg-blue-400/20
          rounded-full
          blur-3xl
        " />

        {/* CONTENT */}
        <div className="
          relative
          z-10
          grid
          lg:grid-cols-2
          gap-14
          items-center
        ">

          {/* LEFT */}
          <div>

            {/* TAG */}
            <div className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-white/10
              backdrop-blur-md
              px-5
              py-2
              mb-6
            ">

              <PhoneCall className="w-4 h-4 text-blue-200" />

              <span className="text-sm font-medium text-white">

                Logistics Consultation

              </span>

            </div>

            {/* TITLE */}
            <h2 className="
              text-4xl
              md:text-5xl
              font-bold
              leading-tight
              tracking-tight
              mb-6
            ">

              Need Logistics Support in {data.city}?

            </h2>

            {/* DESCRIPTION */}
            <p className="
              text-lg
              md:text-xl
              text-blue-100
              leading-relaxed
              max-w-2xl
            ">

              Talk to ONS Logistics for freight forwarding,
              customs clearance, cargo coordination,
              international shipping support, and logistics
              consultation services across {data.city} and India.

            </p>

          </div>


          {/* RIGHT */}
          <div className="
            flex
            flex-col
            sm:flex-row
            gap-5
            lg:justify-end
          ">

            {/* PRIMARY CTA */}
            <Link
              href="/request-quote"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-white
                text-blue-700
                px-8
                py-5
                font-semibold
                text-lg
                hover:bg-blue-50
                transition-all
                duration-300
                shadow-xl
              "
            >

              Request Freight Quote

              <ArrowRight className="w-5 h-5" />

            </Link>

            {/* SECONDARY CTA */}
            <Link
              href="/book-appointment"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-white/20
                bg-white/10
                backdrop-blur-md
                text-white
                px-8
                py-5
                font-semibold
                text-lg
                hover:bg-white/20
                transition-all
                duration-300
              "
            >

              Book Consultation

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}