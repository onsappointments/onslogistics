"use client";

import { useEffect, useMemo, useState } from "react";

import TrackingDrawer from "./TrackingDrawer";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

function display(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return value;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function serviceLabel(serviceScope) {
  if (!serviceScope) return "—";

  if (typeof serviceScope === "string") {
    return serviceScope;
  }

  return serviceScope.label || "—";
}

function serviceClass(serviceScope) {
  const label = serviceLabel(serviceScope);

  if (label === "C") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (label === "F") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (label === "C-F") {
    return "bg-violet-50 text-violet-700 border-violet-200";
  }

  return "bg-gray-50 text-gray-500 border-gray-200";
}

function statusClass(status) {
  switch (String(status || "").toLowerCase()) {
    case "active":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "completed":
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "cancelled":
    case "canceled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

/* ─────────────────────────────────────────────────────────────
   SMALL UI COMPONENTS
───────────────────────────────────────────────────────────── */

function ServiceBadge({ serviceScope }) {
  const label = serviceLabel(serviceScope);

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "min-w-[42px] px-2 py-1",
        "rounded-md border",
        "text-[11px] font-bold tracking-wide",
        serviceClass(serviceScope),
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "px-2 py-1 rounded-md border",
        "text-[11px] font-semibold capitalize",
        statusClass(status),
      ].join(" ")}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {display(status)}
    </span>
  );
}

