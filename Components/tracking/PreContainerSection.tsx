import EventRow from "@/Components/tracking/EventRow";
import { PRE_CONTAINER_SENTINEL } from "@/Components/tracking/lib/constants";

interface PreContainerSectionProps {
  container: any;
  emailLogs: any[];
  onEdit: (cn: string, i: number) => void;
  onDelete: (cn: string, i: number) => void;
  onResend: (cn: string, i: number) => void;
}

export default function PreContainerSection({
  container,
  emailLogs,
  onEdit,
  onDelete,
  onResend,
}: PreContainerSectionProps) {
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
        {container.events.map((event: any, index: number) => {
          const emailLog = emailLogs.find(
            (log) =>
              log.cycleStep === event.cycleStep &&
              log.emailType === event.eventType &&
              (
                log.containerNumber == null ||
                log.containerNumber === PRE_CONTAINER_SENTINEL
              )
         );

          return (
            <EventRow
              key={index}
              event={event}
              emailLog={emailLog}
              canViewEmailTracking={true}
              index={index}
              isLast={index === container.events.length - 1}
              onEdit={(i) => onEdit(PRE_CONTAINER_SENTINEL, i)}
              onDelete={(i) => onDelete(PRE_CONTAINER_SENTINEL, i)}
              onResend={(i) => onResend(PRE_CONTAINER_SENTINEL, i)}
            />
          );
        })}
      </div>
    </div>
  );
}