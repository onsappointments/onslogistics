import EmailStatus from "@/Components/tracking/EmailStatus/EmailStatus";
import {
  DEFAULT_COLOR,
  PHASE_COLORS,
} from "@/Components/tracking/lib/constants";
import { EmailLog } from "@/Components/tracking/lib/types";
import { fmtDate } from "@/Components/tracking/lib/utils";
import { resolveStepTitle } from "@/lib/trackingStatus";
import { resolveTrackingDescription } from "@/lib/emails/containerStatusEmail";

interface EventRowProps {
  event: any;
  index: number;
  isLast: boolean;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  onResend: (i: number) => void;
  emailLog?: EmailLog;
  canViewEmailTracking?: boolean;
}

export default function EventRow({
  event,
  index,
  isLast,
  onEdit,
  onDelete,
  onResend,
  emailLog,
  canViewEmailTracking = false,
}: EventRowProps) {
  const colors = PHASE_COLORS[event.phase] || DEFAULT_COLOR;

  const hasEta = !!event.eta;
  const hasActual = !!event.actualDeparture;

  const etaSent = !!event.etaEmailSentAt;
  const actualSent = !!event.actualEmailSentAt;

  const description = resolveTrackingDescription({
  shipmentType: event.shipmentType ?? "import",
  cycleStep: event.cycleStep ?? "",
  eventType:
    (event.eventType as
      | "eta"
      | "actual"
      | "status"
      | "single") ?? "status",
  status: event.status ?? "",
  eta: event.eta,
  actualDeparture: event.actualDeparture,
  remarks: event.remarks,
});

  const displayLabel = resolveStepTitle(
    event.cycleStep ?? "",
    (event.eventType as
      | "eta"
      | "actual"
      | "single"
      | "status") ?? "status",
    event.status ?? ""
  );

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
            {displayLabel}
            {badge}
          </span>

          <div className="flex gap-1 flex-shrink-0">
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
         {/* Structured operational information */}
{(
  event.vesselName ||
  event.voyage ||
  event.trainNumber ||
  event.wagonNumber ||
  event.sealNumber
) && (
  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-gray-500">

    {event.vesselName && (
      <span>
        <span className="font-medium text-gray-600">
          Vessel:
        </span>{" "}
        {event.vesselName}
      </span>
    )}

    {event.voyage && (
      <span>
        <span className="font-medium text-gray-600">
          Voyage:
        </span>{" "}
        {event.voyage}
      </span>
    )}

    {event.trainNumber && (
      <span>
        <span className="font-medium text-gray-600">
          Train:
        </span>{" "}
        {event.trainNumber}
      </span>
    )}

    {event.wagonNumber && (
      <span>
        <span className="font-medium text-gray-600">
          Wagon:
        </span>{" "}
        {event.wagonNumber}
      </span>
    )}

    {event.sealNumber && (
      <span>
        <span className="font-medium text-gray-600">
          Seal:
        </span>{" "}
        {event.sealNumber}
      </span>
    )}

  </div>
)}
        {description && (
         <p
          className="mt-2 text-sm leading-6 text-gray-600"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

        {(hasEta || hasActual) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {hasEta && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                  etaSent
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
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                  actualSent
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

        {canViewEmailTracking && emailLog && (
          <div className="mt-4">
            <EmailStatus emailLog={emailLog} />
          </div>
        )}
      </div>
    </div>
  );
}