import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

/**
 * Normalize performedBy into ObjectId | null
 */
function normalizePerformedBy(performedBy) {
  if (!performedBy) return null;

  // Already a valid ObjectId
  if (performedBy instanceof mongoose.Types.ObjectId) {
    return performedBy;
  }

  // String cases
  if (typeof performedBy === "string") {
    // system / automation
    if (performedBy === "system" || performedBy === "admin") {
      return null;
    }

    // ObjectId string
    if (mongoose.Types.ObjectId.isValid(performedBy)) {
      return new mongoose.Types.ObjectId(performedBy);
    }

    return null;
  }

  // Object cases: session.user, { userId }, { _id }
  if (typeof performedBy === "object") {
    const id =
      performedBy.userId ||
      performedBy._id ||
      performedBy.id;

    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
  }

  return null;
}

/**
 * Centralized Audit Logger
 */
export async function logAudit({
  entityType,
  entityId,
  action,
  description,
  performedBy = null,
  meta = {},
}) {
  try {
    await connectDB();

    const normalizedPerformedBy = normalizePerformedBy(performedBy);

    await AuditLog.create({
      entityType,
      entityId,
      action,
      description,
      performedBy: normalizedPerformedBy,
      meta,
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
