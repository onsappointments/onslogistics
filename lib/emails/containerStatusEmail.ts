/**
 * containerStatusEmail.ts
 *
 * Builds the transactional HTML email sent to clients whenever a
 * container event is recorded in ONS Logistics.
 *
 * All copy is shipment-type aware — import and export messages
 * are distinct and use the right directional language throughout.
 */

const PRE_CONTAINER_SENTINEL = "__PRE_CONTAINER__";

/* ─────────────────────────────────────────────────────────────────────
   Step icons
───────────────────────────────────────────────────────────────────── */
const STEP_ICONS: Record<string, string> = {
  // Import
  booking_docs_received: "📋",
  cargo_received: "📦",
  custom_clearance_origin: "🛃",
  stuffing_container_allocated: "🏗️",
  planning_vessel: "🗓️",
  shipped_on_board: "🚢",
  vessel_arrived_pod: "🛳️",
  container_railment_pod: "🚂",
  arrived_local_icd: "🏭",
  bill_of_entry: "📄",
  cargo_examination: "🔍",
  ooc_customs_cleared: "✅",
  cargo_dispatch: "🚛",
  // Export
  booking_confirmed: "📋",
  cargo_picked_up: "📦",
  container_stuffed: "🏗️",
  shipped_on_board_export: "🚢",
  vessel_arrived_destination: "🛳️",
};

/* ─────────────────────────────────────────────────────────────────────
   Date formatter
───────────────────────────────────────────────────────────────────── */
function fmt(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const raw = typeof date === "string" ? date.trim() : null;
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw + "T00:00");
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    }).format(d);
  }
  const d = new Date(date as string);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(d);
}

/* ─────────────────────────────────────────────────────────────────────
   Header label map — covers all import AND export cycle steps
───────────────────────────────────────────────────────────────────── */
const HEADER_LABELS: Record<string, { eta: string; actual: string; status: string }> = {
  // ── Import ────────────────────────────────────────────────────────
  booking_docs_received: {
    eta: "Booking Documents Expected",
    actual: "Booking Documents Received",
    status: "Booking Documents Processing",
  },
  cargo_received: {
    eta: "Cargo Expected at Origin",
    actual: "Cargo Received at Origin",
    status: "Cargo Received",
  },
  custom_clearance_origin: {
    eta: "Origin Customs Clearance Expected",
    actual: "Origin Customs Clearance Completed",
    status: "Origin Customs Clearance",
  },
  stuffing_container_allocated: {
    eta: "Container Stuffing Expected",
    actual: "Container Stuffed & Allocated",
    status: "Container Stuffing Completed",
  },
  planning_vessel: {
    eta: "Vessel Planning Expected",
    actual: "Vessel Planning Confirmed",
    status: "Vessel Planning",
  },
  shipped_on_board: {
    eta: "Expected Vessel Departure",
    actual: "Shipped on Board",
    status: "Shipment in Transit",
  },
  vessel_arrived_pod: {
    eta: "Expected Arrival at Port of Discharge",
    actual: "Vessel Arrived at Port of Discharge",
    status: "Port Arrival Processing",
  },
  container_railment_pod: {
    eta: "Expected Rail Movement",
    actual: "Container Railed from Port",
    status: "Rail Movement in Progress",
  },
  arrived_local_icd: {
    eta: "Expected Arrival at Local ICD",
    actual: "Arrived at Local ICD",
    status: "ICD Processing",
  },
  bill_of_entry: {
    eta: "Bill of Entry Filing Expected",
    actual: "Bill of Entry Filed",
    status: "Customs Documentation Processing",
  },
  cargo_examination: {
    eta: "Cargo Examination Expected",
    actual: "Cargo Examination Completed",
    status: "Cargo Under Examination",
  },
  ooc_customs_cleared: {
    eta: "Customs Clearance Expected",
    actual: "Customs Clearance Completed",
    status: "Customs Clearance Processing",
  },
  cargo_dispatch: {
    eta: "Expected Cargo Dispatch",
    actual: "Cargo Dispatched",
    status: "Delivery in Progress",
  },

  // ── Export ────────────────────────────────────────────────────────
  booking_confirmed: {
    eta: "Export Booking Expected",
    actual: "Export Booking Confirmed",
    status: "Export Booking Processing",
  },
  cargo_picked_up: {
    eta: "Cargo Pickup Expected",
    actual: "Cargo Picked Up",
    status: "Cargo in Transit to Stuffing Point",
  },
  container_stuffed: {
    eta: "Container Stuffing Expected",
    actual: "Container Stuffed & Sealed",
    status: "Container Stuffing Completed",
  },
  shipped_on_board_export: {
    eta: "Expected Export Vessel Departure",
    actual: "Shipped on Board",
    status: "Export Shipment in Transit",
  },
  vessel_arrived_destination: {
    eta: "Expected Arrival at Destination Port",
    actual: "Vessel Arrived at Destination Port",
    status: "Destination Port Processing",
  },
};

