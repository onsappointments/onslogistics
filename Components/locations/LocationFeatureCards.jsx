import {
  Globe,
  Ship,
  Plane,
  ShieldCheck,
  Clock3,
  Truck,
  FileCheck,
  Briefcase,
} from "lucide-react";

const iconMap = {
  Globe,
  Ship,
  Plane,
  ShieldCheck,
  Clock3,
  Truck,
  FileCheck,
  Briefcase,
};

export default function LocationFeatureCards({ features }) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      {features.map((feature) => {

        const Icon = iconMap[feature.icon];

        return (

          <div
            key={feature.title}
            className="
              group
              rounded-3xl
              bg-white
              border
              border-slate-200
              p-8
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            {/* ICON */}
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                mb-6
                group-hover:scale-110
                transition-transform
                duration-300
              "
            >

              {Icon && <Icon className="w-7 h-7" />}

            </div>

            {/* TITLE */}
            <h3 className="text-xl font-semibold text-slate-900 mb-3">

              {feature.title}

            </h3>

            {/* DESCRIPTION */}
            <p className="text-slate-600 leading-relaxed">

              {feature.description}

            </p>

          </div>

        );

      })}

    </div>
  );
}