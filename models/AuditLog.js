import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: [
        "quote",
        "technical_quote",
        "job",
        "job_document",
        "container",
        "container_event",
        "notification",
      ],
      required: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = system or client
    },

    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
