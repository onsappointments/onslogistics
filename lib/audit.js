import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

/**
 * @param {Object} payload
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

    await AuditLog.create({
      entityType,
      entityId,
      action,
      description,
      performedBy,
      meta,
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
