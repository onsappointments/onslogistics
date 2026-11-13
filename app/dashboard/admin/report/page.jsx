"use client";

import { useEffect, useMemo, useState, useRef } from "react";

import TrackingDrawer from "./TrackingDrawer";

import ReportSearch from "./components/ReportSearch";

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

/* ─────────────────────────────────────────────────────────────
   REPORT EXPORT HELPERS
───────────────────────────────────────────────────────────── */

const REPORT_EXPORT_FIELDS = [
  ["Job ID", row => row.jobId],
  ["Job Number", row => row.jobNumber],
  ["Shipment Type", row => row.shipmentType],
  ["Status", row => row.status],
  ["Service Scope", row => row.serviceScope?.label],
  ["Sales Person", row => row.salesPerson],
  ["Accounts Person", row => row.accountsPerson],
  ["Company", row => row.company],
  ["Customer Name", row => row.customerName],
  ["Shipper", row => row.shipper],
  ["Consignee", row => row.consignee],

  ["Booking Number", row => row.booking?.number],
  ["Booking Date", row => row.booking?.date],

  ["Invoice Number", row => row.invoice?.number],
  ["Invoice Date", row => row.invoice?.date],

  ["MBL Number", row => row.billOfLading?.mblNumber],
  ["MBL Date", row => row.billOfLading?.mblDate],
  ["HBL Number", row => row.billOfLading?.hblNumber],
  ["HBL Date", row => row.billOfLading?.hblDate],
  ["AWB Number", row => row.billOfLading?.awbNumber],
  ["AWB Date", row => row.billOfLading?.awbDate],

  ["Bill of Entry Number", row => row.customs?.billOfEntry?.number],
  ["Bill of Entry Date", row => row.customs?.billOfEntry?.date],

  [
    "Shipping Bill Numbers",
    row => (row.customs?.shippingBill?.bills || [])
      .map(bill => bill.number)
      .filter(Boolean)
      .join("; "),
  ],
  [
    "Shipping Bill Dates",
    row => (row.customs?.shippingBill?.bills || [])
      .map(bill => bill.date)
      .filter(Boolean)
      .join("; "),
  ],

  ["Assessable Value", row => row.customs?.assessableValue],
  ["Customs Reference Number", row => row.customs?.referenceNumber],
  ["GIGAM Number", row => row.customs?.gigam?.number],
  ["GIGAM Date", row => row.customs?.gigam?.date],
  ["LIGN Number", row => row.customs?.lign?.number],
  ["LIGN Date", row => row.customs?.lign?.date],

  ["Port of Loading", row => row.route?.pol],
  ["Port of Discharge", row => row.route?.pod],
  ["Clearance At", row => row.route?.clearanceAt],

  ["Mode of Shipment", row => row.shipment?.modeOfShipment],
  ["Mode of Transport", row => row.shipment?.modeOfTransport],
  ["FCL/LCL", row => row.shipment?.fclLcl],
  ["Shipping Line", row => row.shipment?.carrier],

  ["Packages", row => row.cargo?.packages],
  ["Gross Weight", row => row.cargo?.grossWeight],
  ["CBM", row => row.cargo?.cbm],
  ["Commodity", row => row.cargo?.commodity],

  ["Container Number", row => row.container?.containerNumber],
  ["Container Size/Type", row => row.container?.sizeType],
  ["Seal Number", row => row.container?.sealNumber],
  ["Vessel Name", row => row.container?.vesselName],
  ["Voyage", row => row.container?.voyage],
  ["Train Number", row => row.container?.trainNumber],
  ["Wagon Number", row => row.container?.wagonNumber],

  ["Stuffing Date", row => row.container?.milestones?.stuffing],
  ["Vessel Planning Date", row => row.container?.milestones?.vesselPlanning],
  ["Shipped On Board Date", row => row.container?.milestones?.shippedOnBoard],
  ["Vessel Arrival Date", row => row.container?.milestones?.vesselArrival],
  ["Railment Date", row => row.container?.milestones?.railment],
  ["Local ICD Arrival Date", row => row.container?.milestones?.localIcd],
  ["Final Milestone Date", row => row.container?.milestones?.final],

  ["Latest Event", row => row.container?.currentEvent?.cycleStep],
  ["Latest Event Status", row => row.container?.currentEvent?.status],
  ["Latest Event Type", row => row.container?.currentEvent?.eventType],
  ["Latest Event Date", row => row.container?.currentEvent?.date],

  ["Created At", row => row.createdAt],
  ["Updated At", row => row.updatedAt],
];

