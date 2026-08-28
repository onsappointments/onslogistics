import { useState } from "react";
import { getCycleStep } from "@/lib/shipmentCycles";

import DateFields from "@/Components/tracking/DateFields";
import Label from "@/Components/tracking/Label";
import { INPUT_CLS } from "@/Components/tracking/lib/constants";
import { toDateValue } from "@/Components/tracking/lib/utils";

interface EditEventModalProps {
  event: any;
  shipmentType: string;
  onSave: (updated: any) => void;
  onClose: () => void;
  loading: boolean;
}

export default function EditEventModal({
  event,
  shipmentType,
  onSave,
  onClose,
  loading,
}: EditEventModalProps) {
  const initDateMode = event.actualDeparture
    ? "actual"
    : event.eta
      ? "eta"
      : "none";

    const stepDef = getCycleStep(
    shipmentType,
    event.cycleStep
  );

  const stepFields = stepDef?.fields || [];

  const hasField = (field: string) =>
    stepFields.includes(field as any);

  const [fields, setFields] = useState({
  dateMode: initDateMode,

  eta: event.eta
    ? new Date(event.eta).toISOString().slice(0, 16)
    : "",

  actualDeparture: event.actualDeparture
    ? new Date(event.actualDeparture).toISOString().slice(0, 16)
    : "",

  location: event.location || "",
  remarks: event.remarks || "",

  vesselName: event.vesselName || "",
  voyage: event.voyage || "",

  trainNumber: event.trainNumber || "",
  wagonNumber: event.wagonNumber || "",

  sealNumber: event.sealNumber || "",
});

  function set(k: string, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">
            Edit event
          </h2>

          <p className="text-blue-200 text-xs mt-0.5">
            {event.status}
          </p>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-3">
          <DateFields
            dateMode={fields.dateMode}
            onDateModeChange={(mode) =>
              setFields((p) => ({
                ...p,
                dateMode: mode,
                eta: "",
                actualDeparture: "",
              }))
            }
            eta={fields.eta}
            actualDeparture={fields.actualDeparture}
            onChange={set}
            stepDef={null}
          />

          {/* Vessel information */}
{(hasField("vesselName") || hasField("voyage")) && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {hasField("vesselName") && (
      <div>
        <Label>Vessel Name</Label>

        <input
          className={INPUT_CLS}
          placeholder="e.g. MSC Anna"
          value={fields.vesselName}
          onChange={(e) =>
            set("vesselName", e.target.value)
          }
        />
      </div>
    )}

    {hasField("voyage") && (
      <div>
        <Label>Voyage</Label>

        <input
          className={INPUT_CLS}
          placeholder="e.g. 123W"
          value={fields.voyage}
          onChange={(e) =>
            set("voyage", e.target.value)
          }
        />
      </div>
    )}
  </div>
)}

{/* Rail information */}
{(hasField("trainNumber") || hasField("wagonNumber")) && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {hasField("trainNumber") && (
      <div>
        <Label>Train Number</Label>

        <input
          className={INPUT_CLS}
          placeholder="e.g. 12901"
          value={fields.trainNumber}
          onChange={(e) =>
            set("trainNumber", e.target.value)
          }
        />
      </div>
    )}

    {hasField("wagonNumber") && (
      <div>
        <Label>Wagon Number</Label>

        <input
          className={INPUT_CLS}
          placeholder="e.g. WGN-123"
          value={fields.wagonNumber}
          onChange={(e) =>
            set("wagonNumber", e.target.value)
          }
        />
      </div>
    )}
  </div>
)}

{/* Seal information */}
{hasField("sealNumber") && (
  <div>
    <Label>Seal Number</Label>

    <input
      className={INPUT_CLS}
      placeholder="e.g. MS123456"
      value={fields.sealNumber}
      onChange={(e) =>
        set("sealNumber", e.target.value.toUpperCase())
      }
    />
  </div>
)}

          {(hasField("location") || hasField("remarks")) && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    {hasField("location") && (
      <div>
        <Label>Location</Label>

        <input
          className={INPUT_CLS}
          placeholder="e.g. Nhava Sheva, IN"
          value={fields.location}
          onChange={(e) =>
            set("location", e.target.value)
          }
        />
      </div>
    )}

    {hasField("remarks") && (
      <div>
        <Label>Remarks</Label>

        <input
          className={INPUT_CLS}
          placeholder="Visible to client in email"
          value={fields.remarks}
          onChange={(e) =>
            set("remarks", e.target.value)
          }
        />
      </div>
    )}

  </div>
)}
        </div>

        <div className="px-6 pb-5 flex gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
  onSave({
    status: event.status,
    cycleStep: event.cycleStep,

    eta:
      fields.dateMode === "eta" ||
      fields.dateMode === "single"
        ? toDateValue(fields.eta)
        : null,

    actualDeparture:
      fields.dateMode === "actual"
        ? toDateValue(fields.actualDeparture)
        : null,

    location: fields.location,
    remarks: fields.remarks,

    vesselName: hasField("vesselName")
      ? fields.vesselName.trim()
      : undefined,

    voyage: hasField("voyage")
      ? fields.voyage.trim()
      : undefined,

    trainNumber: hasField("trainNumber")
      ? fields.trainNumber.trim()
      : undefined,

    wagonNumber: hasField("wagonNumber")
      ? fields.wagonNumber.trim()
      : undefined,

    sealNumber: hasField("sealNumber")
      ? fields.sealNumber.trim()
      : undefined,
  })
}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}