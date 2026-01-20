import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      // ✅ Add JOB_* types (keeps quote ones intact)
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

    // existing (for technical quotes)
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnicalQuote",
    },

    // ✅ NEW (for jobs)
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedByEmail: {
      type: String,
      required: true,
    },
    requestedByName: {
      type: String,
      required: true,
    },

    // ✅ optional but useful for remarks
    remarks: { type: String, default: "" },

    message: {
      type: String,
      required: true,
    },

    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "read"],
      default: "pending",
    },

    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
