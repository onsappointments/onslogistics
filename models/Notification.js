// models/Notification.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["EDIT_REQUEST", "EDIT_APPROVED", "EDIT_REJECTED", "GENERAL"],
      required: true,
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnicalQuote",
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
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;