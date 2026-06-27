interface Props {
  children: React.ReactNode;
}

export default function QuickAnswer({ children }: Props) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
        Quick Answer
      </p>

      <p className="mt-3 text-sm leading-7 text-slate-700">
        {children}
      </p>
    </div>
  );
}