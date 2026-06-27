import { Lightbulb } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function ExpertTip({
  children,
}: Props) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

      <div className="flex items-center gap-2">

        <Lightbulb className="h-5 w-5 text-emerald-700" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Expert Tip
        </p>

      </div>

      <p className="mt-3 text-sm leading-7 text-slate-700">
        {children}
      </p>

    </div>
  );
}