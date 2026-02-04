import * as mongoose from "mongoose";

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
    status: { type: String, required: true },
    location: String,
    eventDate: { type: Date, required: true },
    remarks: String,
  },
  { _id: false }
);

const ContainerSchema = new mongoose.Schema(
  {
    containerNumber: { type: String, required: true },
    sizeType: String,
    events: { type: [ContainerEventSchema], default: [] },
  },
  { _id: false }
);

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    containerNumber: String,
    status: String,
    performedBy: { type: String, default: "admin" },
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const JobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    quoteId: { type: mongoose.Schema.Types.ObjectId, ref: "Quote" },

    // Job info
    jobNumber: { type: String, default: null },
    mblNumber: { type: String, default: null },
    mblDate: { type: Date, default: null },

    hblNumber: { type: String, default: null },
    hblDate: { type: Date, default: null },

    awbNumber: { type: String, default: null },
    awbDate: { type: Date, default: null },
    // Ports
    portOfLoading: { type: String, default: null },
    portOfDischarge: { type: String, default: null },
    clearanceAt: { type: String, default: null },

    // Parties
    consignee: { type: String, default: null },
    shipper: { type: String, default: null },
    company: { type: String, default: "" },
    customerName: String,

    // Shipment
    pkgs: { type: String, default: null },
    grossWeight: { type: String, default: null },
    cbm: { type: String, default: null },

    // Customs
    beNumber: { type: String, default: null },
    beDate: { type: Date, default: null },
    assessableValue: { type: String, default: null },
    referenceNumber: { type: String, default: null },

    gigamNumber: { type: String, default: null },
    gigamDate: { type: Date, default: null },

    lignNumber: { type: String, default: null },
    lignDate: { type: Date, default: null },

    // Container
    containerNumber: { type: String, default: null },
    containerType: { type: String, default: null },
    containers: { type: [ContainerSchema], default: [] },

    // Audit log
    auditLogs: { type: [AuditLogSchema], default: [] },

    // System
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
    leadStatus: { type: String, enum: ["lead","otp_sent","verified","converted"], default: "lead" },
    leadVerifiedAt: { type: Date, default: null },

    stage: { type: String, default: "New Job" },
    documents: [DocumentSchema],
    stages: [StageSchema],
    currentStage: { type: Number, default: 1 },
    approvedBy: { type: String, default: "admin" },

    /* -----------------------------------------------------
    EDIT REQUEST WORKFLOW (Same as Technical Quote)
    ------------------------------------------------------ */

    // Step 1: Admin requests editing
    editRequestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    editRequestedAt: { type: Date, default: null },

    // Step 2: Super Admin approves
    editApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    editApprovedAt: { type: Date, default: null },

    // Step 3: Admin used the edit once
    editUsed: { type: Boolean, default: false },
  },

  { timestamps: true }
);

export default mongoose.models?.Job || mongoose.model("Job", JobSchema);