function resolveHeaderTitle(
  cycleStep: string,
  emailType: "eta" | "actual" | "status" | "single",
  fallback: string
): string {
  const labels = HEADER_LABELS[cycleStep];
  if (!labels) return fallback;
  if (emailType === "eta" || emailType === "single") return labels.eta;
  if (emailType === "actual") return labels.actual;
  return labels.status;
}

/* ─────────────────────────────────────────────────────────────────────
   IMPORT — ETA copy
───────────────────────────────────────────────────────────────────── */
const IMPORT_ETA: Record<string, (d: string, remarks?: string) => string> = {
  booking_docs_received: (d) =>
    `We are expecting to receive the booking documents for your shipment by <strong>${d}</strong>. Once confirmed, we will send you an update and your shipment will be formally registered in our system.`,
  cargo_received: (d) =>
    `Your cargo is expected to reach the origin warehouse by <strong>${d}</strong>. After physical receipt, it will be prepared for customs formalities and container stuffing.`,
  custom_clearance_origin: (d) =>
    `Origin customs clearance is expected to be completed by <strong>${d}</strong>. This step is required before your cargo can be loaded into a container.`,
  stuffing_container_allocated: (d) =>
    `We expect your cargo to be stuffed into a container and a container number to be assigned by <strong>${d}</strong>. You will receive the container details once this is confirmed.`,
  planning_vessel: (d) =>
    `Your container is being planned for a vessel expected to sail around <strong>${d}</strong>. The final vessel name and voyage number will be confirmed once the carrier finalises the loading list.`,
  shipped_on_board: (d) =>
    `Your container is expected to be loaded and shipped on board the vessel by <strong>${d}</strong>. The Bill of Lading will be issued once sailing is confirmed.`,
  vessel_arrived_pod: (d) =>
    `The vessel carrying your container is expected to arrive at the Indian Port of Discharge around <strong>${d}</strong>. Actual arrival may vary slightly depending on the vessel's schedule.`,
  container_railment_pod: (d) =>
    `Your container is expected to be moved by rail from the Port of Discharge around <strong>${d}</strong>, heading towards the destination Inland Container Depot.`,
  arrived_local_icd: (d) =>
    `Your container is expected to arrive at the local Inland Container Depot (ICD) by <strong>${d}</strong>. Import customs clearance procedures will begin shortly after arrival.`,
  bill_of_entry: (d) =>
    `The Bill of Entry for your shipment is expected to be filed with Indian Customs by <strong>${d}</strong>. This formally initiates the import clearance process.`,
  cargo_examination: (d) =>
    `Customs has indicated that a physical examination of your cargo may take place around <strong>${d}</strong>. We will keep you informed as soon as the outcome is known.`,
  ooc_customs_cleared: (d) =>
    `We expect customs clearance (Out of Charge) to be granted by <strong>${d}</strong>. Once issued, your cargo will be free to move and dispatch arrangements will begin immediately.`,
  cargo_dispatch: (d) =>
    `Your cargo is expected to be dispatched from the ICD and delivered to the final destination by <strong>${d}</strong>. We will notify you as soon as it is on its way.`,
};

