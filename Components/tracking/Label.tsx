import React from "react";

interface LabelProps {
  children: React.ReactNode;
  color?: "gray" | "amber" | "green";
}

export default function Label({
  children,
  color = "gray",
}: LabelProps) {
  const cls: Record<string, string> = {
    gray: "text-gray-500",
    amber: "text-amber-600",
    green: "text-green-600",
  };

  return (
    <div className="mb-1">
      <span className={`text-xs font-medium ${cls[color]}`}>
        {children}
      </span>
    </div>
  );
}