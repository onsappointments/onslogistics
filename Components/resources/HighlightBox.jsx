export default function HighlightBox({
  children,
  type = "info", // info | success | warning
  title,
}) {
  const styles = {
    info: {
      wrapper: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-800",
    },
    success: {
      wrapper: "bg-green-50 border-green-200",
      icon: "text-green-600",
      title: "text-green-800",
    },
    warning: {
      wrapper: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-600",
      title: "text-yellow-800",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`rounded-2xl border p-5 my-8 flex gap-4 items-start ${style.wrapper}`}
    >
      {/* ICON */}
      <div className={`mt-1 ${style.icon}`}>
        {type === "info" && "ℹ️"}
        {type === "success" && "✅"}
        {type === "warning" && "⚠️"}
      </div>

      {/* CONTENT */}
      <div>
        {title && (
          <h4 className={`font-semibold mb-1 ${style.title}`}>
            {title}
          </h4>
        )}

        <div className="text-gray-700 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}