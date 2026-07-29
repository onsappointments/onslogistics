import { useState } from "react";

import Label from "@/Components/tracking/Label";
import { INPUT_CLS } from "@/Components/tracking/lib/constants";
import { fmtDate } from "@/Components/tracking/lib/utils";

interface EmailConfirmModalProps {
  event: any;
  defaultEmail: string;
  onConfirm: (opts: {
    emailType: string;
    recipientEmail: string;
     additionalRecipients: string[];
  }) => void;
  onSkip: () => void;
  saving: boolean;
  isResendOnly?: boolean;
}

export default function EmailConfirmModal({
  event,
  defaultEmail,
  onConfirm,
  onSkip,
  saving,
  isResendOnly = false,
}: EmailConfirmModalProps) {
  const [recipientEmail, setRecipientEmail] = useState(
    defaultEmail || ""
  );
  const [additionalRecipients, setAdditionalRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");

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
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    sub: string;
  }[];

  const [selected, setSelected] = useState(options[0].key);

  function addRecipient() {
  const email = newRecipient.trim().toLowerCase();

  if (!email) return;

  // basic validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (email === recipientEmail.toLowerCase()) {
    alert("This is already the primary recipient.");
    return;
  }

  if (additionalRecipients.includes(email)) {
    return;
  }

  setAdditionalRecipients((prev) => [...prev, email]);
  setNewRecipient("");
}

function removeRecipient(email: string) {
  setAdditionalRecipients((prev) =>
    prev.filter((e) => e !== email)
  );
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-white font-semibold text-base">
            {isResendOnly
              ? "Resend notification"
              : "Notify client?"}
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
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selected === opt.key
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
                  <p className="text-sm font-medium text-gray-800">
                    {opt.label}
                  </p>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {opt.sub}
                  </p>
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
              onChange={(e) =>
                setRecipientEmail(e.target.value)
              }
            />

            {defaultEmail &&
              recipientEmail !== defaultEmail && (

                
                <p className="text-xs text-amber-500 mt-1">
                  ⚠ Default is {defaultEmail}
                </p>
              )}

              <div className="mt-4">
  <Label>Additional recipients (optional)</Label>

  <div className="flex gap-2">
    <input
      type="email"
      className={INPUT_CLS}
      placeholder="warehouse@company.com"
      value={newRecipient}
      onChange={(e) => setNewRecipient(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addRecipient();
        }
      }}
    />

    <button
      type="button"
      onClick={addRecipient}
      className="px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
    >
      Add
    </button>
  </div>

  {additionalRecipients.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-3">
      {additionalRecipients.map((email) => (
        <div
          key={email}
          className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1"
        >
          <span className="text-xs text-blue-700">
            {email}
          </span>

          <button
            type="button"
            onClick={() => removeRecipient(email)}
            className="text-blue-500 hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}

  <p className="text-xs text-gray-400 mt-2">
    These recipients will receive this email only. They won't be saved to the customer.
  </p>
</div>
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
                The status has <strong>not been saved yet</strong>.
                It will be saved when you confirm below.
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
            onClick={() =>
              onConfirm({
                emailType: selected,
                recipientEmail,
                additionalRecipients,
              })
            }
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