/* ─────────────────────────────────────────────────────────────────────
   IMPORT — Actual copy
───────────────────────────────────────────────────────────────────── */
const IMPORT_ACTUAL: Record<string, (d: string, remarks?: string) => string> = {
  booking_docs_received: (d) =>
    `Good news — the booking documents for your shipment were received on <strong>${d}</strong>. Your shipment is now formally registered and the process is underway.`,
  cargo_received: (d) =>
    `Your cargo was received at the origin warehouse on <strong>${d}</strong>. It is now being prepared for customs clearance and loading into the container.`,
  custom_clearance_origin: (d) =>
    `Origin customs clearance was completed on <strong>${d}</strong>. Your cargo has been cleared and is ready for stuffing and vessel loading.`,
  stuffing_container_allocated: (d) =>
    `Your cargo was successfully stuffed into a container on <strong>${d}</strong> and a container number has been allocated. Your shipment is now ready to be loaded onto the vessel.`,
  planning_vessel: (d) =>
    `Your container has been confirmed on a vessel as of <strong>${d}</strong>. The vessel and voyage details are now finalised — your shipment is heading to India.`,
  shipped_on_board: (d) =>
    `Your container was loaded and shipped on board the vessel on <strong>${d}</strong>. The Bill of Lading has been issued and your shipment is now on its way to India.`,
  vessel_arrived_pod: (d) =>
    `The vessel carrying your container arrived at the Indian Port of Discharge on <strong>${d}</strong>. Discharge operations are underway and your container will be moved to the ICD shortly.`,
  container_railment_pod: (d) =>
    `Your container was dispatched by rail from the Port of Discharge on <strong>${d}</strong> and is now in transit to the destination Inland Container Depot.`,
  arrived_local_icd: (d) =>
    `Your container arrived at the local Inland Container Depot (ICD) on <strong>${d}</strong>. Import customs clearance procedures have been initiated.`,
  bill_of_entry: (d) =>
    `The Bill of Entry for your shipment was filed with Indian Customs on <strong>${d}</strong>. Assessment is in progress and we will keep you updated on the clearance status.`,
  cargo_examination: (d) =>
    `Customs completed the physical examination of your cargo on <strong>${d}</strong>. We are awaiting the Out of Charge (OOC) order, which will allow your cargo to be dispatched.`,
  ooc_customs_cleared: (d) =>
    `Customs clearance (Out of Charge) was granted on <strong>${d}</strong>. Your cargo is now fully cleared and delivery arrangements are being made.`,
  cargo_dispatch: (d) =>
    `Your cargo was dispatched from the ICD on <strong>${d}</strong> and is now on its way to the final destination. Thank you for choosing ONS Logistics — we look forward to serving you again.`,
};

/* ─────────────────────────────────────────────────────────────────────
   IMPORT — Status-only copy
───────────────────────────────────────────────────────────────────── */
const IMPORT_STATUS: Record<string, string> = {
  booking_docs_received:
    "The booking documents for your shipment have been received and are being processed. Your shipment is now officially registered with ONS Logistics.",
  cargo_received:
    "Your cargo has been received at the origin warehouse and is being readied for customs clearance and container stuffing.",
  custom_clearance_origin:
    "Origin customs clearance has been completed. Your cargo is cleared and ready for the next step — container stuffing and vessel loading.",
  stuffing_container_allocated:
    "Your cargo has been stuffed into a container and a container number has been assigned. Your shipment is now ready for vessel planning.",
  planning_vessel:
    "Your container is being planned onto a vessel. We will send you the vessel name, voyage details, and an estimated sailing date as soon as they are confirmed.",
  shipped_on_board:
    "Your container has been loaded and shipped on board the vessel. The Bill of Lading has been issued and your shipment is now in transit to India.",
  vessel_arrived_pod:
    "The vessel carrying your container has arrived at the Indian Port of Discharge. Discharge operations are in progress.",
  container_railment_pod:
    "Your container has been moved by rail from the Port of Discharge and is currently in transit to the destination Inland Container Depot.",
  arrived_local_icd:
    "Your container has arrived at the local Inland Container Depot (ICD). Import customs clearance procedures are now being initiated.",
  bill_of_entry:
    "The Bill of Entry for your shipment has been filed with Indian Customs. Assessment and examination (if applicable) will follow shortly.",
  cargo_examination:
    "Your cargo is currently undergoing a customs examination. We will notify you as soon as the Out of Charge (OOC) order is received.",
  ooc_customs_cleared:
    "Customs clearance (Out of Charge) has been granted for your shipment. Your cargo is fully cleared and dispatch arrangements are being made.",
  cargo_dispatch:
    "Your cargo has been dispatched from the ICD and is on its way to the final destination. Thank you for choosing ONS Logistics.",
};

