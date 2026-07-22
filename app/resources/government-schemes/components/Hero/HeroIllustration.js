import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Landmark,
} from "lucide-react";

const badgeStyles = {
  green:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",

  blue:
    "bg-blue-50 text-blue-700 border border-blue-200",

  orange:
    "bg-orange-50 text-orange-700 border border-orange-200",

  purple:
    "bg-violet-50 text-violet-700 border border-violet-200",
};

const icons = {
  0: Landmark,
  1: ShieldCheck,
  2: Building2,
  3: CheckCircle2,
};

export default function HeroIllustration({ cards = [] }) {
  return (
    <div className="relative hidden lg:flex items-center justify-center">
      {/* Background Glow */}

      <div className="absolute inset-0 rounded-full bg-blue-50 blur-3xl opacity-70" />

      {/* Decorative Rings */}

      <div className="absolute h-[520px] w-[520px] rounded-full border border-blue-100" />

      <div className="absolute h-[420px] w-[420px] rounded-full border border-blue-100/70" />

      <div className="grid grid-cols-2 gap-6 relative z-10">
        {cards.map((card, index) => {
          const Icon = icons[index] || Landmark;

          return (
            <Link
              key={card.id}
              href={card.href}
              className="
                group
                relative
                flex
                min-h-[220px]
                flex-col
                justify-between
                overflow-hidden
                rounded-3xl
                border
                border-gray-200
                bg-white/95
                p-6
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-200
                hover:shadow-2xl
                backdrop-blur
              "
            >
              {/* Gradient */}

              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-100 blur-3xl opacity-40 transition group-hover:opacity-70" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      badgeStyles[card.badgeColor]
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>

                <p className="mt-6 text-2xl font-bold leading-tight text-gray-900">
                  {card.headline}
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {card.supportingText}
                </p>
              </div>

              <div className="relative flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="text-sm font-medium text-gray-500">
                  {card.footer}
                </span>

                <ArrowUpRight className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}