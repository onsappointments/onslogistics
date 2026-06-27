import { ReactNode } from "react";
import clsx from "clsx";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "gray" | "blue";
  spacing?: "sm" | "md" | "lg" | "xl";
  id?: string;
}

const backgrounds = {
  white: "bg-white",
  gray: "bg-slate-50",
  blue: "bg-blue-50",
};

const spacing = {
  sm: "py-16",
  md: "py-24",
  lg: "py-32",
  xl: "py-40",
};

export default function Section({
  children,
  className,
  background = "white",
  spacing: size = "lg",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        backgrounds[background],
        spacing[size],
        className
      )}
    >
      {children}
    </section>
  );
}