/* ─────────────────────────────────────────────────────────────────────
   EXPORT — ETA copy
───────────────────────────────────────────────────────────────────── */
const EXPORT_ETA: Record<string, (d: string) => string> = {
  booking_confirmed: (d) =>
    `Your export booking is expected to be confirmed by <strong>${d}</strong>. Once finalised, we will share the booking reference and next steps.`,
  cargo_picked_up: (d) =>
    `We are expecting to pick up your cargo by <strong>${d}</strong> and bring it to the designated stuffing point.`,
  container_stuffed: (d) =>
    `Your cargo is expected to be stuffed and the container sealed by <strong>${d}</strong>. A container number will be assigned at this stage.`,
  shipped_on_board_export: (d) =>
    `Your container is expected to be loaded on board the export vessel and sail by <strong>${d}</strong>. The Bill of Lading will be issued once confirmed.`,
  vessel_arrived_destination: (d) =>
    `The vessel carrying your export cargo is expected to arrive at the destination port around <strong>${d}</strong>. Delivery formalities at the destination will follow.`,
};

/* ─────────────────────────────────────────────────────────────────────
   EXPORT — Actual copy
───────────────────────────────────────────────────────────────────── */
const EXPORT_ACTUAL: Record<string, (d: string) => string> = {
  booking_confirmed: (d) =>
    `Your export booking was confirmed on <strong>${d}</strong>. Your shipment is now registered and we will keep you updated as it progresses.`,
  cargo_picked_up: (d) =>
    `Your cargo was picked up on <strong>${d}</strong> and is now at the stuffing location, ready to be loaded into the container.`,
  container_stuffed: (d) =>
    `Your cargo was stuffed and the container sealed on <strong>${d}</strong>. The container is now ready for port delivery and loading.`,
  shipped_on_board_export: (d) =>
    `Your container was loaded and shipped on board the vessel on <strong>${d}</strong>. Your export shipment is now in transit to the destination.`,
  vessel_arrived_destination: (d) =>
    `The vessel carrying your export cargo arrived at the destination port on <strong>${d}</strong>. Delivery arrangements at the destination are now underway.`,
};

/* ─────────────────────────────────────────────────────────────────────
   EXPORT — Status-only copy
───────────────────────────────────────────────────────────────────── */
const EXPORT_STATUS: Record<string, string> = {
  booking_confirmed:
    "Your export booking has been confirmed. Your shipment is registered and the process is now underway.",
  cargo_picked_up:
    "Your cargo has been picked up and brought to the designated stuffing location.",
  container_stuffed:
    "Your cargo has been stuffed into the container and sealed. A container number has been assigned.",
  shipped_on_board_export:
    "Your container has been loaded on board the export vessel. Your shipment is now in transit to the destination.",
  vessel_arrived_destination:
    "The vessel has arrived at the destination port. Delivery formalities are underway.",
};

/* ─────────────────────────────────────────────────────────────────────
   Banner resolver
───────────────────────────────────────────────────────────────────── */
interface BannerParams {
  emailType: "eta" | "actual" | "status" | "single";
  cycleStep: string;
  status: string;
  eta?: string | null;
  actualDeparture?: string | null;
  remarks?: string;
  shipmentType: "import" | "export";
}

