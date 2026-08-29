/**
 * containerStatusEmail.ts
 *
 * Builds the transactional HTML email sent to clients whenever a
 * container event is recorded in ONS Logistics India Pvt Ltd.
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
  forwarding: "🚚",
  reached_destination: "📍",
  delivered_to_consignee: "🎉",
  // Export
booking_confirmed: "📋",
cargo_received_export: "📦",
shipping_bill_filed: "📄",
let_export_order: "✅",
container_allocated: "🚛",
container_stuffed: "🏗️",
gate_in_terminal: "🏢",
vgm_submitted: "⚖️",
vessel_planning: "🗓️",
shipped_on_board_export: "🚢",
vessel_departed: "🌊",
transshipment: "🔄",
vessel_arrived_destination: "🛳️",
cargo_available_destination: "📦",
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
  forwarding: {
  eta: "Forwarding Expected",
  actual: "Forwarding Started",
  status: "Forwarding in Progress",
},

reached_destination: {
  eta: "Expected Arrival at Destination",
  actual: "Reached Destination",
  status: "Destination Reached",
},

delivered_to_consignee: {
  eta: "Expected Final Delivery",
  actual: "Delivered to Consignee",
  status: "Delivered Successfully",
},

 // ── Export ────────────────────────────────────────────────────────
booking_confirmed: {
  eta: "Export Booking Confirmation Expected",
  actual: "Export Booking Confirmed",
  status: "Export Booking Processing",
},

cargo_received_export: {
  eta: "Cargo Receipt Expected",
  actual: "Cargo Received",
  status: "Cargo Received at Origin",
},

shipping_bill_filed: {
  eta: "Shipping Bill Filing Expected",
  actual: "Shipping Bill Filed",
  status: "Shipping Bill Processing",
},

let_export_order: {
  eta: "Let Export Order Expected",
  actual: "Let Export Order Granted",
  status: "Export Customs Clearance Completed",
},

container_allocated: {
  eta: "Container Allocation Expected",
  actual: "Container Allocated",
  status: "Container Allocation Completed",
},

container_stuffed: {
  eta: "Container Stuffing Expected",
  actual: "Container Stuffed & Sealed",
  status: "Container Stuffing Completed",
},

gate_in_terminal: {
  eta: "Port Terminal Gate-In Expected",
  actual: "Container Gated In at Port Terminal",
  status: "Container at Port Terminal",
},

vgm_submitted: {
  eta: "Verified Gross Mass Submission Expected",
  actual: "Verified Gross Mass Submitted",
  status: "Verified Gross Mass Submitted",
},

vessel_planning: {
  eta: "Vessel Planning Expected",
  actual: "Vessel Planning Confirmed",
  status: "Awaiting Vessel Loading",
},

shipped_on_board_export: {
  eta: "Expected Vessel Loading & Departure",
  actual: "Shipped on Board",
  status: "Export Shipment in Transit",
},

vessel_departed: {
  eta: "Expected Vessel Departure",
  actual: "Vessel Departed",
  status: "Ocean Transit in Progress",
},

transshipment: {
  eta: "Expected Transshipment",
  actual: "Transshipment Completed",
  status: "Awaiting Connecting Vessel",
},

vessel_arrived_destination: {
  eta: "Expected Arrival at Destination Port",
  actual: "Vessel Arrived at Destination Port",
  status: "Destination Port Operations",
},

cargo_available_destination: {
  eta: "Cargo Availability Expected",
  actual: "Cargo Available at Destination",
  status: "Awaiting Customs Clearance & Delivery",
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
    `Your container is expected to be loaded and shipped on board the vessel by <strong>${d}</strong>.`,
  vessel_arrived_pod: (d) =>
    `The vessel carrying your container is expected to arrive at the Indian Port of Discharge around <strong>${d}</strong>. Actual arrival may vary slightly depending on the vessel's schedule.`,
  container_railment_pod: (d) =>
    `Your container is expected to be moved by rail from the Port of Discharge around <strong>${d}</strong>, heading towards the destination Inland Container Depot.`,
  arrived_local_icd: (d) =>
    `Your container is expected to arrive at the local Inland Container Depot (ICD) by <strong>${d}</strong>.`,
  bill_of_entry: (d) =>
    `The Bill of Entry for your shipment is expected to be filed with Indian Customs by <strong>${d}</strong>. This formally initiates the import clearance process.`,
  cargo_examination: (d) =>
    `Customs has indicated that a physical examination of your cargo may take place around <strong>${d}</strong>. We will keep you informed as soon as the outcome is known.`,
  ooc_customs_cleared: (d) =>
    `We expect customs clearance (Out of Charge) to be granted by <strong>${d}</strong>. Once issued, your cargo will be free to move and dispatch arrangements will begin immediately.`,
  cargo_dispatch: (d) =>
    `Your cargo is expected to be dispatched from the ICD and delivered to the final destination by <strong>${d}</strong>. We will notify you as soon as it is on its way.`,
  forwarding: (d) =>
  `Your shipment is expected to be forwarded towards the final destination by <strong>${d}</strong>. We will keep you updated as the shipment progresses.`,

reached_destination: (d) =>
  `Your shipment is expected to reach the destination by <strong>${d}</strong>. We will notify you once arrival has been confirmed.`,

delivered_to_consignee: (d) =>
  `Your shipment is expected to be delivered to the consignee by <strong>${d}</strong>. We will confirm once delivery has been completed.`,
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
    `Your container was loaded and shipped on board the vessel on <strong>${d}</strong>. Your shipment is now on its way to India.`,
  vessel_arrived_pod: (d) =>
    `The vessel carrying your container arrived at the Indian Port of Discharge on <strong>${d}</strong>. Discharge operations are underway and your container will be moved to the ICD shortly.`,
  container_railment_pod: (d) =>
    `Your container was dispatched by rail from the Port of Discharge on <strong>${d}</strong> and is now in transit to the destination Inland Container Depot.`,
  arrived_local_icd: (d) =>
    `Your container arrived at the local Inland Container Depot (ICD) on <strong>${d}</strong>.`,
  bill_of_entry: (d) =>
    `The Bill of Entry for your shipment was filed with Indian Customs on <strong>${d}</strong>. Assessment is in progress and we will keep you updated on the clearance status.`,
  cargo_examination: (d) =>
    `Customs completed the physical examination of your cargo on <strong>${d}</strong>. We are awaiting the Out of Charge (OOC) order, which will allow your cargo to be dispatched.`,
  ooc_customs_cleared: (d) =>
    `Customs clearance (Out of Charge) was granted on <strong>${d}</strong>. Your cargo is now fully cleared and delivery arrangements are being made.`,
  cargo_dispatch: (d) =>
    `Your cargo was dispatched from the ICD on <strong>${d}</strong> and is now on its way to the final destination. Thank you for choosing ONS Logistics India Pvt Ltd— we look forward to serving you again.`,
  forwarding: (d) =>
  `Your shipment has been forwarded towards the final destination as of <strong>${d}</strong>. It is now progressing through the final delivery stage.`,

reached_destination: (d) =>
  `Your shipment reached the destination on <strong>${d}</strong>. The shipment is now at the destination and the final delivery process can proceed.`,

delivered_to_consignee: (d) =>
  `Your shipment was successfully delivered to the consignee on <strong>${d}</strong>. Thank you for choosing ONS Logistics India Pvt Ltd. We look forward to serving you again.`,
};

/* ─────────────────────────────────────────────────────────────────────
   IMPORT — Status-only copy
───────────────────────────────────────────────────────────────────── */
const IMPORT_STATUS: Record<string, string> = {
  booking_docs_received:
    "The booking documents for your shipment have been received and are being processed. Your shipment is now officially registered with ONS Logistics. India Pvt Ltd",
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
    "Your cargo has been dispatched from the ICD and is on its way to the final destination. Thank you for choosing ONS Logistics. India Pvt Ltd ",
    forwarding:
  "Your shipment is currently being forwarded towards the final destination. We will continue to keep you updated on its progress.",

reached_destination:
  "Your shipment has reached the destination. The final delivery process is now underway.",

delivered_to_consignee:
  "Your shipment has been successfully delivered to the consignee. Thank you for choosing ONS Logistics India Pvt Ltd.",
};

