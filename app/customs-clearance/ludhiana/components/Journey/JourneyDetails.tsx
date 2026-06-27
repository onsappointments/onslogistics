import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { JourneyStep } from "./types";

interface JourneyDetailsProps {
  step: JourneyStep;
}

export default function JourneyDetails({
  step,
}: JourneyDetailsProps) {
  return (
    <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <header className="border-b border-slate-200 px-8 py-8 lg:px-12">

        <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Step {step.stepNumber}
        </div>

        <h3 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
          {step.title}
        </h3>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {step.detailedDescription}
        </p>

      </header>

      {/* Insight Cards */}

      <section className="grid gap-6 border-b border-slate-200 p-8 lg:grid-cols-3 lg:p-12">

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <div className="flex items-center gap-2">

            <CheckCircle2 className="h-5 w-5 text-blue-700" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Quick Answer
            </span>

          </div>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            {step.quickAnswer}
          </p>

        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

          <div className="flex items-center gap-2">

            <Lightbulb className="h-5 w-5 text-emerald-700" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Expert Tip
            </span>

          </div>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            {step.expertTip}
          </p>

        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">

          <div className="flex items-center gap-2">

            <ShieldAlert className="h-5 w-5 text-amber-700" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Common Mistake
            </span>

          </div>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            {step.commonMistake}
          </p>

        </div>

      </section>

      {/* Required Documents */}

      {step.documents && step.documents.length > 0 && (
        <section className="border-b border-slate-200 px-8 py-10 lg:px-12">

          <div className="flex items-center gap-3">

            <FileText className="h-6 w-6 text-blue-600" />

            <h4 className="text-xl font-bold text-slate-900">
              Required Documents
            </h4>

          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {step.documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <span className="font-medium text-slate-700">
                  {document.name}
                </span>

                {document.required ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Required
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                    Optional
                  </span>
                )}
              </div>
            ))}

          </div>

        </section>
      )}

      {/* ONS Support */}

      <section className="border-b border-slate-200 px-8 py-10 lg:px-12">

        <div className="flex items-center gap-3">

          <ShieldCheck className="h-6 w-6 text-blue-600" />

          <h4 className="text-xl font-bold text-slate-900">
            How ONS Logistics Helps
          </h4>

        </div>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {step.onsSupport}
        </p>

      </section>

      {/* Related Topics */}

      {step.entities && step.entities.length > 0 && (
        <section className="border-b border-slate-200 px-8 py-10 lg:px-12">

          <div className="flex items-center gap-3">

            <Sparkles className="h-6 w-6 text-blue-600" />

            <h4 className="text-xl font-bold text-slate-900">
              Related Customs Topics
            </h4>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            {step.entities.map((entity) => (
              <span
                key={entity}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {entity}
              </span>
            ))}

          </div>

        </section>
      )}

      {/* CTA */}

      <footer className="flex flex-col gap-6 px-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">

        <div>

          <h4 className="text-2xl font-bold text-slate-900">
            Need assistance with this stage?
          </h4>

          <p className="mt-3 max-w-xl text-slate-600">
            Speak with our customs specialists for guidance on documentation,
            compliance requirements and shipment planning.
          </p>

        </div>

        <Link
          href={step.learnMoreHref}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition-all hover:bg-blue-700"
        >
          Learn More

          <ArrowRight className="h-5 w-5" />
        </Link>

      </footer>

    </article>
  );
}