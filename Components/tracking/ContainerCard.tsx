import { useState } from "react";

import EventRow from "@/Components/tracking/EventRow";

interface ContainerCardProps {
  container: any;
  emailLogs: any[];
  onEdit: (cn: string, i: number) => void;
  onDelete: (cn: string, i: number) => void;
  onResend: (cn: string, i: number) => void;
}

export default function ContainerCard({
  container,
  emailLogs,
  onEdit,
  onDelete,
  onResend,
}: ContainerCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-blue-600 px-5 py-3.5 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-wide font-mono">
            {container.containerNumber}
          </h2>

          {container.sizeType && (
            <span className="text-blue-200 text-xs">
              {container.sizeType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {container.events?.length || 0}{" "}
            {container.events?.length === 1
              ? "event"
              : "events"}
          </span>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                collapsed ? "-rotate-90" : ""
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
            container.events.map((event: any, index: number) => {
              const emailLog = emailLogs.find(
                (log) =>
                  log.cycleStep === event.cycleStep &&
                  log.containerNumber ===
                    container.containerNumber &&
                  log.emailType === event.eventType
              );

              return (
                <EventRow
                  key={index}
                  event={event}
                  emailLog={emailLog}
                  canViewEmailTracking={true}
                  index={index}
                  isLast={
                    index === container.events.length - 1
                  }
                  onEdit={(i) =>
                    onEdit(container.containerNumber, i)
                  }
                  onDelete={(i) =>
                    onDelete(container.containerNumber, i)
                  }
                  onResend={(i) =>
                    onResend(container.containerNumber, i)
                  }
                />
              );
            })
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