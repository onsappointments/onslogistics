export const PRE_CONTAINER_SENTINEL = "__PRE_CONTAINER__";

// Steps that belong to the entire job, not a specific container.
export const JOB_LEVEL_STEPS = new Set([
  "bill_of_entry",
  "cargo_examination",
  "ooc_customs_cleared",
  "booking_docs_received",
  "cargo_received",
  "custom_clearance_origin",
]);

export const INPUT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
  "placeholder:text-gray-300";

export const SELECT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700";

export const PHASE_COLORS: Record<
  string,
  {
    dot: string;
    bar: string;
  }
> = {
  "From Country": {
    dot: "#3b82f6",
    bar: "#bfdbfe",
  },

  "Arrived India": {
    dot: "#10b981",
    bar: "#d1fae5",
  },

  "Pre-Shipment": {
    dot: "#8b5cf6",
    bar: "#ede9fe",
  },

  "In Transit": {
    dot: "#f59e0b",
    bar: "#fef3c7",
  },

  Destination: {
    dot: "#16a34a",
    bar: "#bbf7d0",
  },
};

export const DEFAULT_COLOR = {
  dot: "#6366f1",
  bar: "#e0e7ff",
};