function resolveBannerBody(p: BannerParams): string {
  const isImport = p.shipmentType !== "export";

  if (p.emailType === "eta" || p.emailType === "single") {
    const dateStr = fmt(p.eta);
    if (isImport) {
      const fn = IMPORT_ETA[p.cycleStep];
      if (fn) return fn(dateStr, p.remarks);
    } else {
      const fn = EXPORT_ETA[p.cycleStep];
      if (fn) return fn(dateStr);
    }
    if (p.remarks) return `${p.remarks} — estimated by <strong>${dateStr}</strong>.`;
    return `Your shipment is estimated to reach the next stage by <strong>${dateStr}</strong>.`;
  }

  if (p.emailType === "actual") {
    const dateStr = fmt(p.actualDeparture);
    if (isImport) {
      const fn = IMPORT_ACTUAL[p.cycleStep];
      if (fn) return fn(dateStr, p.remarks);
    } else {
      const fn = EXPORT_ACTUAL[p.cycleStep];
      if (fn) return fn(dateStr);
    }
    if (p.remarks) return `${p.remarks} — confirmed on <strong>${dateStr}</strong>.`;
    return `This milestone was completed on <strong>${dateStr}</strong>.`;
  }

  // status-only
  const msg = isImport ? IMPORT_STATUS[p.cycleStep] : EXPORT_STATUS[p.cycleStep];
  if (msg) return msg;
  if (p.remarks) return p.remarks;
  return `Your shipment status has been updated to <strong>${p.status}</strong>.`;
}

/* ─────────────────────────────────────────────────────────────────────
   Subject line builder
   Meaningful differentiation by emailType and shipment direction.
───────────────────────────────────────────────────────────────────── */
export function buildSubjectLine({
  shipmentType,
  emailType,
  containerNumber,
  jobId,
  status,
}: {
  shipmentType: "import" | "export";
  emailType: "eta" | "actual" | "status" | "single";
  containerNumber?: string | null;
  jobId: string;
  status: string;
}): string {
  const ref = `Job ${jobId}`;
  const cnPart =
    containerNumber && containerNumber !== PRE_CONTAINER_SENTINEL
      ? ` | ${containerNumber}`
      : "";

  const prefixMap: Record<string, string> = {
    eta: "Shipment Update",
    actual: "Shipment Update",
    single: "Shipment Update",
    status: "Status Update",
  };

  const direction = shipmentType === "export" ? "Export" : "Import";
  const prefix = prefixMap[emailType] ?? "Shipment Update";

  return `${direction} ${prefix} | ${ref}`;
}

/* ─────────────────────────────────────────────────────────────────────
   HTML helpers
───────────────────────────────────────────────────────────────────── */
function detailRow(
  label: string,
  value: string,
  valueColor = "#111827",
  last = false
): string {
  const border = last ? "" : "border-bottom:1px solid #f0f0f0;";
  return `
    <tr>
      <td width="155" valign="top"
          style="padding:11px 16px;font-size:13px;color:#6b7280;
                 font-family:Helvetica,Arial,sans-serif;${border}">
        ${label}
      </td>
      <td valign="top"
          style="padding:11px 16px;font-size:13px;font-weight:bold;
                 color:${valueColor};font-family:Helvetica,Arial,sans-serif;${border}">
        ${value}
      </td>
    </tr>`;
}

/* ─────────────────────────────────────────────────────────────────────
   Phase label
───────────────────────────────────────────────────────────────────── */
function resolvePhaseLabel(shipmentType: string): string {
  return shipmentType === "export" ? "Export Shipment" : "Import Shipment";
}

/* ─────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────── */

export interface StatusEmailParams {
  jobId: string;
  containerNumber?: string | null;
  sizeType?: string;
  status: string;
  cycleStep: string;
  location?: string;
  eta?: string | null;
  actualDeparture?: string | null;
  remarks?: string;
  fromCity?: string;
  toCity?: string;
  trackingUrl?: string;
  emailType?: "eta" | "actual" | "status" | "single";
  shipmentType?: "import" | "export";
}

