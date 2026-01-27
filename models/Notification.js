import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "EDIT_REQUEST",
        "EDIT_APPROVED",
        "EDIT_REJECTED",
        "JOB_EDIT_REQUEST",
        "JOB_EDIT_APPROVED",
        "JOB_EDIT_REJECTED",
        "GENERAL",
      ],
      required: true,
    },

    quoteId: { type: mongoose.Schema.Types.ObjectId, ref: "TechnicalQuote" },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },

    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedByEmail: { type: String, required: true },
    requestedByName: { type: String, required: true },

    remarks: { type: String, default: "" },

    message: { type: String, required: true },

    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "read"],
      default: "pending",
    },

    readBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date },
      },
    ],

    // ✅ NEW: auto-delete time (only set for approved)
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ✅ TTL index (MongoDB auto-deletes after expiresAt time passes)
notificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
