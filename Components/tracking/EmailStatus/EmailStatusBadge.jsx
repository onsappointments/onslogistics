"use client";

import {
  Clock3,
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  MailX,
} from "lucide-react";

const STATUS_CONFIG = {
  queued: {
    label: "Queued",
    icon: Clock3,
    className:
      "bg-gray-100 text-gray-700 border-gray-200",
  },

  sent: {
    label: "Sent",
    icon: Send,
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },

  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  opened: {
    label: "Opened",
    icon: Eye,
    className:
      "bg-purple-50 text-purple-700 border-purple-200",
  },

  clicked: {
    label: "Clicked",
    icon: MousePointerClick,
    className:
      "bg-indigo-50 text-indigo-700 border-indigo-200",
  },

  soft_bounce: {
    label: "Soft Bounce",
    icon: AlertTriangle,
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200",
  },

  hard_bounce: {
    label: "Hard Bounce",
    icon: XCircle,
    className:
      "bg-red-50 text-red-700 border-red-200",
  },

  blocked: {
    label: "Blocked",
    icon: ShieldAlert,
    className:
      "bg-orange-50 text-orange-700 border-orange-200",
  },

  invalid: {
    label: "Invalid",
    icon: MailX,
    className:
      "bg-red-50 text-red-700 border-red-200",
  },
};

export default function EmailStatusBadge({
  status = "sent",
  onClick,
}) {
  const current = STATUS_CONFIG[status] || STATUS_CONFIG.sent;
  const Icon = current.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition hover:shadow-sm ${current.className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{current.label}</span>
    </button>
  );
}