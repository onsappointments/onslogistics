import * as mongoose from "mongoose";

// ─────────────────────────────────────────────
// Sub-schemas
// ─────────────────────────────────────────────

const DocumentSchema = new mongoose.Schema({
  name: String,
  fileUrl: { type: String, default: null },
  uploadedFile: String,
  uploadedAt: Date,
  confirmed: { type: Boolean, default: false },
  confirmedAt: { type: Date, default: null },
});

const StageSchema = new mongoose.Schema({
  number: Number,
  name: String,
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const ContainerEventSchema = new mongoose.Schema(
  {
    /**
     * cycleStep — the stable key from IMPORT_CYCLE / EXPORT_CYCLE
     * (e.g. "booking_docs_received", "vessel_arrived_pod")
     * Required going forward; legacy events may not have it.
     */
    cycleStep: { type: String, default: null },

    /**
     * status — human-readable label shown in UI and emails.
     * For cycle-driven events this mirrors the cycle step label.
     */
    status: { type: String, required: true },

    /**
     * eventType:
     *   "single"  — a plain dated event (no ETA/actual split)
     *   "eta"     — ETA date recorded
     *   "actual"  — Actual date recorded
     *   "status"  — legacy fallback
     */
    eventType: { type: String, default: "status" },

    location: { type: String, default: "" },
    remarks: { type: String, default: "" },

    // Date fields
    eventDate: { type: Date, default: null },
    eta: { type: Date, default: null },
    actualDeparture: { type: Date, default: null },

    // Email sent timestamps
    etaEmailSentAt: { type: Date, default: null },
    actualEmailSentAt: { type: Date, default: null },

    // Tracking
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, default: null },
  },
  { _id: false }
);

/**
 * PRE_CONTAINER_SENTINEL
 * Steps recorded before a container number is allocated are stored
 * under this special containerNumber so the schema stays flat.
 * UI and email builder recognise this value and render accordingly.
 */
export const PRE_CONTAINER_SENTINEL = "__PRE_CONTAINER__";

const ContainerSchema = new mongoose.Schema(
  {
    /**
     * containerNumber — real number OR the sentinel "__PRE_CONTAINER__"
     * for steps that occur before a container is assigned.
     */
    containerNumber: { type: String, required: true },
    sizeType: { type: String, default: null },
    events: { type: [ContainerEventSchema], default: [] },
  },
  { _id: false }
);

const AuditLogSchema = new mongoose.Schema(
  {
    entityType: { type: String, default: "container" },
    action: { type: String, required: true },
    description: { type: String, default: "" },
    containerNumber: String,
    status: String,
    performedBy: { type: String, default: "admin" },
    performedAt: { type: Date, default: Date.now },
    reference: { type: mongoose.Schema.Types.Mixed, default: null },
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// Main Job schema
// ─────────────────────────────────────────────

const JobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    quoteId: { type: mongoose.Schema.Types.ObjectId, ref: "Quote" },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedToName: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // ── Shipment type (drives which cycle is used) ──────────────
    shipmentType: {
      type: String,
      enum: ["import", "export", null],
      default: null,
    },
    commodity: { type: String, default: null },

    // ── Job identifiers ─────────────────────────────────────────
    jobNumber: { type: String, default: null },
    bookingNumber: { type: String, default: null },
    bookingDate: { type: Date, default: null },
    invoiceNumber: { type: String, default: null },
    invoiceDate: { type: Date, default: null },
    mblNumber: { type: String, default: null },
    mblDate: { type: Date, default: null },
    hblNumber: { type: String, default: null },
    hblDate: { type: Date, default: null },
    awbNumber: { type: String, default: null },
    awbDate: { type: Date, default: null },

    // ── Ports ───────────────────────────────────────────────────
    portOfLoading: { type: String, default: null },
    portOfDischarge: { type: String, default: null },
    clearanceAt: { type: String, default: null },

    // ── Parties ─────────────────────────────────────────────────
    consignee: { type: String, default: null },
    shipper: { type: String, default: null },
    company: { type: String, default: "" },
    customerName: String,

    // ── Shipment measurements ────────────────────────────────────
    pkgs: { type: String, default: null },
    grossWeight: { type: String, default: null },
    cbm: { type: String, default: null },

    // ── Customs ─────────────────────────────────────────────────
    beNumber: { type: String, default: null },
    beDate: { type: Date, default: null },
    sbNumber: { type: String, default: null },
    sbDate: { type: Date, default: null },
    assessableValue: { type: String, default: null },
    referenceNumber: { type: String, default: null },
    gigamNumber: { type: String, default: null },
    gigamDate: { type: Date, default: null },
    lignNumber: { type: String, default: null },
    lignDate: { type: Date, default: null },

    // ── Container (legacy flat fields kept for backward compat) ──
    containerNumber: { type: String, default: null },
    containerType: { type: String, default: null },

    /**
     * containers[] — the structured event log.
     * Includes a "__PRE_CONTAINER__" bucket for pre-allocation steps.
     */
    containers: { type: [ContainerSchema], default: [] },

    // ── Audit ────────────────────────────────────────────────────
    auditLogs: { type: [AuditLogSchema], default: [] },

    // ── System ──────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["new", "active", "completed"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["quote", "manual"],
      default: "manual",
    },
    technicalQuoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnicalQuote",
      default: null,
    },
    clientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    leadStatus: {
      type: String,
      enum: ["lead", "otp_sent", "verified", "converted"],
      default: "lead",
    },
    leadVerifiedAt: { type: Date, default: null },

    stage: { type: String, default: "New Job" },
    documents: [DocumentSchema],
    stages: [StageSchema],
    currentStage: { type: Number, default: 1 },
    approvedBy: { type: String, default: "admin" },

    // ── Edit request workflow ────────────────────────────────────
    editRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    editRequestedAt: { type: Date, default: null },
    editApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    editApprovedAt: { type: Date, default: null },
    editUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models?.Job || mongoose.model("Job", JobSchema);