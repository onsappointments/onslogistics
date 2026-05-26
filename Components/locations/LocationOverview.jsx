// Components/locations/LocationOverview.jsx

import {
  Globe,
  CheckCircle2,
} from "lucide-react";

import LocationFeatureCards from "./LocationFeatureCards";

export default function LocationOverview({ data }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>

          {/* TAG */}
          <div className="inline-flex items-center gap-2 text-blue-600 mb-4">

            <Globe className="w-5 h-5" />

            Logistics Expertise

          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-8">

            {data.heading}

          </h2>

          {/* CONTENT */}
          <div className="space-y-6">

            {data.content.map((paragraph, index) => (

              <p
                key={index}
                className="text-lg leading-relaxed text-slate-600"
              >
                {paragraph}
              </p>

            ))}

          </div>

          {/* BENEFITS */}
          <div className="space-y-4 mt-10">

            {data.benefits.map((item) => (

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
        <LocationFeatureCards features={data.features} />

      </div>

    </section>
  );
}