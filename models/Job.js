import * as mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  name: String,
  fileUrl: { type: String, default: null },
  uploadedFile: String, // URL of uploaded file
    uploadedAt: Date,
  confirmed: { type: Boolean, default: false },
  confirmedAt: { type: Date, default: null },
});
const StageSchema = new mongoose.Schema({
  number: Number,
  name: String,
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
});
const ContainerEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true }, // e.g. Gate In, Loaded, Discharged
    location: { type: String },
    eventDate: { type: Date, required: true },
    remarks: { type: String },
  },
  { _id: false }
);

const ContainerSchema = new mongoose.Schema(
  {
    containerNumber: { type: String, required: true },
    sizeType: String, // 20GP, 40HC, etc
    events: { type: [ContainerEventSchema], default: [] },
  },
  { _id: false }
);
const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. "container_status_added"

    containerNumber: String,
    status: String,

    performedBy: {
      type: String,
      default: "admin", // later replace with real user ID/email
    },

    metadata: mongoose.Schema.Types.Mixed, // future-proof

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);


const JobSchema = new mongoose.Schema(
  {
    // Auto-generated: SEA-IM-25-00001
    jobId: { type: String, required: true },

    // Link to quote
    quoteId: { type: mongoose.Schema.Types.ObjectId, ref: "Quote" },

    // -------------------------
    // 1. JOB INFORMATION
    // -------------------------
    jobNumber: { type: String, default: null }, // Optional secondary ref
    mblNumber: { type: String, default: null },
    mblDate: { type: Date, default: null },

    hblNumber: { type: String, default: null },
    hblDate: { type: Date, default: null },

    // -------------------------
    // 2. PORTS & LOCATIONS
    // -------------------------
    portOfLoading: { type: String, default: null },
    portOfDischarge: { type: String, default: null },
    clearanceAt: { type: String, default: null },

    // -------------------------
    // 3. PARTIES
    // -------------------------
    consignee: { type: String, default: null },
    shipper: { type: String, default: null },company: { type: String, default: "" },
    company: { type: String, default: "" },
    customerName: String,


    // -------------------------
    // 4. SHIPMENT DETAILS
    // -------------------------
    pkgs: { type: String, default: null },
    grossWeight: { type: String, default: null },
    cbm: { type: String, default: null },

    // -------------------------
    // 5. CUSTOMS & CLEARANCE
    // -------------------------
    beNumber: { type: String, default: null },
    beDate: { type: Date, default: null },
    assessableValue: { type: String, default: null },
    referenceNumber: { type: String, default: null },

    gigamNumber: { type: String, default: null },
    gigamDate: { type: Date, default: null },

    lignNumber: { type: String, default: null },
    lignDate: { type: Date, default: null },

    // -------------------------
    // 6. CONTAINER INFORMATION
    // -------------------------
    containerNumber: { type: String, default: null },
    containerType: { type: String, default: null },

    // -------------------------
    // 7. COMMODITY
    // -------------------------
    commodity: { type: String, default: null },

    containers: { type: [ContainerSchema], default: [] },

    auditLogs: {
      type: [AuditLogSchema],
      default: [],
    },
    // -------------------------
    // SYSTEM FIELDS
    // -------------------------
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
    

    stage: {
      type: String,
      default: "New Job",
    },
    documents: [DocumentSchema],
     stages: [StageSchema],
  currentStage: { type: Number, default: 1 }, // New Job

    approvedBy: { type: String, default: "admin" }, // Will replace with real user later
  },

  { timestamps: true }
);

export default mongoose.models?.Job || mongoose.model("Job", JobSchema);
