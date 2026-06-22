"use client";

import { useState, useMemo } from "react";
import { getCycleForShipment } from "@/lib/shipmentCycles";

/* ─────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────── */

export const PRE_CONTAINER_SENTINEL = "__PRE_CONTAINER__";

// Steps that belong to the entire job, not a specific container.
const JOB_LEVEL_STEPS = new Set([
  "bill_of_entry",
  "cargo_examination",
  "ooc_customs_cleared",
  "booking_docs_received",
  "cargo_received",
  "custom_clearance_origin",
]);

/* ─────────────────────────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────────────────────────── */

function fmtDate(d?: string | Date | null): string | null {
  if (!d) return null;
  const dt = new Date(d as string);
  if (isNaN(dt.getTime())) return null;
  const hasTime =
    dt.getUTCHours() !== 0 ||
    dt.getUTCMinutes() !== 0 ||
    dt.getUTCSeconds() !== 0;
  if (hasTime) {
    return dt.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDateValue(val?: string | null): string | Date | null {
  if (!val) return null;
  const trimmed = typeof val === "string" ? val.trim() : "";
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

/* ─────────────────────────────────────────────────────────────────────
   Shared style tokens
───────────────────────────────────────────────────────────────────── */

const INPUT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
  "placeholder:text-gray-300";

const SELECT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700";

function Label({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "gray" | "amber" | "green";
}) {
  const cls: Record<string, string> = {
    gray: "text-gray-500",
    amber: "text-amber-600",
    green: "text-green-600",
  };
  return (
    <div className="mb-1">
      <span className={`text-xs font-medium ${cls[color]}`}>{children}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   useShipmentCycle
───────────────────────────────────────────────────────────────────── */

function useShipmentCycle(shipmentType: string, containers: any[] = []) {
  const cycle = getCycleForShipment(shipmentType);

  const completedKeys = useMemo(() => {
    const set = new Set<string>();
    for (const container of containers) {
      for (const ev of container.events ?? []) {
        if (ev.cycleStep) set.add(`${ev.cycleStep}::${ev.eventType ?? "single"}`);
      }
    }
    return set;
  }, [containers]);

  const phases = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const step of cycle) {
      if (!map.has(step.phase)) map.set(step.phase, []);
      map.get(step.phase)!.push({
        ...step,
        etaDone: completedKeys.has(`${step.key}::eta`),
        actualDone: completedKeys.has(`${step.key}::actual`),
        singleDone: completedKeys.has(`${step.key}::single`),
      });
    }
    return Array.from(map.entries()).map(([name, steps]) => ({ name, steps }));
  }, [cycle, completedKeys]);

  const steps = useMemo(
    () =>
      cycle.map((s) => ({
        ...s,
        etaDone: completedKeys.has(`${s.key}::eta`),
        actualDone: completedKeys.has(`${s.key}::actual`),
        singleDone: completedKeys.has(`${s.key}::single`),
      })),
    [cycle, completedKeys]
  );

  return { phases, steps };
}

/* ─────────────────────────────────────────────────────────────────────
   Email confirm modal
   Used for both new events and resends.
   When isResendOnly=true, the "save without email" button is hidden
   since there is nothing to save — it's purely an email action.
───────────────────────────────────────────────────────────────────── */

function EmailConfirmModal({
  event,
  defaultEmail,
  onConfirm,
  onSkip,
  saving,
  isResendOnly = false,
}: {
  event: any;
  defaultEmail: string;
  onConfirm: (opts: { emailType: string; recipientEmail: string }) => void;
  onSkip: () => void;
  saving: boolean;
  isResendOnly?: boolean;
}) {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail || "");

  const options = [
    event.actualDeparture && {
      key: "actual",
      label: "✓ Send confirmed date notification",
      sub: `Confirmed on: ${fmtDate(event.actualDeparture)}`,
    },
    event.eta && {
      key: "eta",
      label: "🕐 Send estimated date notification",
      sub: `Estimated: ${fmtDate(event.eta)}`,
    }
  ].filter(Boolean) as { key: string; label: string; sub: string }[];

  const [selected, setSelected] = useState(options[0].key);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">
            {isResendOnly ? "Resend notification" : "Notify client?"}
          </h2>
          <p className="text-blue-200 text-xs mt-0.5">
            {isResendOnly
              ? "Status remains unchanged — only the email will be sent"
              : "Choose whether to send an email — status will be saved regardless"}
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-2">
            {options.map((opt) => (
              <label
                key={opt.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected === opt.key
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-100 hover:border-gray-200 bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="emailType"
                  value={opt.key}
                  checked={selected === opt.key}
                  onChange={() => setSelected(opt.key)}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
          <div>
            <Label>Send to</Label>
            <input
              type="email"
              className={INPUT_CLS}
              placeholder="client@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            {defaultEmail && recipientEmail !== defaultEmail && (
              <p className="text-xs text-amber-500 mt-1">
                ⚠ Default is {defaultEmail}
              </p>
            )}
          </div>
          {!isResendOnly && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
              <svg
                className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
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
              <p className="text-xs text-amber-700">
                The status has <strong>not been saved yet</strong>. It will be
                saved when you confirm below.
              </p>
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex gap-3">
          {!isResendOnly && (
            <button
              type="button"
              onClick={onSkip}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Skip — save without email
            </button>
          )}
          {isResendOnly && (
            <button
              type="button"
              onClick={onSkip}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={saving || !recipientEmail}
            onClick={() => onConfirm({ emailType: selected, recipientEmail })}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                {isResendOnly ? "Sending…" : "Saving…"}
              </>
            ) : isResendOnly ? (
              "Send email →"
            ) : (
              "Save & send email →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Date fields
───────────────────────────────────────────────────────────────────── */

function DateFields({
  dateMode,
  onDateModeChange,
  eta,
  actualDeparture,
  onChange,
  stepDef,
}: {
  dateMode: string;
  onDateModeChange: (m: string) => void;
  eta: string;
  actualDeparture: string;
  onChange: (k: string, v: string) => void;
  stepDef: any;
}) {
  const availableModes = ["none"];
  if (stepDef) {
    if (stepDef.dateFields === "single") availableModes.push("single");
    if (stepDef.dateFields === "eta" || stepDef.dateFields === "both")
      availableModes.push("eta");
    if (stepDef.dateFields === "actual" || stepDef.dateFields === "both")
      availableModes.push("actual");
  } else {
    availableModes.push("single", "eta", "actual");
  }

  const modeLabels: Record<string, { label: string; active: string }> = {
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${dateMode === key
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
            {dateMode === "eta" ? "Estimated date & time" : "Event date & time"}
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
              value={actualDeparture ? actualDeparture.split("T")[0] : ""}
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
          <p className="text-xs text-gray-300 mt-1">Time is optional</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Edit event modal
───────────────────────────────────────────────────────────────────── */

function EditEventModal({
  event,
  onSave,
  onClose,
  loading,
}: {
  event: any;
  onSave: (updated: any) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const initDateMode = event.actualDeparture
    ? "actual"
    : event.eta
      ? "eta"
      : "none";

  const [fields, setFields] = useState({
    dateMode: initDateMode,
    eta: event.eta ? new Date(event.eta).toISOString().slice(0, 16) : "",
    actualDeparture: event.actualDeparture
      ? new Date(event.actualDeparture).toISOString().slice(0, 16)
      : "",
    location: event.location || "",
    remarks: event.remarks || "",
  });

  function set(k: string, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">Edit event</h2>
          <p className="text-blue-200 text-xs mt-0.5">{event.status}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Location</Label>
              <input
                className={INPUT_CLS}
                placeholder="e.g. Nhava Sheva, IN"
                value={fields.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
            <div>
              <Label>Remarks</Label>
              <input
                className={INPUT_CLS}
                placeholder="Visible to client in email"
                value={fields.remarks}
                onChange={(e) => set("remarks", e.target.value)}
              />
            </div>
          </div>
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
                  fields.dateMode === "eta" || fields.dateMode === "single"
                    ? toDateValue(fields.eta)
                    : null,
                actualDeparture:
                  fields.dateMode === "actual"
                    ? toDateValue(fields.actualDeparture)
                    : null,
                location: fields.location,
                remarks: fields.remarks,
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

/* ─────────────────────────────────────────────────────────────────────
   Add Container modal
───────────────────────────────────────────────────────────────────── */

function AddContainerModal({
  onAdd,
  onClose,
  existing,
}: {
  onAdd: (containerNumber: string, sizeType: string) => void;
  onClose: () => void;
  existing: string[];
}) {
  const [containerNumber, setContainerNumber] = useState("");
  const [sizeType, setSizeType] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const cn = containerNumber.trim().toUpperCase();
    if (!cn) {
      setError("Container number is required");
      return;
    }
    if (existing.includes(cn)) {
      setError("This container is already added");
      return;
    }
    onAdd(cn, sizeType.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">Add container</h2>
          <p className="text-blue-200 text-xs mt-0.5">
            Enter the container number to track it independently
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div>
            <Label>
              Container number <span className="text-red-400">*</span>
            </Label>
            <input
              className={INPUT_CLS}
              placeholder="e.g. CAAU9272307"
              value={containerNumber}
              onChange={(e) => {
                setContainerNumber(e.target.value.toUpperCase());
                setError("");
              }}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <Label>
              Size / type{" "}
              <span className="text-gray-300 font-normal">(optional)</span>
            </Label>
            <input
              className={INPUT_CLS}
              placeholder="e.g. 40HC, 20GP"
              value={sizeType}
              onChange={(e) => setSizeType(e.target.value)}
            />
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Add container
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Phase colours
───────────────────────────────────────────────────────────────────── */

const PHASE_COLORS: Record<string, { dot: string; bar: string }> = {
  "From Country": { dot: "#3b82f6", bar: "#bfdbfe" },
  "Arrived India": { dot: "#10b981", bar: "#d1fae5" },
  "Pre-Shipment": { dot: "#8b5cf6", bar: "#ede9fe" },
  "In Transit": { dot: "#f59e0b", bar: "#fef3c7" },
  Destination: { dot: "#16a34a", bar: "#bbf7d0" },
};
const DEFAULT_COLOR = { dot: "#6366f1", bar: "#e0e7ff" };

/* ─────────────────────────────────────────────────────────────────────
   Timeline event row
   Includes Edit, Delete, and Resend email buttons.
───────────────────────────────────────────────────────────────────── */

function EventRow({
  event,
  index,
  isLast,
  onEdit,
  onDelete,
  onResend,
}: {
  event: any;
  index: number;
  isLast: boolean;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  onResend: (i: number) => void;
}) {
  const colors = PHASE_COLORS[event.phase] || DEFAULT_COLOR;
  const hasEta = !!event.eta;
  const hasActual = !!event.actualDeparture;
  const etaSent = !!event.etaEmailSentAt;
  const actualSent = !!event.actualEmailSentAt;

  // Only show resend if there's something to re-send (has a date, or is status-only)
  const canResend = true;

  const badge =
    event.eventType === "eta" ? (
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium ml-1">
        Estimated
      </span>
    ) : event.eventType === "actual" ? (
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium ml-1">
        Confirmed
      </span>
    ) : null;

  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{ background: colors.dot }}
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {!isLast && (
          <div
            className="w-0.5 flex-1 mt-1 mb-1 rounded-full"
            style={{ background: colors.bar }}
          />
        )}
      </div>
      <div className={`flex-1 ${!isLast ? "pb-5" : "pb-1"}`}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-gray-800 leading-tight mt-0.5 flex items-center flex-wrap gap-1">
            {event.status}
            {badge}
          </span>
          <div className="flex gap-1 flex-shrink-0">
            {/* Resend email */}
            {canResend && (
              <button
                type="button"
                onClick={() => onResend(index)}
                title="Resend email notification"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-purple-500 border border-transparent hover:border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Resend
              </button>
            )}
            {/* Edit */}
            <button
              type="button"
              onClick={() => onEdit(index)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-blue-500 border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 13.5 8.5 14l.5-3.5z"
                />
              </svg>
              Edit
            </button>
            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-red-400 border border-transparent hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
        {event.location && (
          <span className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {event.location}
          </span>
        )}
        {(hasEta || hasActual) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {hasEta && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${etaSent
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
              >
                🕐 Est. {fmtDate(event.eta)}
                {etaSent && (
                  <span className="text-amber-400 font-normal">
                    · ✓ notified
                  </span>
                )}
              </span>
            )}
            {hasActual && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${actualSent
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-green-50 text-green-600 border-green-100"
                  }`}
              >
                ✓ {fmtDate(event.actualDeparture)}
                {actualSent && (
                  <span className="text-green-400 font-normal">
                    · ✓ notified
                  </span>
                )}
              </span>
            )}
          </div>
        )}
        {event.remarks && (
          <p className="text-xs text-gray-400 italic mt-1.5 pl-2 border-l-2 border-gray-100">
            {event.remarks}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Add event form
───────────────────────────────────────────────────────────────────── */

function AddEventForm({
  shipmentType,
  containers,
  onSubmit,
  loading,
  defaultEmail,
}: {
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
}) {
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
  };

  const [fields, setFields] = useState(blank);
  const [pendingEvent, setPending] = useState<any>(null);
  // Sequence warning returned from the API after a successful save
  const [sequenceWarning, setSequenceWarning] = useState<string | null>(null);

  function set(k: string, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  const selectedStepDef = steps.find((s) => s.key === fields.cycleStepKey) || null;

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
        fields.dateMode === "actual" ? toDateValue(fields.actualDeparture) : null,
      location: fields.location,
      remarks: fields.remarks,
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

            {/* Location + Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Location</Label>
                <input
                  className={INPUT_CLS}
                  placeholder="e.g. Nhava Sheva, IN"
                  value={fields.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
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
            </div>
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

/* ─────────────────────────────────────────────────────────────────────
   Pre-container section
───────────────────────────────────────────────────────────────────── */

function PreContainerSection({
  container,
  onEdit,
  onDelete,
  onResend,
}: {
  container: any;
  onEdit: (cn: string, i: number) => void;
  onDelete: (cn: string, i: number) => void;
  onResend: (cn: string, i: number) => void;
}) {
  if (!container || !container.events?.length) return null;

  return (
    <div className="bg-white rounded-xl border border-dashed border-blue-200 shadow-sm overflow-hidden">
      <div className="bg-blue-50 px-5 py-3.5 flex items-center justify-between border-b border-blue-100">
        <div>
          <h2 className="text-blue-700 font-semibold text-sm tracking-wide flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
              Events
          </h2>
        </div>
        <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">
          {container.events.length}{" "}
          {container.events.length === 1 ? "event" : "events"}
        </span>
      </div>
      <div className="p-5">
        {container.events.map((event: any, index: number) => (
          <EventRow
            key={index}
            event={event}
            index={index}
            isLast={index === container.events.length - 1}
            onEdit={(i) => onEdit(PRE_CONTAINER_SENTINEL, i)}
            onDelete={(i) => onDelete(PRE_CONTAINER_SENTINEL, i)}
            onResend={(i) => onResend(PRE_CONTAINER_SENTINEL, i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Container card
───────────────────────────────────────────────────────────────────── */

function ContainerCard({
  container,
  onEdit,
  onDelete,
  onResend,
}: {
  container: any;
  onEdit: (cn: string, i: number) => void;
  onDelete: (cn: string, i: number) => void;
  onResend: (cn: string, i: number) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-blue-600 px-5 py-3.5 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-wide font-mono">
            {container.containerNumber}
          </h2>
          {container.sizeType && (
            <span className="text-blue-200 text-xs">{container.sizeType}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {container.events?.length || 0}{" "}
            {container.events?.length === 1 ? "event" : "events"}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${collapsed ? "-rotate-90" : ""
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="p-5">
          {container.events?.length > 0 ? (
            container.events.map((event: any, index: number) => (
              <EventRow
                key={index}
                event={event}
                index={index}
                isLast={index === container.events.length - 1}
                onEdit={(i) => onEdit(container.containerNumber, i)}
                onDelete={(i) => onDelete(container.containerNumber, i)}
                onResend={(i) => onResend(container.containerNumber, i)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-300">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">
                No events recorded for this container yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────── */

export default function TrackingAdminClient({
  job,
  defaultEmail,
}: {
  job: any;
  defaultEmail?: string;
}) {
  const [containers, setContainers] = useState<any[]>(job.containers || []);
  const [saving, setSaving] = useState(false);

  // Edit flow
  const [editTarget, setEditTarget] = useState<{
    containerNumber: string;
    eventIndex: number;
  } | null>(null);
  const [editEmailPrompt, setEditEmailPrompt] = useState<any>(null);

  // Resend flow — stores the event and its container so we can open the modal
  const [resendTarget, setResendTarget] = useState<{
    containerNumber: string;
    event: any;
  } | null>(null);

  const [showAddContainer, setShowAddContainer] = useState(false);

  const shipmentType = job.shipmentType || "import";
  const clientEmail = defaultEmail || job.quoteId?.email || "";
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

  const preContainerBucket = containers.find(
    (c) => c.containerNumber === PRE_CONTAINER_SENTINEL
  );
  const realContainers = containers.filter(
    (c) => c.containerNumber !== PRE_CONTAINER_SENTINEL
  );

  /* ── Add a container shell ────────────────────────────────────────── */
  function addContainerShell(containerNumber: string, sizeType: string) {
    if (realContainers.find((c) => c.containerNumber === containerNumber)) {
      setShowAddContainer(false);
      return;
    }
    setContainers((prev) => [
      ...prev,
      { containerNumber, sizeType, events: [] },
    ]);
    setShowAddContainer(false);
  }

  /* ── Save event ───────────────────────────────────────────────────── */
  async function saveEvent(
    containerNumber: string,
    sizeType: string,
    event: any,
    emailOpts: any,
    onSuccess: (warning?: string | null) => void
  ) {
    try {
      setSaving(true);

      const res = await fetch("/api/admin/jobs/container-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job._id, containerNumber, sizeType, event }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save event");
        return;
      }

      setContainers(data.job.containers);

      if (emailOpts) {
        const emailRes = await fetch(
          "/api/admin/jobs/container-event/send-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId: job._id,
              containerNumber,
              sizeType,
              event,
              emailType: emailOpts.emailType,
              recipientEmail: emailOpts.recipientEmail,
              trackingUrl:
                containerNumber !== PRE_CONTAINER_SENTINEL
                  ? `${BASE_URL}/tracking/${containerNumber}`
                  : `${BASE_URL}/tracking/job/${job.jobId}`,
              fromCity: job.quoteId?.fromCity,
              toCity: job.quoteId?.toCity,
              isResend: false,
            }),
          }
        );
        const emailData = await emailRes.json();
        if (!emailRes.ok) {
          alert(
            `Status saved, but email failed: ${emailData.error || "Unknown error"}`
          );
        } else {
          setContainers(emailData.job.containers);
        }
      }

      onSuccess(data.sequenceWarning ?? null);
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  /* ── Edit event ───────────────────────────────────────────────────── */
  async function editEvent(containerNumber: string, updatedEvent: any) {
    if (!editTarget) return;
    try {
      setSaving(true);
      const res = await fetch("/api/admin/jobs/container-event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          containerNumber,
          eventIndex: editTarget.eventIndex,
          event: updatedEvent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to edit event");
        return;
      }
      setContainers(data.job.containers);
      setEditTarget(null);
      // Offer email after edit if the event has date data
      if (updatedEvent.eta || updatedEvent.actualDeparture) {
        setEditEmailPrompt({
          event: updatedEvent,
          containerNumber,
          clientEmail: data.clientEmail || clientEmail,
          sequenceWarning: data.sequenceWarning ?? null,
        });
      } else if (data.sequenceWarning) {
        // No email prompt, but still surface the warning via alert
        alert(`Saved. Note: ${data.sequenceWarning}`);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  /* ── Send email after edit ────────────────────────────────────────── */
  async function sendEditEmail({
    emailType,
    recipientEmail,
  }: {
    emailType: string;
    recipientEmail: string;
  }) {
    if (!editEmailPrompt) return;
    try {
      setSaving(true);
      const { event, containerNumber } = editEmailPrompt;
      const res = await fetch("/api/admin/jobs/container-event/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          containerNumber,
          event,
          emailType,
          recipientEmail,
          trackingUrl:
            containerNumber !== PRE_CONTAINER_SENTINEL
              ? `${BASE_URL}/tracking/${containerNumber}`
              : `${BASE_URL}/tracking/job/${job.jobId}`,
          fromCity: job.quoteId?.fromCity,
          toCity: job.quoteId?.toCity,
          isResend: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send email");
        return;
      }
      setContainers(data.job.containers);
      const warning = editEmailPrompt.sequenceWarning;
      setEditEmailPrompt(null);
      if (warning) alert(`Saved. Note: ${warning}`);
    } catch {
      alert("Failed to send email");
    } finally {
      setSaving(false);
    }
  }

  /* ── Resend email (no DB mutation) ───────────────────────────────── */
  function openResendModal(containerNumber: string, eventIndex: number) {
    const container = containers.find((c) => c.containerNumber === containerNumber);
    const event = container?.events?.[eventIndex];
    if (!event) return;
    setResendTarget({ containerNumber, event });
  }

  async function sendResendEmail({
    emailType,
    recipientEmail,
  }: {
    emailType: string;
    recipientEmail: string;
  }) {
    if (!resendTarget) return;
    try {
      setSaving(true);
      const { containerNumber, event } = resendTarget;
      const res = await fetch("/api/admin/jobs/container-event/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          containerNumber,
          event,
          emailType,
          recipientEmail,
          trackingUrl:
            containerNumber !== PRE_CONTAINER_SENTINEL
              ? `${BASE_URL}/tracking/${containerNumber}`
              : `${BASE_URL}/tracking/job/${job.jobId}`,
          fromCity: job.quoteId?.fromCity,
          toCity: job.quoteId?.toCity,
          isResend: true, // ← key flag — no DB mutation
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to resend email");
        return;
      }
      // Update containers to reflect new audit stamp (no event data changed)
      setContainers(data.job.containers);
      setResendTarget(null);
    } catch {
      alert("Failed to resend email");
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete event ─────────────────────────────────────────────────── */
  async function deleteEvent(containerNumber: string, eventIndex: number) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      setSaving(true);
      const res = await fetch("/api/admin/jobs/container-event", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          containerNumber,
          eventIndex,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete event");
        return;
      }
      setContainers(data.job.containers);
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const editContainerData = editTarget
    ? containers.find((c) => c.containerNumber === editTarget.containerNumber)
    : null;
  const editEventData =
    editContainerData?.events?.[editTarget?.eventIndex ?? -1];

  return (
    <div className="space-y-5">

      {/* ── Modals ─────────────────────────────────────────────────── */}

      {/* Post-edit email prompt */}
      {editEmailPrompt && (
        <EmailConfirmModal
          event={editEmailPrompt.event}
          defaultEmail={editEmailPrompt.clientEmail}
          saving={saving}
          onConfirm={sendEditEmail}
          onSkip={() => {
            const warning = editEmailPrompt.sequenceWarning;
            setEditEmailPrompt(null);
            if (warning) alert(`Saved. Note: ${warning}`);
          }}
        />
      )}

      {/* Edit event */}
      {editTarget && editEventData && (
        <EditEventModal
          event={editEventData}
          loading={saving}
          onClose={() => setEditTarget(null)}
          onSave={(updated) => editEvent(editTarget.containerNumber, updated)}
        />
      )}

      {/* Resend email — isResendOnly hides "skip" and changes labels */}
      {resendTarget && (
        <EmailConfirmModal
          event={resendTarget.event}
          defaultEmail={clientEmail}
          saving={saving}
          isResendOnly
          onConfirm={sendResendEmail}
          onSkip={() => setResendTarget(null)}
        />
      )}

      {/* Add container */}
      {showAddContainer && (
        <AddContainerModal
          existing={realContainers.map((c) => c.containerNumber)}
          onAdd={addContainerShell}
          onClose={() => setShowAddContainer(false)}
        />
      )}

      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {shipmentType === "export" ? "Export" : "Import"} Shipment Tracking
          </p>
          <p className="text-xs text-gray-400">
            {realContainers.length} container
            {realContainers.length !== 1 ? "s" : ""} · Job {job.jobId}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddContainer(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
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
          Add container
        </button>
      </div>

      {/* ── Job-level events ───────────────────────────────────────── */}
      <PreContainerSection
        container={preContainerBucket}
        onEdit={(cn, i) => setEditTarget({ containerNumber: cn, eventIndex: i })}
        onDelete={(cn, i) => deleteEvent(cn, i)}
        onResend={(cn, i) => openResendModal(cn, i)}
      />

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {realContainers.length === 0 && !preContainerBucket?.events?.length && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
          <svg
            className="w-10 h-10 mx-auto text-gray-200 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-sm text-gray-400">
            No events recorded yet. Add a status below to get started.
          </p>
        </div>
      )}

      {/* ── Container cards ────────────────────────────────────────── */}
      {realContainers.map((container) => (
        <ContainerCard
          key={container.containerNumber}
          container={container}
          onEdit={(cn, i) => setEditTarget({ containerNumber: cn, eventIndex: i })}
          onDelete={(cn, i) => deleteEvent(cn, i)}
          onResend={(cn, i) => openResendModal(cn, i)}
        />
      ))}

      {/* ── Add event form ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1">Add Event</p>
        <p className="text-xs text-gray-400 mb-4">
          Steps are automatically routed to the correct container or job-level
          bucket. Job-level steps (Booking, Bill of Entry, OOC, etc.) are
          recorded once for the entire job.
        </p>
        <AddEventForm
          shipmentType={shipmentType}
          containers={containers}
          loading={saving}
          defaultEmail={clientEmail}
          onSubmit={saveEvent}
        />
      </div>
    </div>
  );
}