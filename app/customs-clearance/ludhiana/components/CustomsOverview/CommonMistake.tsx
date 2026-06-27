import { AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { ReactNode } from "react";

interface CommonMistakeProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function CommonMistake({
  title = "Common Mistake",
  children,
  className,
}: CommonMistakeProps) {
  return (
    <aside
      aria-labelledby="common-mistake-title"
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {/* Decorative Glow */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-white">
          <AlertTriangle
            className="h-5 w-5 text-amber-700"
            aria-hidden="true"
          />
        </div>

        <div className="flex-1">
          <h4
            id="common-mistake-title"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700"
          >
            {title}
          </h4>

          <p className="mt-3 text-[15px] leading-7 text-slate-700">
            {children}
          </p>
        </div>
      </div>
    </aside>
  );
}