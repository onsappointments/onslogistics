// Components/locations/LocationLocalContext.jsx

import {
  MapPin,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function LocationLocalContext({ data }) {
  return (
    <section className="bg-white py-24 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            {/* TAG */}
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">

              <MapPin className="w-5 h-5" />

              Regional Logistics Ecosystem

            </div>

            {/* HEADING */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-8">

              {data.localHeading}

            </h2>

            {/* CONTENT */}
            <div className="space-y-6">

              {data.localContent.map((paragraph, index) => (

                <p
                  key={index}
                  className="text-lg leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>

              ))}

            </div>

            {/* LOCAL BENEFITS */}
            <div className="space-y-4 mt-10">

              {data.localBenefits?.map((item) => (

                <div
                  key={item}
                  className="flex items-start gap-3"
                >

                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />

                  <p className="text-slate-700 leading-relaxed">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* RIGHT */}
          <div className="relative">

            {/* GLOW */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />

            {/* CARD */}
            <div className="
              relative
              rounded-[2rem]
              bg-gradient-to-br
              from-slate-950
              to-blue-950
              p-10
              md:p-12
              overflow-hidden
              border
              border-white/10
            ">

              {/* INNER GLOW */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative z-10">

                {/* TITLE */}
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-10">

                  Key Industries in {data.city}

                </h3>

                {/* INDUSTRIES */}
                <div className="space-y-4">

                  {data.industries.map((industry) => (

                    <div
                      key={industry}
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-md
                        p-5
                        hover:bg-white/10
                        transition-all
                        duration-300
                      "
                    >

                      {/* ICON */}
                      <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-500/20
                        text-blue-300
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">

                        <Building2 className="w-6 h-6" />

                      </div>

                      {/* TEXT */}
                      <div>

                        <p className="text-lg font-semibold text-white">

                          {industry}

                        </p>

                        <p className="text-sm text-slate-300 mt-1">

                          Logistics & export support solutions

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}