function TrackButton({
  jobNumber,
  onClick,
}) {
  if (!jobNumber) {
    return (
      <span className="text-xs text-gray-300">
        —
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick(jobNumber)}
      className={[
        "inline-flex items-center gap-1.5",
        "px-3 py-1.5",
        "rounded-lg",
        "border border-blue-200",
        "bg-blue-50",
        "text-blue-700",
        "text-xs font-semibold",
        "hover:bg-blue-100",
        "transition-colors",
        "whitespace-nowrap",
      ].join(" ")}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.7 3.7 6.3 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-6.3-3.7-9S9.5 5.7 12 3Z" />
      </svg>

      Track
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   CELL
───────────────────────────────────────────────────────────── */

function Cell({
  children,
  className = "",
  mono = false,
}) {
  return (
    <td
      className={[
        "px-4 py-3",
        "border-b border-gray-100",
        "text-sm text-gray-700",
        "whitespace-nowrap",
        className,
      ].join(" ")}
    >
      <span
        className={
          mono
            ? "font-mono text-[12px]"
            : ""
        }
      >
        {children}
      </span>
    </td>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMPORT ROW
───────────────────────────────────────────────────────────── */

function ImportRow({ row , onTrack,}) {
  const container = row.container || {};

  return (
    <tr className="hover:bg-gray-50/70 transition-colors">
      <Cell>
        <StatusBadge status={row.status} />
      </Cell>

      <Cell>
        <ServiceBadge
          serviceScope={row.serviceScope}
        />
      </Cell>

      <Cell>
        <span className="font-medium text-gray-900">
          {display(row.salesPerson)}
        </span>
      </Cell>

      <Cell mono>
        <span className="font-semibold text-gray-900">
          {display(row.jobNumber)}
        </span>
      </Cell>

      <Cell>
        <div className="font-medium text-gray-800">
          {display(row.booking?.number)}
        </div>

        {row.booking?.date && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            {formatDate(row.booking.date)}
          </div>
        )}
      </Cell>

      <Cell>
        {display(row.consignee)}
      </Cell>

      <Cell mono>
        {display(row.invoice?.number)}
      </Cell>

      <Cell mono>
        {display(row.billOfEntry?.number)}
      </Cell>

      <Cell>
        {display(row.cargo?.packages)}
      </Cell>

      <Cell>
        {display(row.route?.pod)}
      </Cell>

      <Cell mono>
        <span className="font-semibold text-gray-800">
          {display(container.containerNumber)}
        </span>
      </Cell>

      <Cell>
        {display(container.sizeType)}
      </Cell>

      <Cell>
        {display(row.cargo?.grossWeight)}
      </Cell>

      <Cell>
        {display(row.shipment?.fclLcl)}
      </Cell>

      <Cell>
        {display(row.shipment?.carrier)}
      </Cell>

      <Cell>
        {display(container.vesselName)}
      </Cell>

      <Cell>
        <TrackButton
          jobNumber={row.jobNumber}
          onClick={onTrack}
        />
      </Cell>
    </tr>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPORT ROW
───────────────────────────────────────────────────────────── */

function ExportRow({ row , onTrack}) {
  const container = row.container || {};

  return (
    <tr className="hover:bg-gray-50/70 transition-colors">
      <Cell>
        <StatusBadge status={row.status} />
      </Cell>

      <Cell>
        <ServiceBadge
          serviceScope={row.serviceScope}
        />
      </Cell>

      <Cell>
        <span className="font-medium text-gray-900">
          {display(row.salesPerson)}
        </span>
      </Cell>

      <Cell mono>
        <span className="font-semibold text-gray-900">
          {display(row.jobNumber)}
        </span>
      </Cell>

      <Cell>
        <div className="font-medium text-gray-800">
          {display(row.booking?.number)}
        </div>

        {row.booking?.date && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            {formatDate(row.booking.date)}
          </div>
        )}
      </Cell>

      <Cell>
        {display(row.shipper)}
      </Cell>

      <Cell mono>
        {display(row.invoice?.number)}
      </Cell>

      <Cell mono>
        {display(row.customs?.shippingBill?.number)}
      </Cell>

      <Cell>
        {display(row.cargo?.packages)}
      </Cell>

      <Cell>
        {display(row.route?.pod)}
      </Cell>

      <Cell mono>
        <span className="font-semibold text-gray-800">
          {display(container.containerNumber)}
        </span>
      </Cell>

      <Cell>
        {display(container.sizeType)}
      </Cell>

      <Cell>
        {display(row.cargo?.grossWeight)}
      </Cell>

      <Cell>
        {display(row.shipment?.fclLcl)}
      </Cell>

      <Cell>
        {display(row.shipment?.carrier)}
      </Cell>

      <Cell>
        <div className="font-medium text-gray-800">
          {display(container.vesselName)}
        </div>

        {container.voyage && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            Voyage {container.voyage}
          </div>
        )}
      </Cell>

      <Cell>
        <TrackButton
          jobNumber={row.jobNumber}
          onClick={onTrack}
        />
      </Cell>
    </tr>
  );
}

/* ─────────────────────────────────────────────────────────────
   TABLE HEADERS
───────────────────────────────────────────────────────────── */

const IMPORT_COLUMNS = [
  "Status",
  "Service",
  "Sales",
  "Job No.",
  "Booking",
  "Consignee",
  "Invoice",
  "B.E. No.",
  "Pkgs",
  "POD",
  "Container",
  "Size",
  "Grs. Wt.",
  "FCL/LCL",
  "Shipping Line",
  "Vessel",
  "Track",
];

const EXPORT_COLUMNS = [
  "Status",
  "Service",
  "Sales",
  "Job No.",
  "Booking",
  "Shipper",
  "Invoice",
  "S.B. No.",
  "Pkgs",
  "POD",
  "Container",
  "Size",
  "Grs. Wt.",
  "FCL/LCL",
  "Shipping Line",
  "Vessel / Voyage",
  "Track",
];

function getCurrentMonth() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}
function formatReportMonth(value) {
  if (!value) return "";

  const [year, month] =
    value.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    1
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}


/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */

export default function ReportPage() {


  const [shipmentType, setShipmentType] =
    useState("import");

  const [rows, setRows] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [generatedAt, setGeneratedAt] =
    useState(null);

  const [trackingJobNumber, setTrackingJobNumber] =
  useState(null);
  
  const [month, setMonth] =
  useState(getCurrentMonth());

  const [totalJobs, setTotalJobs] =
  useState(0);

  async function loadReport( type,
  selectedMonth = month) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/report?shipmentType=${type}&month=${selectedMonth}`,
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to load report"
        );
      }

      setRows(
        Array.isArray(data.rows)
          ? data.rows
          : []
      );
      setTotalJobs(
  data.report?.totalJobs || 0
);

      setGeneratedAt(
        data.report?.generatedAt ||
          null
      );
    } catch (err) {
      console.error(
        "Report loading error:",
        err
      );

      setRows([]);

      setError(
        err?.message ||
          "Failed to load report"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadReport(
    shipmentType,
    month
  );
}, [shipmentType, month]);

  const columns = useMemo(
    () =>
      shipmentType === "import"
        ? IMPORT_COLUMNS
        : EXPORT_COLUMNS,
    [shipmentType]
  );

  const title =
    shipmentType === "import"
      ? "Import Operations"
      : "Export Operations";

  const subtitle =
    shipmentType === "import"
      ? "Shipment and container operations report"
      : "Export shipment and container operations report";

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      {/* ─────────────────────────────────────────────
          HEADER
      ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  {title}
                </h1>

                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-[11px] font-semibold">
                  {rows.length}{" "}
                  {rows.length === 1
                    ? "container"
                    : "containers"}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
              </p>
            </div>

            {generatedAt && (
              <div className="text-xs text-gray-400">
                Updated{" "}
                {new Date(
                  generatedAt
                ).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────
              IMPORT / EXPORT SWITCH
          ───────────────────────────────────────── */}
          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center ">
  {/* Month */}
  <div className="flex items-center gap-3">
    <label
      htmlFor="report-month"
      className="text-sm font-semibold text-gray-700"
    >
      Month
    </label>

    <input
      id="report-month"
      type="month"
      value={month}
      onChange={(event) =>
        setMonth(event.target.value)
      }
      className={[
        "h-10 px-3",
        "rounded-lg",
        "border border-gray-200",
        "bg-white",
        "text-sm text-gray-800",
        "outline-none",
        "focus:border-blue-400",
        "focus:ring-2 focus:ring-blue-100",
      ].join(" ")}
    />
  </div>

  {/* Import / Export */}
  <div className="inline-flex p-1 rounded-lg bg-gray-100 border border-gray-200 self-start lg:self-auto">
    <button
      type="button"
      onClick={() =>
        setShipmentType("import")
      }
      className={[
        "px-5 py-2",
        "rounded-md",
        "text-sm font-medium",
        "transition-all",
        shipmentType === "import"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700",
      ].join(" ")}
    >
      Imports
    </button>

    <button
      type="button"
      onClick={() =>
        setShipmentType("export")
      }
      className={[
        "px-5 py-2",
        "rounded-md",
        "text-sm font-medium",
        "transition-all",
        shipmentType === "export"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700",
      ].join(" ")}
    >
      Exports
    </button>
  </div>
</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          CONTENT
      ───────────────────────────────────────────── */}
      <div className="p-6">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-semibold mb-1">
              Could not load report
            </div>

            <div>{error}</div>

            <button
              type="button"
              onClick={() =>
                loadReport(shipmentType)
              }
              className="mt-2 text-xs font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* ─────────────────────────────────────────
              TABLE
          ───────────────────────────────────────── */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map(
                    (column) => (
                      <th
                        key={column}
                        className={[
                          "px-4 py-3",
                          "text-left",
                          "text-[10px]",
                          "font-bold",
                          "uppercase",
                          "tracking-wider",
                          "text-gray-500",
                          "whitespace-nowrap",
                        ].join(" ")}
                      >
                        {column}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({
                    length: 6,
                  }).map((_, index) => (
                    <tr key={index}>
                      {columns.map(
                        (_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-4 border-b border-gray-100"
                          >
                            <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
                          </td>
                        )
                      )}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-16 text-center"
                    >
                      <div className="text-3xl mb-3">
                        📋
                      </div>

                      <div className="text-sm font-semibold text-gray-700">
                        No{" "}
                        {shipmentType}{" "}
                        shipments found
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        There are currently no
                        reportable containers for
                        this shipment type.
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row) =>
                    shipmentType ===
                    "import" ? (
                      <ImportRow
                        key={row.id}
                        row={row}
                        onTrack={setTrackingJobNumber}
                      />
                    ) : (
                      <ExportRow
                        key={row.id}
                        row={row}
                        onTrack={setTrackingJobNumber}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ─────────────────────────────────────────
              FOOTER
          ───────────────────────────────────────── */}
          {!loading &&
            rows.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-600">
                    {rows.length}
                  </span>{" "}
                  container{" "}
                  {rows.length === 1
                    ? "record"
                    : "records"}
                </p>

                <p className="text-[11px] text-gray-400">
                  Operational milestones are
                  available through Track.
                </p>
              </div>
            )}
        </div>
      </div>
      {trackingJobNumber && (
  <TrackingDrawer
    jobNumber={trackingJobNumber}
    onClose={() =>
      setTrackingJobNumber(null)
    }
  />
)}
    </main>
  );
}