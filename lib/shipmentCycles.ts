/**
 * shipmentCycles.ts
 *
 * Defines the canonical step sequence for each shipment type.
 *
 * requiresContainer  — the step can only be logged against a real container number
 * assignsContainer   — submitting this step is what allocates a container number
 * dateFields         — which date picker(s) to offer in the UI
 *   "none"    → no date
 *   "single"  → one date (generic event date, stored in eta field)
 *   "eta"     → estimated date only
 *   "actual"  → confirmed date only
 *   "both"    → user picks: estimated OR confirmed
 */

export type DateFieldMode = "none" | "single" | "eta" | "actual" | "both";

export interface CycleStep {
  key: string;
  label: string;
  phase: string;
  requiresContainer: boolean;
  assignsContainer?: boolean;
  dateFields: DateFieldMode;
  hint?: string; // shown in UI beneath the step name
}

/* ─────────────────────────────────────────────────────────────────────
   IMPORT CYCLE
   "From Country"  → steps 1-6   (pre-container until stuffing)
   "Arrived India" → steps 7-13  (container-level after POD)
───────────────────────────────────────────────────────────────────── */
export const IMPORT_CYCLE: CycleStep[] = [
  // ── From Country ────────────────────────────────────────────────
  {
    key: "booking_docs_received",
    label: "Booking Documents Received",
    phase: "From Country",
    requiresContainer: false,
    dateFields: "both",
    hint: "Date the booking documents were received from the shipper / origin agent",
  },
  {
    key: "cargo_received",
    label: "Cargo Received at Origin",
    phase: "From Country",
    requiresContainer: false,
    dateFields: "both",
    hint: "Date the cargo was physically received at the origin warehouse / CFS",
  },
  {
    key: "custom_clearance_origin",
    label: "Origin Custom Clearance",
    phase: "From Country",
    requiresContainer: false,
    dateFields: "both",
    hint: "Date origin customs clearance was completed — required before stuffing",
  },
  {
    key: "stuffing_container_allocated",
    label: "Stuffing Done & Container Allocated",
    phase: "From Country",
    requiresContainer: true,
    assignsContainer: true,
    dateFields: "both",
    hint: "Cargo stuffed; container number assigned for the first time",
  },
  {
    key: "planning_vessel",
    label: "Vessel Planning Confirmed",
    phase: "From Country",
    requiresContainer: true,
    dateFields: "both",
    hint: "Container placed on a specific vessel and voyage — ETD of the vessel",
  },
  {
    key: "shipped_on_board",
    label: "Shipped on Board",
    phase: "From Country",
    requiresContainer: true,
    dateFields: "both",
    hint: "Cargo loaded on the vessel; Bill of Lading issued",
  },

  // ── Arrived India ────────────────────────────────────────────────
  {
    key: "vessel_arrived_pod",
    label: "Vessel Arrived at POD",
    phase: "Arrived India",
    requiresContainer: true,
    dateFields: "both",
    hint: "Vessel arrived at the Port of Discharge (Nhava Sheva / Mundra / Chennai etc.)",
  },
  {
    key: "container_railment_pod",
    label: "Container Railment from POD",
    phase: "Arrived India",
    requiresContainer: true,
    dateFields: "both",
    hint: "Container moved by rail from Port of Discharge to the inland ICD",
  },
  {
    key: "arrived_local_icd",
    label: "Arrived at Local ICD",
    phase: "Arrived India",
    requiresContainer: true,
    dateFields: "both",
    hint: "Container physically arrived at the destination Inland Container Depot",
  },
  {
    key: "bill_of_entry",
    label: "Bill of Entry Filed",
    phase: "Arrived India",
    requiresContainer: false,   // one per job, not per container
    dateFields: "both",
    hint: "Bill of Entry filed with Indian Customs — starts the clearance process",
  },
  {
    key: "cargo_examination",
    label: "Cargo Examination",
    phase: "Arrived India",
    requiresContainer: false,   // one per job
    dateFields: "both",
    hint: "Customs physical examination of cargo — if applicable",
  },
  {
    key: "ooc_customs_cleared",
    label: "OOC — Customs Cleared",
    phase: "Arrived India",
    requiresContainer: false,   // one per job
    dateFields: "both",
    hint: "Out-of-Charge order issued by Customs — shipment fully cleared",
  },
  {
    key: "cargo_dispatch",
    label: "Cargo Dispatched",
    phase: "Arrived India",
    requiresContainer: true,
    dateFields: "both",
    hint: "Cargo dispatched from ICD and delivered to consignee's premises",
  },
];

/* ─────────────────────────────────────────────────────────────────────
   EXPORT CYCLE  (stub — to be built out later)
───────────────────────────────────────────────────────────────────── */
export const EXPORT_CYCLE: CycleStep[] = [
  // Placeholder — expand when export tracking is built
  {
    key: "booking_confirmed",
    label: "Booking Confirmed",
    phase: "Pre-Shipment",
    requiresContainer: false,
    dateFields: "both",
  },
  {
    key: "cargo_picked_up",
    label: "Cargo Picked Up",
    phase: "Pre-Shipment",
    requiresContainer: false,
    dateFields: "both",
  },
  {
    key: "container_stuffed",
    label: "Container Stuffed & Sealed",
    phase: "Pre-Shipment",
    requiresContainer: true,
    assignsContainer: true,
    dateFields: "both",
  },
  {
    key: "shipped_on_board_export",
    label: "Shipped on Board",
    phase: "In Transit",
    requiresContainer: true,
    dateFields: "both",
  },
  {
    key: "vessel_arrived_destination",
    label: "Vessel Arrived at Destination Port",
    phase: "Destination",
    requiresContainer: true,
    dateFields: "both",
  },
];

/* ─────────────────────────────────────────────────────────────────────
   Accessors
───────────────────────────────────────────────────────────────────── */

export function getCycleForShipment(shipmentType?: string): CycleStep[] {
  return shipmentType === "export" ? EXPORT_CYCLE : IMPORT_CYCLE;
}

export function getCycleStep(
  shipmentType: string | undefined,
  key: string
): CycleStep | undefined {
  return getCycleForShipment(shipmentType).find((s) => s.key === key);
}