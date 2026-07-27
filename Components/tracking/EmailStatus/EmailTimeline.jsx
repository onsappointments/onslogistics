"use client";

import {
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  MailX,
} from "lucide-react";

const EVENT_CONFIG = {
  sent: {
    label: "Sent",
    icon: Send,
    color: "text-blue-600",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  opened: {
    label: "Opened",
    icon: Eye,
    color: "text-purple-600",
  },
  click: {
    label: "Clicked",
    icon: MousePointerClick,
    color: "text-indigo-600",
  },
  soft_bounce: {
    label: "Soft Bounce",
    icon: AlertTriangle,
    color: "text-yellow-600",
  },
  hard_bounce: {
    label: "Hard Bounce",
    icon: XCircle,
    color: "text-red-600",
  },
  blocked: {
    label: "Blocked",
    icon: ShieldAlert,
    color: "text-orange-600",
  },
  invalid: {
    label: "Invalid",
    icon: MailX,
    color: "text-red-600",
  },
};

export default function EmailTimeline({ events = [] }) {
  if (!events.length) return null;

  return (
    <div className="mt-6 border-t pt-6">
      <h4 className="mb-4 text-sm font-semibold text-gray-900">
        Activity
      </h4>

      <div className="space-y-5">
        {events.map((event, index) => {
          const current =
            EVENT_CONFIG[event.event] || EVENT_CONFIG.sent;

          const Icon = current.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div className="flex flex-col items-center">
                <Icon
                  className={`h-5 w-5 ${current.color}`}
                />

                {index !== events.length - 1 && (
                  <div className="mt-2 h-8 w-px bg-gray-300" />
                )}
              </div>

              <div>
                <p className="font-medium">
                  {current.label}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}