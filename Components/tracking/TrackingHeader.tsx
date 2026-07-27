// Components/tracking/TrackingHeader.tsx

interface TrackingHeaderProps {
  shipmentType: string;
  realContainers: any[];
  jobId: string;
  onAddContainer: () => void;
}

export default function TrackingHeader({
  shipmentType,
  realContainers,
  jobId,
  onAddContainer,
}: TrackingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-700">
          {shipmentType === "export" ? "Export" : "Import"} Shipment Tracking
        </p>

        <p className="text-xs text-gray-400">
          {realContainers.length} container
          {realContainers.length !== 1 ? "s" : ""} · Job {jobId}
        </p>
      </div>

      <button
        type="button"
        onClick={onAddContainer}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>

        Add container
      </button>
    </div>
  );
}