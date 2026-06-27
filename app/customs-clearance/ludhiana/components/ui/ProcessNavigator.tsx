"use client";

import clsx from "clsx";
import { CheckCircle2 } from "lucide-react";

export interface ProcessNavigatorItem {
  id: string;
  title: string;
  description?: string;
}

interface ProcessNavigatorProps {
  items: ProcessNavigatorItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function ProcessNavigator({
  items,
  activeId,
  onChange,
  className,
}: ProcessNavigatorProps) {
  return (
    <nav
      aria-label="Process Navigation"
      className={clsx(
        "rounded-[28px] border border-slate-200 bg-white p-6",
        className
      )}
    >
      <ol className="space-y-2">
        {items.map((item, index) => {
          const active = activeId === item.id;

          return (
            <li
              key={item.id}
              className="relative"
            >
              {/* Connector */}

              {index !== items.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-5 top-12 h-12 w-px bg-slate-200"
                />
              )}

              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={clsx(
                  "group flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300",
                  active
                    ? "bg-blue-50"
                    : "hover:bg-slate-50"
                )}
              >
                <div
                  className={clsx(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-500 group-hover:border-blue-300"
                  )}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3
                    className={clsx(
                      "font-semibold transition-colors",
                      active
                        ? "text-blue-700"
                        : "text-slate-900"
                    )}
                  >
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}