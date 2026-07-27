"use client";

import { Mail } from "lucide-react";
import EmailStatusBadge from "./EmailStatusBadge";

export default function RecipientRow({ recipient }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-gray-100 p-2">
            <Mail className="h-4 w-4 text-gray-600" />
          </div>

          <div>
            <p className="font-medium text-gray-900">
              {recipient.email}
            </p>

            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
              {recipient.type}
            </p>

            {recipient.bounceReason && (
              <p className="mt-2 text-sm text-red-600">
                {recipient.bounceReason}
              </p>
            )}
          </div>
        </div>

        <EmailStatusBadge status={recipient.status} />
      </div>
    </div>
  );
}