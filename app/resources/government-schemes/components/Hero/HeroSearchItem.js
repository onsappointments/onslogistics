import { ArrowUpRight, FileText } from "lucide-react";

export default function HeroSearchItem({
  article,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-4 border-b border-gray-100 p-5 text-left transition last:border-b-0 ${
        active
          ? "bg-blue-50"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="rounded-xl bg-blue-100 p-2">
        <FileText className="h-5 w-5 text-blue-700" />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">
          {article.title}
        </h4>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {article.description}
        </p>
      </div>

      <ArrowUpRight className="h-5 w-5 text-gray-400" />
    </button>
  );
}