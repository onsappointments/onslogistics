import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Factory,
  FileText,
  Package,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { IndustryItem } from "./types";

interface Props {
  industry: IndustryItem;
  reverse?: boolean;
}

export default function IndustryCard({
  industry,
  reverse = false,
}: Props) {
  return (
    <article className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">

      <div
        className={`grid gap-0 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* LEFT CONTENT */}

        <div className="p-8 lg:p-12">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Factory className="h-4 w-4" />
            Industry Expertise
          </div>

          <h3 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {industry.title}
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            {industry.overview}
          </p>

          {/* Imports */}

          <div className="mt-10">

            <div className="flex items-center gap-2">

              <Boxes className="h-5 w-5 text-blue-600" />

              <h4 className="font-semibold text-slate-900">
                Common Imports
              </h4>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {industry.commonImports.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}

            </div>

          </div>

          {/* Exports */}

          <div className="mt-10">

            <div className="flex items-center gap-2">

              <Package className="h-5 w-5 text-blue-600" />

              <h4 className="font-semibold text-slate-900">
                Common Exports
              </h4>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {industry.commonExports.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <aside className="border-t border-slate-200 bg-slate-50 lg:border-l lg:border-t-0">

          <div className="space-y-8 p-8 lg:p-12">

            {/* Documents */}

            <section>

              <div className="flex items-center gap-2">

                <FileText className="h-5 w-5 text-blue-600" />

                <h4 className="font-semibold text-slate-900">
                  Key Documents
                </h4>

              </div>

              <ul className="mt-5 space-y-3">

                {industry.keyDocuments.map((doc) => (
                  <li
                    key={doc}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {doc}
                  </li>
                ))}

              </ul>

            </section>

            {/* Challenges */}

            <section>

              <div className="flex items-center gap-2">

                <ShieldAlert className="h-5 w-5 text-amber-600" />

                <h4 className="font-semibold text-slate-900">
                  Common Challenges
                </h4>

              </div>

              <ul className="mt-5 space-y-3">

                {industry.commonChallenges.map((challenge) => (
                  <li
                    key={challenge}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {challenge}
                  </li>
                ))}

              </ul>

            </section>

            {/* ONS Support */}

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

              <div className="flex items-center gap-2">

                <ShieldCheck className="h-5 w-5 text-blue-700" />

                <h4 className="font-semibold text-blue-900">
                  How ONS Logistics Supports This Industry
                </h4>

              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                {industry.onsSupport}
              </p>

            </section>

            {/* Related Guides */}

            <section>

              <h4 className="font-semibold text-slate-900">
                Related Guides
              </h4>

              <div className="mt-4 space-y-3">

                {industry.relatedGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition-all hover:border-blue-300"
                  >
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">
                      {guide.title}
                    </span>

                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                  </Link>
                ))}

              </div>

            </section>

          </div>

        </aside>

      </div>

    </article>
  );
}