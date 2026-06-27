"use client";

import clsx from "clsx";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Segmented Control"
      className={clsx(
        "inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={clsx(
              "relative rounded-xl px-6 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              active
                ? "bg-white shadow-sm"
                : "hover:bg-white/70"
            )}
          >
            <div className="flex flex-col items-center">
              <span
                className={clsx(
                  "text-sm font-semibold",
                  active
                    ? "text-slate-900"
                    : "text-slate-600"
                )}
              >
                {option.label}
              </span>

              {option.description && (
                <span
                  className={clsx(
                    "mt-1 text-xs",
                    active
                      ? "text-slate-500"
                      : "text-slate-400"
                  )}
                >
                  {option.description}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}