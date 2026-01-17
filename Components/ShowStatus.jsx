"use client";

import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ShowStatus({ type, title, message, onClose }) {
  const [open, setOpen] = useState(false);

  // Show modal only when type changes
  useEffect(() => {
    if (type) setOpen(true);
  }, [type]);

  // Close handler
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  if (!open) return null;

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-500",
      titleColor: "text-green-900",
      messageColor: "text-green-700",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
      titleColor: "text-red-900",
      messageColor: "text-red-700",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-500",
      titleColor: "text-yellow-900",
      messageColor: "text-yellow-700",
    },
  };

  const current = config[type] || config.success;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className={`${current.bgColor} ${current.borderColor} border-b p-6 flex items-start gap-4`}>
          <Icon className={`${current.iconColor} w-8 h-8 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`text-xl font-semibold ${current.titleColor}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className={`text-base ${current.messageColor}`}>
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleClose}
            className={`w-full py-3 rounded-lg font-medium transition ${
              type === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : type === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