/* ─────────────────────────────────────────────────────────────────────
   EXPORT — ETA copy
───────────────────────────────────────────────────────────────────── */
const EXPORT_ETA: Record<string, (d: string) => string> = {
  booking_confirmed: (d) =>
    `Your export booking is expected to be confirmed by <strong>${d}</strong>. Once the booking is finalized with the shipping line, we will share the booking reference and begin planning the export process.`,

  cargo_received_export: (d) =>
    `We expect to receive your cargo at the designated warehouse or stuffing location by <strong>${d}</strong>. After receipt, the cargo will undergo documentation verification and preparation for export customs clearance.`,

  shipping_bill_filed: (d) =>
    `Your Shipping Bill is expected to be filed with Indian Customs by <strong>${d}</strong>. This is the official export declaration required before customs assessment and export clearance can begin.`,

  let_export_order: (d) =>
    `Indian Customs is expected to grant the <strong>Let Export Order (LEO)</strong> by <strong>${d}</strong>. Once approved, your cargo will be legally authorized for export and can proceed for vessel loading.`,

  container_allocated: (d) =>
    `A shipping container is expected to be allocated for your cargo by <strong>${d}</strong>. Once assigned, we will share the container number and equipment details with you.`,

  container_stuffed: (d) =>
    `Your cargo is expected to be stuffed into the allocated container and sealed by <strong>${d}</strong>. After stuffing is completed, the container will be prepared for transportation to the port terminal.`,

  gate_in_terminal: (d) =>
    `Your container is expected to enter the port terminal by <strong>${d}</strong>. Following gate-in, the terminal operator will prepare it for loading onto the scheduled vessel.`,

  vgm_submitted: (d) =>
    `The Verified Gross Mass (VGM) declaration is expected to be submitted by <strong>${d}</strong>. This mandatory SOLAS requirement confirms the certified weight of the container before it can be loaded onto the vessel.`,

  vessel_planning: (d) =>
    `Your container is expected to be planned onto the scheduled vessel by <strong>${d}</strong>. Once the shipping line confirms the loading plan, we will share the vessel name and voyage details.`,

  shipped_on_board_export: (d) =>
    `Your container is expected to be loaded on board the vessel and depart from the Port of Loading by <strong>${d}</strong>. Once loading is confirmed,  your shipment will officially begin its ocean journey.`,

  vessel_departed: (d) =>
    `The vessel carrying your shipment is expected to depart from the Port of Loading on <strong>${d}</strong>. Your cargo will then begin its voyage toward the destination country.`,

  transshipment: (d) =>
    `Your shipment is expected to be transferred to a connecting vessel around <strong>${d}</strong> at the designated transshipment port. This is a normal part of many international shipping routes and does not indicate any issue with your shipment.`,

  vessel_arrived_destination: (d) =>
    `The vessel carrying your shipment is expected to arrive at the destination port around <strong>${d}</strong>. Upon arrival, discharge operations will begin before local import procedures can commence.`,

  cargo_available_destination: (d) =>
    `Your cargo is expected to become available at the destination terminal by <strong>${d}</strong> following vessel discharge. The consignee or destination agent can then proceed with import customs clearance and delivery arrangements.`,

  delivered_to_consignee: (d) =>
    `Your shipment is expected to be delivered to the consignee by <strong>${d}</strong>. Once delivery has been completed successfully, the export shipment cycle will be concluded.`,
};

