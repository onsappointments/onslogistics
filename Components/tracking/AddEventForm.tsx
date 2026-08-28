import { useState } from "react";

import DateFields from "@/Components/tracking/DateFields";
import EmailConfirmModal from "@/Components/tracking/EmailConfirmModal";
import Label from "@/Components/tracking/Label";
import {
  INPUT_CLS,
  JOB_LEVEL_STEPS,
  PRE_CONTAINER_SENTINEL,
  SELECT_CLS,
} from "@/Components/tracking/lib/constants";
import { toDateValue } from "@/Components/tracking/lib/utils";
import useShipmentCycle from "@/Components/tracking/hooks/useShipmentCycle";

interface AddEventFormProps {
  shipmentType: string;
  containers: any[];
  onSubmit: (
    containerNumber: string,
    sizeType: string,
    event: any,
    emailOpts: any,
    onSuccess: () => void
  ) => void;
  loading: boolean;
  defaultEmail: string;
}

export default function AddEventForm({
  shipmentType,
  containers,
  onSubmit,
  loading,
  defaultEmail,
}: AddEventFormProps) {
  const { phases, steps } = useShipmentCycle(shipmentType, containers);

  const realContainers = containers.filter(
    (c) => c.containerNumber !== PRE_CONTAINER_SENTINEL
  );

  const blank = {
    cycleStepKey: "",
    dateMode: "none",
    eta: "",
    actualDeparture: "",
    containerMode: "existing" as "existing" | "new",
    selectedContainerNumber: realContainers[0]?.containerNumber || "",
    newContainerNumber: "",
    newSizeType: "",
    location: "",
    remarks: "",

    vesselName: "",
    voyage: "",

    trainNumber: "",
    wagonNumber: "",

    sealNumber: "",
  };

  const [fields, setFields] = useState(blank);
  const [pendingEvent, setPending] = useState<any>(null);
  // Sequence warning returned from the API after a successful save
  const [sequenceWarning, setSequenceWarning] = useState<string | null>(null);

  function set(k: string, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  const selectedStepDef = steps.find((s) => s.key === fields.cycleStepKey) || null;
  const stepFields = selectedStepDef?.fields || [];

  const hasField = (field: string) =>
    stepFields.includes(field as any);

  const isJobLevel = selectedStepDef
    ? JOB_LEVEL_STEPS.has(selectedStepDef.key) || !selectedStepDef.requiresContainer
    : false;

  function handleStepChange(key: string) {
    const def = steps.find((s) => s.key === key);
    let defaultDateMode = "none";
    if (def) {
      if (def.dateFields === "single") defaultDateMode = "single";
      else if (def.dateFields === "eta") defaultDateMode = "eta";
      else if (def.dateFields === "actual") defaultDateMode = "actual";
      else if (def.dateFields === "both") defaultDateMode = "eta";
    }
    setFields((p) => ({
      ...p,
      cycleStepKey: key,
      dateMode: defaultDateMode,
      eta: "",
      actualDeparture: "",

       vesselName: "",
        voyage: "",

      trainNumber: "",
      wagonNumber: "",

     sealNumber: "",
    }));
    setSequenceWarning(null);
  }

  function handleAddClick() {
    if (!selectedStepDef) return;

    let effectiveContainerNumber: string;
    let effectiveSizeType = "";

    if (isJobLevel) {
      effectiveContainerNumber = PRE_CONTAINER_SENTINEL;
    } else {
      if (fields.containerMode === "existing") {
        if (!fields.selectedContainerNumber) {
          alert("Please select a container or add a new one.");
          return;
        }
        effectiveContainerNumber = fields.selectedContainerNumber;
        effectiveSizeType =
          realContainers.find(
            (c) => c.containerNumber === fields.selectedContainerNumber
          )?.sizeType || "";
      } else {
        const cn = fields.newContainerNumber.trim().toUpperCase();
        if (!cn) {
          alert("Please enter a container number.");
          return;
        }
        effectiveContainerNumber = cn;
        effectiveSizeType = fields.newSizeType.trim();
      }
    }

    const event = {
  cycleStep: fields.cycleStepKey,

  status: selectedStepDef.label,

  eta:
    fields.dateMode === "eta" || fields.dateMode === "single"
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
    : null,

  voyage: hasField("voyage")
    ? fields.voyage.trim()
    : null,

  trainNumber: hasField("trainNumber")
    ? fields.trainNumber.trim()
    : null,

  wagonNumber: hasField("wagonNumber")
    ? fields.wagonNumber.trim()
    : null,

  sealNumber: hasField("sealNumber")
    ? fields.sealNumber.trim()
    : null,
};

    setPending({
      event,
      effectiveContainerNumber,
      sizeType: effectiveSizeType,
    });
  }

  function handleConfirm(emailOpts: any) {
    if (!pendingEvent) return;
    onSubmit(
      pendingEvent.effectiveContainerNumber,
      pendingEvent.sizeType,
      pendingEvent.event,
      emailOpts,
      (warning?: string | null) => {
        // After successful save, reset form but keep the container selection
        // so the next event defaults to the same container (common workflow).
        const savedContainer =
          pendingEvent.effectiveContainerNumber !== PRE_CONTAINER_SENTINEL
            ? pendingEvent.effectiveContainerNumber
            : fields.selectedContainerNumber;

        setFields({
          ...blank,
          containerMode: "existing",
          selectedContainerNumber: savedContainer,
        });
        setPending(null);
        if (warning) setSequenceWarning(warning);
      }
    );
  }

  function handleSkip() {
    if (!pendingEvent) return;
    onSubmit(
      pendingEvent.effectiveContainerNumber,
      pendingEvent.sizeType,
      pendingEvent.event,
      null,
      (warning?: string | null) => {
        const savedContainer =
          pendingEvent.effectiveContainerNumber !== PRE_CONTAINER_SENTINEL
            ? pendingEvent.effectiveContainerNumber
            : fields.selectedContainerNumber;

        setFields({
          ...blank,
          containerMode: "existing",
          selectedContainerNumber: savedContainer,
        });
        setPending(null);
        if (warning) setSequenceWarning(warning);
      }
    );
  }

  const canSubmit = !!selectedStepDef;

  return (
    <>
      {pendingEvent && (
        <EmailConfirmModal
          event={pendingEvent.event}
          defaultEmail={defaultEmail}
          saving={loading}
          onConfirm={handleConfirm}
          onSkip={handleSkip}
        />
      )}

      <div className="space-y-4">
        {/* Sequence warning — shown after a save, dismissed on next step change */}
        {sequenceWarning && (
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <svg
              className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-semibold text-orange-700">
                Sequence warning
              </p>
              <p className="text-xs text-orange-600 mt-0.5">{sequenceWarning}</p>
            </div>
            <button
              type="button"
              onClick={() => setSequenceWarning(null)}
              className="text-orange-400 hover:text-orange-600 flex-shrink-0"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Step selector */}
        <div>
          <Label>Cycle step</Label>
          <select
            className={SELECT_CLS}
            value={fields.cycleStepKey}
            onChange={(e) => handleStepChange(e.target.value)}
          >
            <option value="">Select a step…</option>
            {phases.map(({ name, steps: phaseSteps }) => (
              <optgroup key={name} label={`── ${name}`}>
                {phaseSteps.map((step: any) => {
                  const done = step.singleDone || (step.etaDone && step.actualDone);
                  return (
                    <option key={step.key} value={step.key} disabled={done}>
                      {done ? "✓ " : ""}
                      {step.label}
                      {step.etaDone && !step.actualDone ? " (ETA done)" : ""}
                      {step.actualDone && !step.etaDone ? " (Actual done)" : ""}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </div>

        {selectedStepDef && (
          <>
            {/* Scope badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium">
                {selectedStepDef.phase}
              </span>
              {isJobLevel ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 font-medium">
                  📋 Job-level — applies to entire shipment
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200 font-medium">
                  📦 Container-level
                </span>
              )}
              {selectedStepDef.hint && (
                <p className="w-full text-xs text-gray-400 italic mt-0.5">
                  {selectedStepDef.hint}
                </p>
              )}
            </div>

            {/* Container selector — only for container-level steps */}
            {!isJobLevel && (
              <div>
                <Label>Container</Label>
                {realContainers.length > 0 ? (
                  <>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => set("containerMode", "existing")}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${fields.containerMode === "existing"
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                      >
                        Use existing container
                      </button>
                      <button
                        type="button"
                        onClick={() => set("containerMode", "new")}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${fields.containerMode === "new"
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                      >
                        + Add new container
                      </button>
                    </div>
                    {fields.containerMode === "existing" ? (
                      <select
                        className={SELECT_CLS}
                        value={fields.selectedContainerNumber}
                        onChange={(e) =>
                          set("selectedContainerNumber", e.target.value)
                        }
                      >
                        <option value="">— Select container —</option>
                        {realContainers.map((c) => (
                          <option
                            key={c.containerNumber}
                            value={c.containerNumber}
                          >
                            {c.containerNumber}
                            {c.sizeType ? ` (${c.sizeType})` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className={INPUT_CLS}
                          placeholder="e.g. CAAU9272307"
                          value={fields.newContainerNumber}
                          onChange={(e) =>
                            set(
                              "newContainerNumber",
                              e.target.value.toUpperCase()
                            )
                          }
                        />
                        <input
                          className={INPUT_CLS}
                          placeholder="Size e.g. 40HC"
                          value={fields.newSizeType}
                          onChange={(e) =>
                            set("newSizeType", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* No containers yet — must enter one */
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className={INPUT_CLS}
                      placeholder="Container no. e.g. CAAU9272307"
                      value={fields.newContainerNumber}
                      onChange={(e) =>
                        set("newContainerNumber", e.target.value.toUpperCase())
                      }
                    />
                    <input
                      className={INPUT_CLS}
                      placeholder="Size e.g. 40HC"
                      value={fields.newSizeType}
                      onChange={(e) => set("newSizeType", e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Date fields */}
            {selectedStepDef.dateFields !== "none" && (
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
                stepDef={selectedStepDef}
              />
            )}

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
          onChange={(e) => set("vesselName", e.target.value)}
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
          onChange={(e) => set("voyage", e.target.value)}
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
          onChange={(e) => set("trainNumber", e.target.value)}
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
          onChange={(e) => set("wagonNumber", e.target.value)}
        />
      </div>
    )}
  </div>
)}

{/* Container seal */}
{hasField("sealNumber") && (
  <div>
    <Label>Seal Number</Label>
    <input
      className={INPUT_CLS}
      placeholder="e.g. MS123456"
      value={fields.sealNumber}
      onChange={(e) => set("sealNumber", e.target.value.toUpperCase())}
    />
  </div>
)}

            {/* Location + Remarks */}
{(hasField("location") || hasField("remarks")) && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {hasField("location") && (
      <div>
        <Label>Location</Label>
        <input
          className={INPUT_CLS}
          placeholder="e.g. Nhava Sheva, IN"
          value={fields.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>
    )}

    {hasField("remarks") && (
      <div>
        <Label>
          Remarks{" "}
          <span className="text-gray-300 font-normal">(optional)</span>
        </Label>
        <input
          className={INPUT_CLS}
          placeholder="Visible to client in email"
          value={fields.remarks}
          onChange={(e) => set("remarks", e.target.value)}
        />
      </div>
    )}
  </div>
)}
          </>
        )}

        <button
          type="button"
          disabled={loading || !canSubmit}
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add status
        </button>
      </div>
    </>
  );
}
