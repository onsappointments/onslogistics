"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export default function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  function toggle(id: string) {
    if (allowMultiple) {
      setOpenItems((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
      );
      return;
    }

    setOpenItems((current) =>
      current.includes(id) ? [] : [id]
    );
  }

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[32px] border border-slate-200 bg-white",
        className
      )}
    >
      {items.map((item, index) => {
        const open = openItems.includes(item.id);

        return (
          <section
            key={item.id}
            className={
              index !== items.length - 1
                ? "border-b border-slate-200"
                : ""
            }
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${item.id}-panel`}
              id={`${item.id}-button`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-8 py-7 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                {item.title}
              </h3>

              <ChevronDown
                className={clsx(
                  "h-5 w-5 text-slate-500 transition-transform duration-300",
                  open && "rotate-180"
                )}
              />
            </button>

            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-button`}
              className={clsx(
                "grid overflow-hidden transition-all duration-300",
                open
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-slate-200 bg-slate-50 px-8 py-7">
                  {item.content}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}