/* ─────────────────────────────────────────────────────────────────────
   EXPORT — Actual copy
───────────────────────────────────────────────────────────────────── */
const EXPORT_ACTUAL: Record<string, (d: string) => string> = {
  booking_confirmed: (d) =>
    `Good news — your export booking was confirmed on <strong>${d}</strong>. Your shipment has now been registered with the shipping line, and our operations team has begun coordinating the export process.`,

  cargo_received_export: (d) =>
    `Your cargo was successfully received at our designated warehouse or stuffing location on <strong>${d}</strong>. Documentation verification and export customs preparation are now underway.`,

  shipping_bill_filed: (d) =>
    `Your Shipping Bill was successfully filed with Indian Customs on <strong>${d}</strong>. Customs assessment has now commenced, and we will continue to monitor the clearance process on your behalf.`,

  let_export_order: (d) =>
    `Great news — Indian Customs granted the <strong>Let Export Order (LEO)</strong> on <strong>${d}</strong>. Your cargo has successfully completed export customs clearance and is now authorized to leave India.`,

  container_allocated: (d) =>
    `A shipping container was allocated to your shipment on <strong>${d}</strong>. The assigned container is now scheduled for stuffing, and the container details have been recorded for shipment tracking.`,

  container_stuffed: (d) =>
    `Your cargo was successfully stuffed into the allocated container and sealed on <strong>${d}</strong>. The container is now fully prepared for transportation to the port terminal and vessel loading.`,

  gate_in_terminal: (d) =>
    `Your container successfully entered the port terminal on <strong>${d}</strong>. Terminal handling operations have begun, and the container is now awaiting loading onto the scheduled vessel.`,

  vgm_submitted: (d) =>
    `The Verified Gross Mass (VGM) declaration was successfully submitted on <strong>${d}</strong>. Your shipment now meets the mandatory weight verification requirements for vessel loading.`,

  vessel_planning: (d) =>
    `Your container was successfully planned onto the scheduled vessel on <strong>${d}</strong>. The vessel allocation has been confirmed, and your shipment is now awaiting final loading.`,

  shipped_on_board_export: (d) =>
    `Your container was successfully loaded on board the vessel on <strong>${d}</strong>.  Your shipment has officially commenced its ocean journey toward the destination country.`,

  vessel_departed: (d) =>
    `The vessel departed from the Port of Loading on <strong>${d}</strong>. Your shipment is now sailing toward the destination country according to the planned voyage schedule.`,

  transshipment: (d) =>
    `Your shipment successfully completed transshipment on <strong>${d}</strong> and has been transferred to the connecting vessel. It has resumed its journey toward the final destination.`,

  vessel_arrived_destination: (d) =>
    `The vessel carrying your shipment arrived at the destination port on <strong>${d}</strong>. Port discharge operations are now underway, after which your cargo will become available for import customs clearance and local delivery.`,

  cargo_available_destination: (d) =>
    `Your cargo became available at the destination terminal on <strong>${d}</strong> following vessel discharge. The consignee or destination agent may now proceed with import customs clearance and final delivery arrangements.`,

  delivered_to_consignee: (d) =>
    `Your shipment was successfully delivered to the consignee on <strong>${d}</strong>. Thank you for choosing ONS Logistics India Pvt Ltd. We sincerely appreciate your trust and look forward to supporting your future logistics requirements.`,
};
/* ─────────────────────────────────────────────────────────────────────
   EXPORT — Status-only copy
───────────────────────────────────────────────────────────────────── */
const EXPORT_STATUS: Record<string, string> = {
  booking_confirmed:
    "Your export booking has been confirmed with the shipping line. Your shipment is now officially registered, and our operations team has begun coordinating the export process.",

  cargo_received_export:
    "Your cargo has been received at the designated warehouse or stuffing location. Documentation verification and export customs preparations are currently in progress.",

  shipping_bill_filed:
    "The Shipping Bill for your shipment has been filed with Indian Customs. Customs assessment is currently in progress before export clearance can be granted.",

  let_export_order:
    "Indian Customs has granted the Let Export Order (LEO) for your shipment. Your cargo has successfully completed export customs clearance and is authorized for export.",

  container_allocated:
    "A shipping container has been allocated for your shipment. The assigned container is now being prepared for cargo stuffing and onward movement to the port terminal.",

  container_stuffed:
    "Your cargo has been successfully stuffed into the container and sealed. The container is now ready for transportation to the port terminal for vessel loading.",

  gate_in_terminal:
    "Your container has successfully entered the port terminal. Terminal handling operations are in progress, and the container is awaiting loading onto the scheduled vessel.",

  vgm_submitted:
    "The Verified Gross Mass (VGM) declaration has been submitted successfully. Your shipment now meets the mandatory weight verification requirements for vessel loading.",

  vessel_planning:
    "Your container has been allocated to the scheduled vessel. Final loading arrangements are being coordinated with the shipping line prior to departure.",

  shipped_on_board_export:
    "Your container has been successfully loaded on board the vessel. The Bill of Lading has been issued, and your shipment is currently sailing toward the destination country.",

  vessel_departed:
    "The vessel carrying your shipment has departed from the Port of Loading. Your cargo is currently in ocean transit toward the destination country.",

  transshipment:
    "Your shipment is currently at the designated transshipment port and is awaiting transfer to the connecting vessel. This is a standard part of many international shipping routes.",

  vessel_arrived_destination:
    "The vessel carrying your shipment has arrived at the destination port. Port discharge operations are currently underway before your cargo becomes available for import customs clearance.",

  cargo_available_destination:
    "Your cargo is now available at the destination terminal. The consignee or destination agent may proceed with import customs clearance and final delivery arrangements.",

  delivered_to_consignee:
    "Your shipment has been successfully delivered to the consignee. Thank you for choosing ONS Logistics India Pvt Ltd. We appreciate the opportunity to handle your shipment and look forward to serving you again.",
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

export function resolveTrackingDescription({
  shipmentType,
  cycleStep,
  eventType,
  status,
  eta,
  actualDeparture,
  remarks,
}: {
  shipmentType: "import" | "export";
  cycleStep: string;
  eventType: "eta" | "actual" | "status" | "single";
  status: string;
  eta?: string | Date | null;
  actualDeparture?: string | Date | null;
  remarks?: string;
}) {
  return resolveBannerBody({
    shipmentType,
    cycleStep,
    emailType: eventType,
    status,
    eta: eta ? String(eta) : undefined,
    actualDeparture: actualDeparture ? String(actualDeparture) : undefined,
    remarks,
  });
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
            Thank you for choosing ONS Logistics India Pvt Ltd. We hope to serve you again soon.
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
                ONS Logistics India Pvt Ltd
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
                Have questions about your shipment? Please reach out to your dedicated ONS Logistics  coordinator and we will be happy to assist.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" bgcolor="#f8fafc"
                style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 36px;border-radius:0 0 16px 16px;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.8;font-family:Helvetica,Arial,sans-serif;">
                &copy; ${new Date().getFullYear()} ONS Logistics India Pvt Ltd &nbsp;&middot;&nbsp; Automated notification — please do not reply directly to this email.
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