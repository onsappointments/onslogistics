import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileBadge2,
  FileText,
  Lightbulb,
  Tag,
  TriangleAlert,
} from "lucide-react";

import { CustomsDocument } from "./types";

interface DocumentCardProps {
  document: CustomsDocument;
}

const importanceStyles = {
  Essential:
    "bg-blue-50 text-blue-700 border-blue-200",
  Recommended:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Conditional:
    "bg-amber-50 text-amber-700 border-amber-200",
};

export default function DocumentCard({
  document,
}: DocumentCardProps) {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

      {/* Header */}

      <header className="border-b border-slate-100 p-8">

        <div className="flex items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>

              <div>

                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  {document.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {document.category.toUpperCase()}
                </p>

              </div>

            </div>

          </div>

          {"importance" in document && (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                importanceStyles[
                  document.importance as keyof typeof importanceStyles
                ]
              }`}
            >
              {document.importance}
            </span>
          )}

        </div>

        <p className="mt-6 leading-8 text-slate-600">
          {document.description}
        </p>

      </header>

      {/* Body */}

      <div className="space-y-8 p-8">

        {/* Purpose */}

        <div>

          <div className="flex items-center gap-2">

            <CheckCircle2 className="h-5 w-5 text-blue-600" />

            <h4 className="font-semibold text-slate-900">
              Purpose
            </h4>

          </div>

          <p className="mt-3 leading-7 text-slate-600">
            {document.purpose}
          </p>

        </div>

        {/* Issued By */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="flex items-center gap-2">

            <Building2 className="h-5 w-5 text-slate-700" />

            <span className="text-sm font-semibold text-slate-800">
              Issued By
            </span>

          </div>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            {document.issuedBy}
          </p>

        </div>

        {/* Used During */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="flex items-center gap-2">

            <FileBadge2 className="h-5 w-5 text-slate-700" />

            <span className="text-sm font-semibold text-slate-800">
              Used During
            </span>

          </div>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            {document.usedDuring}
          </p>

        </div>

        {/* Required For */}

        <div>

          <div className="flex items-center gap-2">

            <Tag className="h-5 w-5 text-blue-600" />

            <h4 className="font-semibold text-slate-900">
              Required For
            </h4>

          </div>

          <div className="mt-4 flex flex-wrap gap-2">

            {document.requiredFor.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        {/* Expert Tip */}

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

          <div className="flex items-center gap-2">

            <Lightbulb className="h-5 w-5 text-emerald-700" />

            <h4 className="font-semibold text-emerald-800">
              Expert Tip
            </h4>

          </div>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {document.expertTip}
          </p>

        </div>

        {/* Common Mistake */}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex items-center gap-2">

            <TriangleAlert className="h-5 w-5 text-amber-700" />

            <h4 className="font-semibold text-amber-800">
              Common Mistake
            </h4>

          </div>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {document.commonMistake}
          </p>

        </div>

        {/* Related Topics */}

        <div>

          <h4 className="font-semibold text-slate-900">
            Related Topics
          </h4>

          <div className="mt-4 flex flex-wrap gap-2">

            {document.relatedEntities.map((entity) => (
              <span
                key={entity}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 transition-colors group-hover:border-blue-200"
              >
                {entity}
              </span>
            ))}

          </div>

        </div>

      </div>

      {/* Footer */}

      <footer className="border-t border-slate-100 p-8">

        <Link
          href={document.learnMoreHref}
          className="inline-flex items-center gap-2 font-semibold text-blue-700 transition-all duration-300 hover:gap-3"
        >
          Read Complete Guide

          <ArrowRight className="h-4 w-4" />

        </Link>

      </footer>

    </article>
  );
}