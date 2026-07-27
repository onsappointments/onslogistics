import Label from "@/Components/tracking/Label";
import { INPUT_CLS } from "@/Components/tracking/lib/constants";

interface DateFieldsProps {
  dateMode: string;
  onDateModeChange: (m: string) => void;
  eta: string;
  actualDeparture: string;
  onChange: (k: string, v: string) => void;
  stepDef: any;
}

export default function DateFields({
  dateMode,
  onDateModeChange,
  eta,
  actualDeparture,
  onChange,
  stepDef,
}: DateFieldsProps) {
  const availableModes = ["none"];

  if (stepDef) {
    if (stepDef.dateFields === "single") availableModes.push("single");

    if (
      stepDef.dateFields === "eta" ||
      stepDef.dateFields === "both"
    ) {
      availableModes.push("eta");
    }

    if (
      stepDef.dateFields === "actual" ||
      stepDef.dateFields === "both"
    ) {
      availableModes.push("actual");
    }
  } else {
    availableModes.push("single", "eta", "actual");
  }

  const modeLabels: Record<
    string,
    {
      label: string;
      active: string;
    }
  > = {
    none: {
      label: "No date",
      active: "bg-gray-100 border-gray-300 text-gray-600",
    },

    single: {
      label: "📅 Event date",
      active: "bg-blue-50 border-blue-300 text-blue-700",
    },

    eta: {
      label: "🕐 Estimated",
      active: "bg-amber-50 border-amber-300 text-amber-700",
    },

    actual: {
      label: "✓ Confirmed",
      active: "bg-green-50 border-green-300 text-green-700",
    },
  };

  return (
    <div className="space-y-2">
      <Label>Date type</Label>

      <div className="flex flex-wrap gap-1.5">
        {availableModes.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onDateModeChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              dateMode === key
                ? modeLabels[key].active
                : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
            }`}
          >
            {modeLabels[key].label}
          </button>
        ))}
      </div>

      {(dateMode === "single" || dateMode === "eta") && (
        <div>
          <Label color={dateMode === "eta" ? "amber" : "gray"}>
            {dateMode === "eta"
              ? "Estimated date & time"
              : "Event date & time"}
          </Label>

          <div className="flex gap-2">
            <input
              type="date"
              className={INPUT_CLS}
              value={eta ? eta.split("T")[0] : ""}
              onChange={(e) => {
                const t = eta?.split("T")[1] || "";

                onChange(
                  "eta",
                  t ? `${e.target.value}T${t}` : e.target.value
                );
              }}
            />

            <input
              type="time"
              className="w-[45%] flex-shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={eta?.includes("T") ? eta.split("T")[1] : ""}
              onChange={(e) => {
                const d = eta?.split("T")[0] || "";

                onChange(
                  "eta",
                  d ? `${d}T${e.target.value}` : e.target.value
                );
              }}
            />
          </div>
        </div>
      )}

      {dateMode === "actual" && (
        <div>
          <Label color="green">Confirmed date & time</Label>

          <div className="flex gap-2">
            <input
              type="date"
              className={INPUT_CLS}
              value={
                actualDeparture ? actualDeparture.split("T")[0] : ""
              }
              onChange={(e) => {
                const t = actualDeparture?.split("T")[1] || "";

                onChange(
                  "actualDeparture",
                  t ? `${e.target.value}T${t}` : e.target.value
                );
              }}
            />

            <input
              type="time"
              className="w-[45%] flex-shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={
                actualDeparture?.includes("T")
                  ? actualDeparture.split("T")[1]
                  : ""
              }
              placeholder="optional"
              onChange={(e) => {
                const d = actualDeparture?.split("T")[0] || "";

                onChange(
                  "actualDeparture",
                  d ? `${d}T${e.target.value}` : e.target.value
                );
              }}
            />
          </div>

          <p className="text-xs text-gray-300 mt-1">
            Time is optional
          </p>
        </div>
      )}
    </div>
  );
}