export function buildStatusEmailHtml(p: StatusEmailParams): string {
  const {
    jobId,
    containerNumber,
    sizeType,
    status,
    cycleStep,
    location,
    eta,
    actualDeparture,
    remarks,
    fromCity,
    toCity,
    trackingUrl,
    emailType = "status",
    shipmentType = "import",
  } = p;

  const isImport = shipmentType !== "export";
  const showContainer =
    containerNumber && containerNumber !== PRE_CONTAINER_SENTINEL;
  const headerTitle = resolveHeaderTitle(cycleStep, emailType, status);
  const icon = STEP_ICONS[cycleStep] || (isImport ? "📍" : "🌐");
  const routeLine =
    fromCity && toCity
      ? `${fromCity} &rarr; ${toCity}`
      : fromCity || toCity || "";
  const phaseLabel = resolvePhaseLabel(shipmentType);

  /* ── Final delivery / departure banners ─────────────────────────── */
  const isDelivered = cycleStep === "cargo_dispatch" && emailType === "actual";
  const isExportShipped =
    cycleStep === "shipped_on_board_export" && emailType === "actual";

  const celebrationBanner = isDelivered
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr>
        <td align="center" bgcolor="#dcfce7"
            style="background:#dcfce7;border:2px solid #86efac;border-radius:10px;padding:18px 22px;">
          <p style="margin:0;font-size:17px;font-weight:bold;color:#15803d;font-family:Helvetica,Arial,sans-serif;">
            Your Shipment Has Been Delivered! 🎉
          </p>
          <p style="margin:6px 0 0;font-size:13px;color:#166534;font-family:Helvetica,Arial,sans-serif;">
            Thank you for choosing ONS Logistics. We hope to serve you again soon.
          </p>
        </td>
      </tr>
    </table>`
    : isExportShipped
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr>
        <td align="center" bgcolor="#eff6ff"
            style="background:#eff6ff;border:2px solid #93c5fd;border-radius:10px;padding:18px 22px;">
          <p style="margin:0;font-size:17px;font-weight:bold;color:#1e3a8a;font-family:Helvetica,Arial,sans-serif;">
            Your Shipment Has Sailed! 🚢
          </p>
          <p style="margin:6px 0 0;font-size:13px;color:#1e40af;font-family:Helvetica,Arial,sans-serif;">
            Your export cargo is now in transit to the destination.
          </p>
        </td>
      </tr>
    </table>`
    : "";

  /* ── Context banner ─────────────────────────────────────────────── */
  const bannerBody = resolveBannerBody({
    emailType,
    cycleStep,
    status,
    eta,
    actualDeparture,
    remarks,
    shipmentType,
  });

  const bannerCfg =
    emailType === "eta" || emailType === "single"
      ? { bg: "#fffbeb", border: "#fcd34d", bodyColor: "#78350f" }
      : emailType === "actual"
      ? { bg: "#f0fdf4", border: "#86efac", bodyColor: "#166534" }
      : { bg: "#eff6ff", border: "#93c5fd", bodyColor: "#1e40af" };

  const contextBanner = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr>
        <td bgcolor="${bannerCfg.bg}"
            style="background:${bannerCfg.bg};border:2px solid ${bannerCfg.border};border-radius:10px;padding:16px 20px;">
          <p style="margin:0;font-size:14px;color:${bannerCfg.bodyColor};line-height:1.75;font-family:Helvetica,Arial,sans-serif;">
            ${bannerBody}
          </p>
        </td>
      </tr>
    </table>`;

  /* ── Remarks block ──────────────────────────────────────────────── */
  const remarksBlock = remarks
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
      <tr>
        <td bgcolor="#f8fafc"
            style="background:#f8fafc;border-left:4px solid #3b82f6;padding:12px 16px;
                   border-radius:0 6px 6px 0;font-size:13px;font-style:italic;color:#4b5563;
                   line-height:1.6;font-family:Helvetica,Arial,sans-serif;">
          <strong style="font-style:normal;color:#374151;">Note:</strong> ${remarks}
        </td>
      </tr>
    </table>`
    : "";

  /* ── Detail rows ────────────────────────────────────────────────── */
  const containerRow = showContainer
    ? detailRow(
        "Container No.",
        `${containerNumber}${
          sizeType
            ? ` <span style="color:#9ca3af;font-weight:normal;font-size:12px;">(${sizeType})</span>`
            : ""
        }`
      )
    : "";
  const locationRow = location ? detailRow("Location", location) : "";
  const etaRow =
    eta && (emailType === "eta" || emailType === "single")
      ? detailRow("Estimated Date", fmt(eta), "#b45309")
      : "";
  const confirmedRow =
    actualDeparture && emailType === "actual"
      ? detailRow("Confirmed Date", fmt(actualDeparture), "#047857")
      : "";

  /* ── CTA ────────────────────────────────────────────────────────── */
  const trackingCta = trackingUrl
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;">
      <tr>
        <td align="center">
          <a href="${trackingUrl}"
             style="display:inline-block;background:#1d4ed8;color:#ffffff;
                    font-size:14px;font-weight:bold;padding:14px 40px;
                    border-radius:999px;text-decoration:none;letter-spacing:0.3px;
                    font-family:Helvetica,Arial,sans-serif;">
            ${isImport ? "Track Your Shipment" : "Track Your Export"}
          </a>
          <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;font-family:Helvetica,Arial,sans-serif;text-align:center;">
            Or copy this link:
            <a href="${trackingUrl}" style="color:#3b82f6;word-break:break-all;font-family:Helvetica,Arial,sans-serif;">${trackingUrl}</a>
          </p>
        </td>
      </tr>
    </table>`
    : "";

  const headerGradient = isImport
    ? "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%)"
    : "linear-gradient(135deg,#065f46 0%,#059669 60%,#10b981 100%)";

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Shipment Update — ${jobId}</title>
  <style>
    body,table,td,p,a,span{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;}
  </style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#f1f5f9">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#ffffff"
               style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background:${headerGradient};padding:30px 36px 26px;">
              <p style="margin:0;color:rgba(255,255,255,0.65);font-size:11px;font-weight:bold;
                         text-transform:uppercase;letter-spacing:2px;font-family:Helvetica,Arial,sans-serif;">
                ONS Logistics India
              </p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;font-family:Helvetica,Arial,sans-serif;">
                ${phaseLabel}
              </p>
              <p style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:bold;
                         line-height:1.3;font-family:Helvetica,Arial,sans-serif;">
                ${icon}&nbsp; ${headerTitle}
              </p>
              ${
                routeLine
                  ? `
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:13px;font-family:Helvetica,Arial,sans-serif;">
                ${routeLine}
              </p>`
                  : ""
              }
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 36px;">

              ${celebrationBanner}
              ${contextBanner}
              ${remarksBlock}

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                <tr>
                  <td colspan="2" bgcolor="#f9fafb"
                      style="background:#f9fafb;padding:10px 16px;font-size:11px;font-weight:bold;
                             color:#6b7280;text-transform:uppercase;letter-spacing:1.2px;
                             border-bottom:1px solid #f0f0f0;font-family:Helvetica,Arial,sans-serif;">
                    Shipment Details
                  </td>
                </tr>
                ${detailRow("Job ID", `<span style="font-family:'Courier New',Courier,monospace;">${jobId}</span>`)}
                ${containerRow}
                ${locationRow}
                ${etaRow}
                ${confirmedRow}
              </table>

              ${trackingCta}

              <p style="margin:28px 0 0;font-size:13px;color:#6b7280;line-height:1.7;font-family:Helvetica,Arial,sans-serif;">
                Have questions about your shipment? Please reach out to your dedicated ONS Logistics coordinator and we will be happy to assist.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" bgcolor="#f8fafc"
                style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 36px;border-radius:0 0 16px 16px;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.8;font-family:Helvetica,Arial,sans-serif;">
                &copy; ${new Date().getFullYear()} ONS Logistics &nbsp;&middot;&nbsp; Automated notification — please do not reply directly to this email.
                ${
                  trackingUrl
                    ? `<br/><a href="${trackingUrl}" style="color:#3b82f6;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">View live shipment tracking</a>`
                    : ""
                }
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}