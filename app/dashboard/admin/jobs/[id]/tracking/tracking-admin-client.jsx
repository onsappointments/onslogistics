"use client";

import { useState } from "react";

const PRESET_STATUSES = [
  "Empty Picked Up", "Gate In", "Loaded on Vessel", "Vessel Departed",
  "Arrived at Transshipment Port", "Vessel Arrived", "Discharged", "Gate Out", "Delivered",
];

const STATUS_COLORS = {
  "Empty Picked Up":               { dot: "#94a3b8", bar: "#e2e8f0" },
  "Gate In":                       { dot: "#60a5fa", bar: "#dbeafe" },
  "Loaded on Vessel":              { dot: "#3b82f6", bar: "#bfdbfe" },
  "Vessel Departed":               { dot: "#2563eb", bar: "#bfdbfe" },
  "Arrived at Transshipment Port": { dot: "#f59e0b", bar: "#fef3c7" },
  "Vessel Arrived":                { dot: "#10b981", bar: "#d1fae5" },
  "Discharged":                    { dot: "#059669", bar: "#a7f3d0" },
  "Gate Out":                      { dot: "#7c3aed", bar: "#ede9fe" },
  "Delivered":                     { dot: "#16a34a", bar: "#bbf7d0" },
};

function getStatusColor(s) {
  return STATUS_COLORS[s] || { dot: "#6366f1", bar: "#e0e7ff" };
}

function fmtDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isValidDate(val) {
  if (!val) return false;
  const d = val instanceof Date ? val : new Date(val);
  return !isNaN(d.getTime());
}

