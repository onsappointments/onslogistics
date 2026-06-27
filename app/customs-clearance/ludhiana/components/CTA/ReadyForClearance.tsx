import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Globe2,
  Package,
  ShipWheel,
} from "lucide-react";

export default function ReadyForClearance() {
  const checklist = [
    {
      icon: Package,
      title: "Import or Export",
      description:
        "Know whether your shipment is inbound or outbound.",
    },
    {
      icon: Globe2,
      title: "Origin & Destination",
      description:
        "Country of dispatch and country of delivery.",
    },
    {
      icon: FileText,
      title: "Commercial Documents",
      description:
        "Commercial Invoice and Packing List, if available.",
    },
    {
      icon: ShipWheel,
      title: "Shipment Details",
      description:
        "Mode of transport, cargo type and expected shipment date.",
    },
  ];

  const enquiries = [
    "Import Customs Clearance",
    "Export Customs Clearance",
    "Bill of Entry",
    "Shipping Bill",
    "ICEGATE Guidance",
    "HS Code Assistance",
    "Documentation Review",
    "Freight Coordination",
  ];

  return (
    <section className="rounded-[40px] border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 p-8 lg:p-14">

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          <ClipboardList className="h-4 w-4" />
          Before You Request a Quote
        </div>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
          Ready for customs clearance?
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          You don't need every document to start a conversation.
          However, having the information below can help us understand
          your shipment and provide more relevant guidance.
        </p>

      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-14">

        <div className="space-y-5">

          {checklist.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Icon className="h-6 w-6 text-blue-700" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        <div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">

            <h3 className="text-2xl font-bold text-slate-900">
              Don't have every document yet?
            </h3>

            <p className="mt-5 leading-8 text-slate-700">
              That's completely normal. Many businesses contact a customs
              broker while they are still preparing documentation or planning
              a shipment. We can help explain the typical requirements and
              identify what information may be needed based on your shipment.
            </p>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            {enquiries.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}

          </div>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Request a Customs Clearance Quote

              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700"
            >
              Talk to a Customs Expert
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}