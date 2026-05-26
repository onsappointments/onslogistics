// Components/locations/LocationProcess.jsx

import {
  ArrowRight,
} from "lucide-react";

export default function LocationProcess({ data }) {
  return (
    <section className="relative py-28 overflow-hidden">

      {/* BACKGROUND */}
      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_45%)]
      " />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">

          <div className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-100
            bg-blue-50
            px-4
            py-2
            text-sm
            font-medium
            text-blue-700
            mb-5
          ">

            <div className="w-2 h-2 rounded-full bg-blue-600" />

            Logistics Workflow

          </div>

          <h2 className="
            text-5xl
            md:text-6xl
            font-bold
            tracking-tight
            text-slate-950
            leading-tight
          ">

            Our Logistics Process

          </h2>

          <p className="
            mt-6
            text-lg
            text-slate-600
            leading-relaxed
          ">

            Structured freight coordination and shipment execution
            designed for efficient cargo movement and international
            logistics support.

          </p>

        </div>


        {/* PROCESS ROW */}
        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-5
          gap-5
        ">

          {data.process.map((step, index) => (

            <div
              key={step.title}
              className="relative"
            >

              {/* CARD */}
              <div className="
                group
                relative
                h-full
                rounded-[2rem]
                border
                border-white/60
                bg-white/80
                backdrop-blur-xl
                p-7
                shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)]
                hover:-translate-y-1
                transition-all
                duration-500
                overflow-hidden
              ">

                {/* TOP BORDER */}
                <div className="
                  absolute
                  inset-x-0
                  top-0
                  h-[3px]
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-400
                " />

                {/* STEP NUMBER */}
                <div className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-base
                  shadow-lg
                  mb-6
                ">

                  {String(index + 1).padStart(2, "0")}

                </div>

                {/* TITLE */}
                <h3 className="
                  text-2xl
                  font-bold
                  text-slate-900
                  leading-tight
                  mb-4
                ">

                  {step.title}

                </h3>

                {/* DESCRIPTION */}
                <p className="
                  text-[17px]
                  text-slate-600
                  leading-relaxed
                ">

                  {step.description}

                </p>

              </div>

              {/* CONNECTOR */}
              {index !== data.process.length - 1 && (

                <div className="
                  hidden
                  xl:flex
                  absolute
                  top-1/2
                  -right-3
                  -translate-y-1/2
                  z-20
                  w-7
                  h-7
                  rounded-full
                  bg-white
                  border
                  border-slate-200
                  items-center
                  justify-center
                  shadow-md
                ">

                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}