/**
 * trackingCopy.ts
 *
 * Single source of truth for all customer-facing copy related to
 * shipment cycle steps. Imported by:
 *   - containerStatusEmail.ts  (email HTML builder)
 *   - app/tracking/[ref]/page.tsx  (public tracking page)
 *
 * Never duplicate these strings elsewhere.
 */

export const PRE_CONTAINER_SENTINEL = "__PRE_CONTAINER__";

/* ─────────────────────────────────────────────────────────────────────
   Step icons
───────────────────────────────────────────────────────────────────── */
export const STEP_ICONS: Record<string, string> = {
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
   Header / title labels per event type
   Used as the step title in emails AND as the event headline on the
   tracking page.
───────────────────────────────────────────────────────────────────── */
export const STEP_LABELS: Record<
    string,
    { eta: string; actual: string; status: string }
> = {
    // ── Import ──────────────────────────────────────────────────────
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

    // ── Export ──────────────────────────────────────────────────────
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

/**
 * Resolve the display title for a step given its eventType.
 * Falls back to the raw status label when the step is unknown.
 */
export function resolveStepTitle(
    cycleStep: string,
    eventType: "eta" | "actual" | "single" | "status",
    fallback: string
): string {
    const entry = STEP_LABELS[cycleStep];
    if (!entry) return fallback;
    if (eventType === "eta" || eventType === "single") return entry.eta;
    if (eventType === "actual") return entry.actual;
    return entry.status;
}

/* ─────────────────────────────────────────────────────────────────────
   Narrative body copy — IMPORT
───────────────────────────────────────────────────────────────────── */

/** Import ETA — forward-looking, reassuring */
export const IMPORT_ETA: Record<string, (d: string) => string> = {
    booking_docs_received: (d) =>
        `We are expecting to receive the booking documents for your shipment by ${d}. Once confirmed, we will send you an update and your shipment will be formally registered in our system.`,
    cargo_received: (d) =>
        `Your cargo is expected to reach the origin warehouse by ${d}. After physical receipt, it will be prepared for customs formalities and container stuffing.`,
    custom_clearance_origin: (d) =>
        `Origin customs clearance is expected to be completed by ${d}. This step is required before your cargo can be loaded into a container.`,
    stuffing_container_allocated: (d) =>
        `We expect your cargo to be stuffed into a container and a container number to be assigned by ${d}. You will receive the container details once this is confirmed.`,
    planning_vessel: (d) =>
        `Your container is being planned for a vessel expected to sail around ${d}. The final vessel name and voyage number will be confirmed once the carrier finalises the loading list.`,
    shipped_on_board: (d) =>
        `Your container is expected to be loaded and shipped on board the vessel by ${d}. The Bill of Lading will be issued once sailing is confirmed.`,
    vessel_arrived_pod: (d) =>
        `The vessel carrying your container is expected to arrive at the Indian Port of Discharge around ${d}. Actual arrival may vary slightly depending on the vessel's schedule.`,
    container_railment_pod: (d) =>
        `Your container is expected to be moved by rail from the Port of Discharge around ${d}, heading towards the destination Inland Container Depot.`,
    arrived_local_icd: (d) =>
        `Your container is expected to arrive at the local Inland Container Depot (ICD) by ${d}. Import customs clearance procedures will begin shortly after arrival.`,
    bill_of_entry: (d) =>
        `The Bill of Entry for your shipment is expected to be filed with Indian Customs by ${d}. This formally initiates the import clearance process.`,
    cargo_examination: (d) =>
        `Customs has indicated that a physical examination of your cargo may take place around ${d}. We will keep you informed as soon as the outcome is known.`,
    ooc_customs_cleared: (d) =>
        `We expect customs clearance (Out of Charge) to be granted by ${d}. Once issued, your cargo will be free to move and dispatch arrangements will begin immediately.`,
    cargo_dispatch: (d) =>
        `Your cargo is expected to be dispatched from the ICD and delivered to the final destination by ${d}. We will notify you as soon as it is on its way.`,
};

/** Import Actual — clear, positive, past tense */
export const IMPORT_ACTUAL: Record<string, (d: string) => string> = {
    booking_docs_received: (d) =>
        `Good news — the booking documents for your shipment were received on ${d}. Your shipment is now formally registered and the process is underway.`,
    cargo_received: (d) =>
        `Your cargo was received at the origin warehouse on ${d}. It is now being prepared for customs clearance and loading into the container.`,
    custom_clearance_origin: (d) =>
        `Origin customs clearance was completed on ${d}. Your cargo has been cleared and is ready for stuffing and vessel loading.`,
    stuffing_container_allocated: (d) =>
        `Your cargo was successfully stuffed into a container on ${d} and a container number has been allocated. Your shipment is now ready to be loaded onto the vessel.`,
    planning_vessel: (d) =>
        `Your container has been confirmed on a vessel as of ${d}. The vessel and voyage details are now finalised — your shipment is heading to India.`,
    shipped_on_board: (d) =>
        `Your container was loaded and shipped on board the vessel on ${d}. The Bill of Lading has been issued and your shipment is now on its way to India.`,
    vessel_arrived_pod: (d) =>
        `The vessel carrying your container arrived at the Indian Port of Discharge on ${d}. Discharge operations are underway and your container will be moved to the ICD shortly.`,
    container_railment_pod: (d) =>
        `Your container was dispatched by rail from the Port of Discharge on ${d} and is now in transit to the destination Inland Container Depot.`,
    arrived_local_icd: (d) =>
        `Your container arrived at the local Inland Container Depot (ICD) on ${d}. Import customs clearance procedures have been initiated.`,
    bill_of_entry: (d) =>
        `The Bill of Entry for your shipment was filed with Indian Customs on ${d}. Assessment is in progress and we will keep you updated on the clearance status.`,
    cargo_examination: (d) =>
        `Customs completed the physical examination of your cargo on ${d}. We are awaiting the Out of Charge (OOC) order, which will allow your cargo to be dispatched.`,
    ooc_customs_cleared: (d) =>
        `Customs clearance (Out of Charge) was granted on ${d}. Your cargo is now fully cleared and delivery arrangements are being made.`,
    cargo_dispatch: (d) =>
        `Your cargo was dispatched from the ICD on ${d} and is now on its way to the final destination. Thank you for choosing ONS Logistics — we look forward to serving you again.`,
};

/** Import Status-only — present tense, no date */
export const IMPORT_STATUS: Record<string, string> = {
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
   Narrative body copy — EXPORT
───────────────────────────────────────────────────────────────────── */

export const EXPORT_ETA: Record<string, (d: string) => string> = {
    booking_confirmed: (d) =>
        `Your export booking is expected to be confirmed by ${d}. Once finalised, we will share the booking reference and next steps.`,
    cargo_picked_up: (d) =>
        `We are expecting to pick up your cargo by ${d} and bring it to the designated stuffing point.`,
    container_stuffed: (d) =>
        `Your cargo is expected to be stuffed and the container sealed by ${d}. A container number will be assigned at this stage.`,
    shipped_on_board_export: (d) =>
        `Your container is expected to be loaded on board the export vessel and sail by ${d}. The Bill of Lading will be issued once confirmed.`,
    vessel_arrived_destination: (d) =>
        `The vessel carrying your export cargo is expected to arrive at the destination port around ${d}. Delivery formalities at the destination will follow.`,
};

export const EXPORT_ACTUAL: Record<string, (d: string) => string> = {
    booking_confirmed: (d) =>
        `Your export booking was confirmed on ${d}. Your shipment is now registered and we will keep you updated as it progresses.`,
    cargo_picked_up: (d) =>
        `Your cargo was picked up on ${d} and is now at the stuffing location, ready to be loaded into the container.`,
    container_stuffed: (d) =>
        `Your cargo was stuffed and the container sealed on ${d}. The container is now ready for port delivery and loading.`,
    shipped_on_board_export: (d) =>
        `Your container was loaded and shipped on board the vessel on ${d}. Your export shipment is now in transit to the destination.`,
    vessel_arrived_destination: (d) =>
        `The vessel carrying your export cargo arrived at the destination port on ${d}. Delivery arrangements at the destination are now underway.`,
};

export const EXPORT_STATUS: Record<string, string> = {
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
   Master resolver — returns the narrative body string for any event.
   Used by both the email builder (with HTML bold tags) and the
   tracking page (plain text, bold applied via CSS on the element).
───────────────────────────────────────────────────────────────────── */
export interface ResolveBodyParams {
    cycleStep: string;
    eventType: "eta" | "actual" | "single" | "status";
    status: string;
    eta?: string | null;
    actualDeparture?: string | null;
    remarks?: string;
    shipmentType: "import" | "export";
    /** Pass true from the email builder to wrap dates in <strong> tags. */
    htmlBold?: boolean;
}

export function resolveEventBody(p: ResolveBodyParams): string {
    const isImport = p.shipmentType !== "export";

    function bold(text: string): string {
        return p.htmlBold ? `<strong>${text}</strong>` : text;
    }

    function fmtDate(date: string | Date | null | undefined): string {
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

    if (p.eventType === "eta" || p.eventType === "single") {
        const dateStr = bold(fmtDate(p.eta));
        const fn = isImport ? IMPORT_ETA[p.cycleStep] : EXPORT_ETA[p.cycleStep];
        if (fn) return fn(dateStr);
        if (p.remarks) return `${p.remarks} — estimated by ${dateStr}.`;
        return `Your shipment is estimated to reach the next stage by ${dateStr}.`;
    }

    if (p.eventType === "actual") {
        const dateStr = bold(fmtDate(p.actualDeparture));
        const fn = isImport ? IMPORT_ACTUAL[p.cycleStep] : EXPORT_ACTUAL[p.cycleStep];
        if (fn) return fn(dateStr);
        if (p.remarks) return `${p.remarks} — confirmed on ${dateStr}.`;
        return `This milestone was completed on ${dateStr}.`;
    }

    // status-only
    const msg = isImport ? IMPORT_STATUS[p.cycleStep] : EXPORT_STATUS[p.cycleStep];
    if (msg) return msg;
    if (p.remarks) return p.remarks;
    return `Your shipment status has been updated to ${bold(p.status)}.`;
}