import { useState } from "react";

import Label from "@/Components/tracking/Label";
import { INPUT_CLS } from "@/Components/tracking/lib/constants";

interface AddContainerModalProps {
  onAdd: (containerNumber: string, sizeType: string) => void;
  onClose: () => void;
  existing: string[];
}

export default function AddContainerModal({
  onAdd,
  onClose,
  existing,
}: AddContainerModalProps) {
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
          <h2 className="text-white font-semibold text-base">
            Add container
          </h2>

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

            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>

          <div>
            <Label>
              Size / type{" "}
              <span className="text-gray-300 font-normal">
                (optional)
              </span>
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