import clsx from "clsx";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  return (
    <header
      className={clsx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          {eyebrow}
        </span>
      )}

      <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-lg leading-8 text-slate-600">
          {description}
        </p>
      )}
    </header>
  );
}