function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === "string") {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

const INPUT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
  "placeholder:text-gray-300";

const SELECT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700";

function Label({ children, color = "gray", hint }) {
  const cls = { gray: "text-gray-500", amber: "text-amber-600", green: "text-green-600" };
  return (
    <div className="mb-1">
      <span className={`text-xs font-medium ${cls[color]}`}>{children}</span>
      {hint && <span className="text-xs text-gray-300 ml-1">— {hint}</span>}
    </div>
  );
}

function StatusToggle({ useCustom, onChange }) {
  return (
    <div className="flex gap-1.5 mb-3">
      {["Preset status", "Custom status"].map((label, i) => {
        const active = i === 0 ? !useCustom : useCustom;
        return (
          <button key={label} type="button" onClick={() => onChange(i === 1)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EMAIL CONFIRM MODAL                                                  */
/* ------------------------------------------------------------------ */
function EmailConfirmModal({ event, defaultEmail, onConfirm, onSkip, saving }) {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail || "");

  const hasEta    = isValidDate(event.eta);
  const hasActual = isValidDate(event.actualDeparture);

  // Only show the option that matches what was filled in —
  // since ETA and Actual are now mutually exclusive per event,
  // there will only ever be one date-based option here.
  const options = [
    hasActual && {
      key: "actual",
      label: "🚢 Send departure confirmation",
      sub: `Departed: ${fmtDate(event.actualDeparture)}`,
    },
    hasEta && {
      key: "eta",
      label: "🕐 Send ETA notification",
      sub: `Estimated arrival: ${fmtDate(event.eta)}`,
    },
    {
      key: "status",
      label: "📦 Send general status update",
      sub: `Status: ${event.status}`,
    },
  ].filter(Boolean);

  const [selected, setSelected] = useState(options[0].key);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">Notify client?</h2>
          <p className="text-blue-200 text-xs mt-0.5">
            Choose whether to send an email — then the status will be saved
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-2">
            {options.map(opt => (
              <label key={opt.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selected === opt.key
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-100 hover:border-gray-200 bg-gray-50"
                }`}>
                <input type="radio" name="emailType" value={opt.key}
                  checked={selected === opt.key}
                  onChange={() => setSelected(opt.key)}
                  className="mt-0.5 accent-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>

          <div>
            <Label>Send to</Label>
            <input type="email" className={INPUT_CLS}
              placeholder="client@example.com"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)} />
            {defaultEmail && recipientEmail !== defaultEmail && (
              <p className="text-xs text-amber-500 mt-1">⚠ Default is {defaultEmail}</p>
            )}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-700">
              The status has <strong>not been saved yet</strong>. It will be saved when you confirm below.
            </p>
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button type="button" onClick={onSkip} disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600
                       text-sm font-medium hover:bg-gray-50 transition-colors">
            Skip — save without email
          </button>
          <button type="button"
            disabled={saving || !recipientEmail}
            onClick={() => onConfirm({ emailType: selected, recipientEmail })}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm
                       font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60
                       flex items-center justify-center gap-2">
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : "Save & send email →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EVENT FORM FIELDS
 *
 *  KEY CHANGE: ETA and Actual Departure are now mutually exclusive.
 *  Filling one clears the other. A toggle lets the admin pick which
 *  date type this event represents, keeping the UI unambiguous.
 * ------------------------------------------------------------------ */
function EventFormFields({ fields, onChange }) {
  const { useCustom, status, customStatus, dateMode, eta, actualDeparture, location, remarks } = fields;

  // dateMode: "none" | "eta" | "actual"
  // Controls which date field is shown and sent.
  function handleDateModeChange(mode) {
    onChange("dateMode", mode);
    // Clear both dates when switching, let user re-enter
    if (mode !== "eta")    onChange("eta", "");
    if (mode !== "actual") onChange("actualDeparture", "");
  }

  return (
    <div className="space-y-3">
      <StatusToggle useCustom={useCustom} onChange={val => onChange("useCustom", val)} />

      {useCustom ? (
        <div>
          <Label>Custom status</Label>
          <input className={INPUT_CLS} placeholder="e.g. Customs Hold, On Rail…"
            value={customStatus} onChange={e => onChange("customStatus", e.target.value)} />
        </div>
      ) : (
        <div>
          <Label>Status</Label>
          <select className={SELECT_CLS} value={status}
            onChange={e => onChange("status", e.target.value)}>
            <option value="">Select status…</option>
            {PRESET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {/* Date type toggle — mutually exclusive */}
      <div>
        <Label>Date type</Label>
        <div className="flex gap-1.5">
          {[
            { key: "none",   label: "None" },
            { key: "eta",    label: "🕐 ETA (estimated)" },
            { key: "actual", label: "🚢 Actual departure" },
          ].map(({ key, label }) => (
            <button key={key} type="button"
              onClick={() => handleDateModeChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                dateMode === key
                  ? key === "eta"
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : key === "actual"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-gray-100 border-gray-300 text-gray-600"
                  : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Show only the selected date field */}
      {dateMode === "eta" && (
        <div>
          <Label color="amber" hint="estimated arrival at destination">ETA date & time</Label>
          <input type="datetime-local" className={INPUT_CLS} value={eta}
            onChange={e => onChange("eta", e.target.value)} />
        </div>
      )}

      {dateMode === "actual" && (
        <div>
          <Label color="green" hint="when vessel / truck left">Actual departure date & time</Label>
          <input type="datetime-local" className={INPUT_CLS} value={actualDeparture}
            onChange={e => onChange("actualDeparture", e.target.value)} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Location</Label>
          <input className={INPUT_CLS} placeholder="e.g. Port Qasim, PK" value={location}
            onChange={e => onChange("location", e.target.value)} />
        </div>
        <div>
          <Label>Remarks <span className="text-gray-300 font-normal">(optional)</span></Label>
          <input className={INPUT_CLS} placeholder="Visible to client in email" value={remarks}
            onChange={e => onChange("remarks", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EDIT EVENT MODAL                                                     */
/* ------------------------------------------------------------------ */
function EditEventModal({ event, onSave, onClose, loading }) {
  const isPreset = PRESET_STATUSES.includes(event.status);

  // Derive dateMode from what's stored on the event
  const initDateMode = event.eta
    ? "eta"
    : event.actualDeparture
    ? "actual"
    : "none";

  const [fields, setFields] = useState({
    useCustom:       !isPreset,
    status:          isPreset ? event.status : "",
    customStatus:    !isPreset ? event.status : "",
    dateMode:        initDateMode,
    eta:             event.eta ? new Date(event.eta).toISOString().slice(0, 16) : "",
    actualDeparture: event.actualDeparture
      ? new Date(event.actualDeparture).toISOString().slice(0, 16) : "",
    location:        event.location || "",
    remarks:         event.remarks || "",
  });

  const finalStatus = fields.useCustom ? fields.customStatus : fields.status;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">Edit event</h2>
          <p className="text-blue-200 text-xs mt-0.5">
            Save first — you'll be asked about email after
          </p>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <EventFormFields fields={fields}
            onChange={(k, v) => setFields(p => ({ ...p, [k]: v }))} />
        </div>
        <div className="px-6 pb-5 flex gap-3 border-t border-gray-100 pt-4">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600
                       text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" disabled={loading || !finalStatus}
            onClick={() => onSave({
              status:          finalStatus,
              eta:             fields.dateMode === "eta" ? toDate(fields.eta) : null,
              actualDeparture: fields.dateMode === "actual" ? toDate(fields.actualDeparture) : null,
              location:        fields.location,
              remarks:         fields.remarks,
            })}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm
                       font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TIMELINE EVENT ROW                                                   */
/* ------------------------------------------------------------------ */
function EventRow({ event, index, isLast, onEdit, onDelete }) {
  const colors     = getStatusColor(event.status);
  const hasEta     = !!event.eta;
  const hasActual  = !!event.actualDeparture;
  const etaSent    = !!event.etaEmailSentAt;
  const actualSent = !!event.actualEmailSentAt;

  // eventType badge — shows what kind of event this is
  const eventTypeBadge = event.eventType === "eta"
    ? <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium ml-2">ETA</span>
    : event.eventType === "actual"
    ? <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium ml-2">Actual</span>
    : null;

  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0"
          style={{ background: colors.dot }}>
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 mb-1 rounded-full"
               style={{ background: colors.bar }} />
        )}
      </div>

      <div className={`flex-1 ${!isLast ? "pb-5" : "pb-1"}`}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-gray-800 leading-tight mt-0.5 flex items-center flex-wrap gap-1">
            {event.status}
            {eventTypeBadge}
          </span>
          <div className="flex gap-1 flex-shrink-0">
            <button type="button" onClick={() => onEdit(index)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-blue-500
                         border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 13.5 8.5 14l.5-3.5z" />
              </svg>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(index)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-red-400
                         border border-transparent hover:border-red-200 hover:bg-red-50 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {event.location && (
          <span className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </span>
        )}

        {(hasEta || hasActual) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {hasEta && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium
                               px-2.5 py-1 rounded-full border ${
                etaSent ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                🕐 ETA: {fmtDate(event.eta)}
                {etaSent && (
                  <span className="text-amber-400 font-normal"
                        title={`Email sent ${fmtDate(event.etaEmailSentAt)}`}>
                    · ✓ notified
                  </span>
                )}
              </span>
            )}
            {hasActual && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium
                               px-2.5 py-1 rounded-full border ${
                actualSent ? "bg-green-50 text-green-700 border-green-200"
                           : "bg-green-50 text-green-600 border-green-100"
              }`}>
                🚢 Departed: {fmtDate(event.actualDeparture)}
                {actualSent && (
                  <span className="text-green-400 font-normal"
                        title={`Email sent ${fmtDate(event.actualEmailSentAt)}`}>
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

/* ------------------------------------------------------------------ */
/*  ADD EVENT FORM                                                       */
/* ------------------------------------------------------------------ */
function AddEventForm({ onSubmit, loading, defaultEmail }) {
  const blank = {
    useCustom:      false,
    status:         "",
    customStatus:   "",
    dateMode:       "none",   // "none" | "eta" | "actual"
    eta:            "",
    actualDeparture:"",
    location:       "",
    remarks:        "",
  };
  const [fields, setFields]        = useState(blank);
  const [pendingEvent, setPending] = useState(null);

  const finalStatus = fields.useCustom ? fields.customStatus : fields.status;

  function handleAddClick() {
    const event = {
      status:          finalStatus,
      eta:             fields.dateMode === "eta" ? toDate(fields.eta) : null,
      actualDeparture: fields.dateMode === "actual" ? toDate(fields.actualDeparture) : null,
      location:        fields.location,
      remarks:         fields.remarks,
    };
    setPending(event);
  }

  function handleConfirm(emailOpts) {
    onSubmit(pendingEvent, emailOpts, () => {
      setFields(blank);
      setPending(null);
    });
  }

  function handleSkip() {
    onSubmit(pendingEvent, null, () => {
      setFields(blank);
      setPending(null);
    });
  }

  return (
    <>
      {pendingEvent && (
        <EmailConfirmModal
          event={pendingEvent}
          defaultEmail={defaultEmail}
          saving={loading}
          onConfirm={handleConfirm}
          onSkip={handleSkip}
        />
      )}

      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Add new event
        </p>
        <EventFormFields fields={fields}
          onChange={(k, v) => setFields(p => ({ ...p, [k]: v }))} />
        <div className="mt-4">
          <button type="button" disabled={loading || !finalStatus}
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                       text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add status
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ADD CONTAINER FORM                                                   */
/* ------------------------------------------------------------------ */
function AddContainerForm({ onSubmit, loading }) {
  const [containerNumber, setContainerNumber] = useState("");
  const [sizeType, setSizeType]               = useState("");
  const [stage, setStage]                     = useState("idle");

  function reset() {
    setContainerNumber("");
    setSizeType("");
    setStage("idle");
  }

  if (stage === "idle") {
    return (
      <div className="rounded-xl border border-dashed border-blue-200 hover:border-blue-400 transition-colors bg-white">
        <button type="button" onClick={() => setStage("form")}
          className="w-full flex items-center gap-3 px-6 py-4 text-blue-500 hover:text-blue-700 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-dashed border-blue-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium">Add new container</span>
        </button>
      </div>
    );
  }

  if (stage === "form") {
    return (
      <div className="rounded-xl border border-blue-200 bg-white">
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-700">New container</p>
            <button type="button" onClick={reset} className="text-gray-300 hover:text-gray-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Container number</Label>
              <input className={INPUT_CLS} placeholder="e.g. CAAU9272307"
                value={containerNumber}
                onChange={e => setContainerNumber(e.target.value.toUpperCase())} />
            </div>
            <div>
              <Label>Size type</Label>
              <input className={INPUT_CLS} placeholder="e.g. 40HC"
                value={sizeType}
                onChange={e => setSizeType(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={reset}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="button" disabled={!containerNumber}
              onClick={() => setStage("confirm")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
              Review →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">Add container?</h2>
          <p className="text-blue-200 text-xs mt-0.5">This will create the container with no events</p>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="bg-gray-50 rounded-lg border border-gray-100 px-4 py-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Container</span>
              <span className="font-semibold text-gray-800 font-mono">{containerNumber}</span>
            </div>
            {sizeType && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size type</span>
                <span className="font-semibold text-gray-800">{sizeType}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">
            No email will be sent for the initial container creation.
          </p>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button type="button" onClick={() => setStage("form")} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Back
          </button>
          <button type="button" disabled={loading}
            onClick={() => onSubmit(containerNumber, sizeType, null, null, reset)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Adding…
              </>
            ) : "Confirm & add"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                       */
/* ------------------------------------------------------------------ */
export default function TrackingAdminClient({ job }) {
  const [containers, setContainers]           = useState(job.containers || []);
  const [saving, setSaving]                   = useState(false);
  const [editTarget, setEditTarget]           = useState(null);
  const [editEmailPrompt, setEditEmailPrompt] = useState(null);

  const clientEmail = job.quoteId?.email || "";
  const BASE_URL    = process.env.NEXT_PUBLIC_SITE_URL || "";

  async function saveEvent(containerNumber, sizeType, event, emailOpts, onSuccess) {
    try {
      setSaving(true);

      if (event !== null) {
        const res = await fetch("/api/admin/jobs/container-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job._id, containerNumber, sizeType, event }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || "Failed to save event"); return; }

        const savedClientEmail = data.clientEmail || clientEmail;
        setContainers(data.job.containers);

        if (emailOpts) {
          const emailRes = await fetch("/api/admin/jobs/container-event/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId:          job._id,
              containerNumber,
              sizeType,
              event,
              emailType:      emailOpts.emailType,
              recipientEmail: emailOpts.recipientEmail,
              trackingUrl:    `${BASE_URL}/tracking/${containerNumber}`,
              fromCity:       job.quoteId?.fromCity,
              toCity:         job.quoteId?.toCity,
            }),
          });
          const emailData = await emailRes.json();
          if (!emailRes.ok) {
            alert(`Status saved, but email failed: ${emailData.error || "Unknown error"}`);
          } else {
            setContainers(emailData.job.containers);
          }
        }
      } else {
        setContainers(prev => {
          if (prev.find(c => c.containerNumber === containerNumber)) return prev;
          return [...prev, { containerNumber, sizeType, events: [] }];
        });
        onSuccess?.();
        return;
      }

      onSuccess?.();
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function editEvent(containerNumber, updatedEvent) {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/jobs/container-event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId:        job._id,
          containerNumber,
          eventIndex:   editTarget.eventIndex,
          event:        updatedEvent,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to edit event"); return; }

      setContainers(data.job.containers);
      setEditTarget(null);

      if (isValidDate(updatedEvent.eta) || isValidDate(updatedEvent.actualDeparture)) {
        setEditEmailPrompt({
          event:           updatedEvent,
          containerNumber,
          clientEmail:     data.clientEmail || clientEmail,
        });
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function sendEditEmail({ emailType, recipientEmail }) {
    if (!editEmailPrompt) return;
    try {
      setSaving(true);
      const { event, containerNumber } = editEmailPrompt;
      const res = await fetch("/api/admin/jobs/container-event/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId:          job._id,
          containerNumber,
          event,
          emailType,
          recipientEmail,
          trackingUrl:    `${BASE_URL}/tracking/${containerNumber}`,
          fromCity:       job.quoteId?.fromCity,
          toCity:         job.quoteId?.toCity,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to send email"); return; }
      setContainers(data.job.containers);
      setEditEmailPrompt(null);
    } catch {
      alert("Failed to send email");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(containerNumber, eventIndex) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      setSaving(true);
      const res = await fetch("/api/admin/jobs/container-event", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job._id, containerNumber, eventIndex }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to delete event"); return; }
      setContainers(data.job.containers);
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const editContainer = editTarget
    ? containers.find(c => c.containerNumber === editTarget.containerNumber)
    : null;
  const editEventData = editContainer?.events?.[editTarget?.eventIndex];

  return (
    <div className="space-y-5">

      {editEmailPrompt && (
        <EmailConfirmModal
          event={editEmailPrompt.event}
          defaultEmail={editEmailPrompt.clientEmail}
          saving={saving}
          onConfirm={sendEditEmail}
          onSkip={() => setEditEmailPrompt(null)}
        />
      )}

      {editTarget && editEventData && (
        <EditEventModal
          event={editEventData}
          loading={saving}
          onClose={() => setEditTarget(null)}
          onSave={updated => editEvent(editTarget.containerNumber, updated)}
        />
      )}

      {containers.map(container => (
        <div key={container.containerNumber}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-5 py-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-sm tracking-wide">
                {container.containerNumber}
              </h2>
              {container.sizeType && (
                <span className="text-blue-200 text-xs">{container.sizeType}</span>
              )}
            </div>
            <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {container.events?.length || 0}{" "}
              {container.events?.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div className="p-5">
            {container.events?.length > 0 ? (
              <div className="mb-2">
                {container.events.map((event, index) => (
                  <EventRow
                    key={index} event={event} index={index}
                    isLast={index === container.events.length - 1}
                    onEdit={i => setEditTarget({
                      containerNumber: container.containerNumber, eventIndex: i,
                    })}
                    onDelete={i => deleteEvent(container.containerNumber, i)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-300 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No events recorded yet</p>
              </div>
            )}
            <AddEventForm
              loading={saving}
              defaultEmail={clientEmail}
              onSubmit={(event, emailOpts, onSuccess) =>
                saveEvent(container.containerNumber, container.sizeType, event, emailOpts, onSuccess)
              }
            />
          </div>
        </div>
      ))}

      <AddContainerForm loading={saving} onSubmit={saveEvent} />
    </div>
  );
}