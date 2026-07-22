import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  "MOOWR Assessment",
  "AEO Certification",
  "EPCG Guidance",
  "Duty Saving Strategy",
  "Customs Compliance",
  "Implementation Support",
];

export default function ConsultationCard() {
  return (
    <div className="sticky top-28 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
      <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
        Customs Experts
      </span>

      <h3 className="mt-5 text-3xl font-bold">
        Need Help Choosing the Right Scheme?
      </h3>

      <p className="mt-5 leading-7 text-blue-100">
        Every business has different import
        volumes, manufacturing operations and
        compliance requirements. Our experts
        help identify the most suitable scheme
        for your business.
      </p>

      <div className="mt-8 space-y-4">
        {services.map((service) => (
          <div
            key={service}
            className="flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />

            <span>{service}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-3">
        <Link
          href="/contact"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Schedule Consultation

          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/request-quote"
          className="flex w-full items-center justify-center rounded-xl border border-white/30 px-6 py-4 font-semibold transition hover:bg-white/10"
        >
          Request Callback
        </Link>
      </div>
    </div>
  );
}