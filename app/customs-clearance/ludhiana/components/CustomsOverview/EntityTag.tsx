import clsx from "clsx";

interface EntityTagProps {
  label: string;
  variant?: "default" | "primary";
  className?: string;
}

export default function EntityTag({
  label,
  variant = "default",
  className,
}: EntityTagProps) {
  return (
    <span
      className={clsx(
        "group inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ease-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",

        variant === "default" && [
          "border-slate-200",
          "bg-white",
          "text-slate-700",
          "hover:-translate-y-0.5",
          "hover:border-blue-200",
          "hover:bg-blue-50",
          "hover:text-blue-700",
          "hover:shadow-sm",
        ],

        variant === "primary" && [
          "border-blue-200",
          "bg-blue-50",
          "text-blue-700",
          "hover:-translate-y-0.5",
          "hover:border-blue-300",
          "hover:bg-blue-100",
          "hover:shadow-sm",
        ],

        className
      )}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

      <span>{label}</span>
    </span>
  );
}