function csvEscape(value) {
  if (value === null || value === undefined) {
    return "";
  }

  let text = String(value);

  // Prevent spreadsheet formula injection from text fields.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  // Escape double quotes and wrap fields containing CSV syntax.
  return /[",\r\n]/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
}


async function downloadReportFile({
  rows,
  shipmentType,
  month,
  format,
}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const filename =
    `ONS_Logistics_${shipmentType}_Report_${month}`;

  if (format === "excel") {
    const XLSX = await import("xlsx");

    const headers = REPORT_EXPORT_FIELDS.map(
      ([label]) => label
    );

    const records = rows.map((row) =>
      REPORT_EXPORT_FIELDS.map(([, getValue]) => {
        const value = getValue(row);

        return value === null || value === undefined
          ? ""
          : value;
      })
    );

    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...records,
    ]);

    // Set readable column widths.
    worksheet["!cols"] = headers.map((header) => ({
      wch: Math.min(Math.max(header.length + 4, 16), 30),
    }));

    // Enable filtering on all exported columns.
    worksheet["!autofilter"] = {
      ref: worksheet["!ref"],
    };

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Shipment Report"
    );

    workbook.Props = {
      Title: `${shipmentType} Shipment Report`,
      Subject: `ONS Logistics Report - ${month}`,
      Author: "ONS Logistics ERP",
    };

    XLSX.writeFile(
      workbook,
      `${filename}.xlsx`
    );

    return;
  }

  let content;
  let mimeType;
  let extension;

  if (format === "json") {
    content = JSON.stringify(rows, null, 2);
    mimeType = "application/json;charset=utf-8;";
    extension = "json";
  } else {
    const headers = REPORT_EXPORT_FIELDS.map(
      ([label]) => csvEscape(label)
    );

    const records = rows.map((row) =>
      REPORT_EXPORT_FIELDS.map(([, getValue]) =>
        csvEscape(getValue(row))
      ).join(",")
    );

    content = "\uFEFF" + [
      headers.join(","),
      ...records,
    ].join("\r\n");

    mimeType = "text/csv;charset=utf-8;";
    extension = "csv";
  }

  const blob = new Blob([content], {
    type: mimeType,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}.${extension}`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


function shippingBillValues(bills = []) {
  if (!Array.isArray(bills) || !bills.length) {
    return null;
  }

  return bills.filter(
    (bill) =>
      bill?.number ||
      bill?.date
  );
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
function ShippingBillCell({ bills }) {
  const validBills =
    shippingBillValues(bills);

  if (!validBills) {
    return <span>/</span>;
  }

  return (
    <div className="space-y-1">
      {validBills.map((bill, index) => (
        <div key={index}>
          {display(bill.number)}
        </div>
      ))}
    </div>
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
         <ShippingBillCell
           bills={
            row.customs?.shippingBill?.bills
          }
         />
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
  const [modeFilter, setModeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

const reportAbortRef = useRef(null);
const reportRequestIdRef = useRef(0);
const horizontalViewportRef = useRef(null);
const horizontalTableRef = useRef(null);
const [horizontalScrollPosition, setHorizontalScrollPosition] =
  useState(0);

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
 

const [exporting, setExporting] = useState(false);

async function handleReportDownload(format) {
  if (!rows.length || loading || exporting) return;

  try {
    setExporting(true);

    await downloadReportFile({
      rows,
      shipmentType,
      month,
      format,
    });
  } catch (error) {
    console.error("Report export error:", error);
    alert("Unable to export report. Please try again.");
  } finally {
    setExporting(false);
  }
}

  async function loadReport(
  type,
  selectedMonth = month,
  selectedMode = modeFilter,
  selectedSearch = searchTerm
) {
  const requestId = ++reportRequestIdRef.current;

  // Cancel the previous request if it is still running.
  reportAbortRef.current?.abort();

  const controller = new AbortController();
  reportAbortRef.current = controller;

  try {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      shipmentType: type,
      month: selectedMonth,
      mode: selectedMode,
      search: selectedSearch,
    });

    const response = await fetch(
      `/api/admin/report?${params.toString()}`,
      {
        cache: "no-store",
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Failed to load report"
      );
    }

    // Do not allow an older request to overwrite newer results.
    if (requestId !== reportRequestIdRef.current) {
      return;
    }

    setRows(
      Array.isArray(data.rows) ? data.rows : []
    );

    setTotalJobs(data.report?.totalJobs || 0);

    setGeneratedAt(
      data.report?.generatedAt || null
    );
  } catch (err) {
    if (err.name === "AbortError") {
      return;
    }

    if (requestId !== reportRequestIdRef.current) {
      return;
    }

    console.error("Report loading error:", err);

    setRows([]);

    setError(
      err?.message || "Failed to load report"
    );
  } finally {
    if (requestId === reportRequestIdRef.current) {
      setLoading(false);
    }
  }
}

  useEffect(() => {
  loadReport(
    shipmentType,
    month,
    modeFilter,
    searchTerm
  );
}, [
  shipmentType,
  month,
  modeFilter,
  searchTerm,
]);

useEffect(() => {
  return () => {
    reportAbortRef.current?.abort();
  };
}, []);

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
    <main className="min-h-screen w-full min-w-0 bg-[#f5f7fa]">
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
  {/* Mode of Shipment */}
<div className="flex items-center gap-3">
  <label
    htmlFor="report-mode"
    className="text-sm font-semibold text-gray-700"
  >
    Mode
  </label>

  <select
    id="report-mode"
    value={modeFilter}
    onChange={(event) =>
      setModeFilter(event.target.value)
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
  >
    <option value="all">All</option>
    <option value="air">Air</option>
    <option value="sea">Sea</option>
    <option value="cou">Courier</option>
  </select>
</div>
</div>

        </div>
        
      </div>

    

      {/* ─────────────────────────────────────────────
          CONTENT
      ───────────────────────────────────────────── */}
      <div className="w-full min-w-0 p-6">
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
   <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
  {/* Export button — left */}
  <button
    type="button"
    onClick={() => handleReportDownload("excel")}
    disabled={loading || exporting || rows.length === 0}
    className="
      inline-flex h-10 shrink-0 items-center justify-center gap-2
      rounded-lg border border-emerald-200
      bg-emerald-50 px-4
      text-sm font-semibold text-emerald-700
      transition-colors hover:bg-emerald-100
      disabled:cursor-not-allowed
      disabled:opacity-50
      whitespace-nowrap
    "
  >
    {exporting ? (
      <>
        <span className="animate-spin">⏳</span>
        Exporting...
      </>
    ) : (
      <>
        <span>↓</span>
        Export Excel
      </>
    )}
  </button>

  {/* Search bar — right */}
  <div className="min-w-0 flex-1">
    <ReportSearch
      onSearch={setSearchTerm}
      loading={loading}
    />
  </div>
</div>

        <div className="w-full min-w-0 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* ─────────────────────────────────────────
              TABLE
          ───────────────────────────────────────── */}
    
<div
  className="
    report-table-scroll
    relative
    w-full
    min-w-0
    h-[calc(100dvh-430px)]
    min-h-[220px]
    max-h-[650px]
    overflow-x-hidden
    overflow-y-scroll
    overscroll-contain
  "
  style={{
    direction: "rtl",
    scrollbarGutter: "stable",
    WebkitOverflowScrolling: "touch",
  }}
>
 <div
  ref={horizontalViewportRef}
  className="report-table-viewport w-full min-w-0 overflow-x-auto"
  style={{ direction: "ltr" }}
  onScroll={(event) => {
    const element = event.currentTarget;
    const maxScroll = Math.max(
      0,
      element.scrollWidth - element.clientWidth
    );

    setHorizontalScrollPosition(
      maxScroll > 0
        ? Math.round(
            (element.scrollLeft / maxScroll) * 1000
          )
        : 0
    );
  }}
>
  <table className="w-max min-w-[2600px] border-separate border-spacing-0">
      {/* Keep your existing thead and tbody here */}

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map(
                    (column) => (
                      <th
                        key={column}
                        className={[
                            "sticky top-0 z-10",
                           "bg-gray-50",
                            "px-4 py-3",
                            "text-left",
                            "text-[10px]",
                            "font-bold",
                            "uppercase",
                            "tracking-wider",
                            "text-gray-500",
                            "whitespace-nowrap",
                            "border-b border-gray-200",
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
          </div>
          {/* Dedicated horizontal scrollbar */}

{/* Dedicated horizontal table scrollbar */}
<div className="report-horizontal-slider flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
    Scroll columns
  </span>

  <input
    type="range"
    min="0"
    max="1000"
    step="1"
    value={horizontalScrollPosition}
    aria-label="Scroll report table horizontally"
    onChange={(event) => {
  const value = Number(event.target.value);

  const element = horizontalViewportRef.current;

  if (!element) return;

  const maxScroll = Math.max(
    0,
    element.scrollWidth - element.clientWidth
  );

  const targetPosition = (value / 1000) * maxScroll;

  element.scrollTo({
    left: targetPosition,
    behavior: "instant",
  });

  setHorizontalScrollPosition(value);
}}
    className="report-horizontal-range"
  />

  <span className="text-xs text-gray-500 whitespace-nowrap">
   
  </span>
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