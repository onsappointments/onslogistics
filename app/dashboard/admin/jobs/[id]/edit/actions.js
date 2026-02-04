"use server";

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logAudit } from "@/lib/audit";

export async function updateJob(formData) {
  await connectDB();

  /* ---------------- AUTH ---------------- */

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const isSuperAdmin = session.user.adminType === "super_admin";

  /* ---------------- ID ---------------- */

  const id = formData.get("id");
  if (!id) {
    throw new Error("Job id missing");
  }

  /* ---------------- FETCH BEFORE ---------------- */

  const beforeJob = await Job.findById(id).lean();
  if (!beforeJob) {
    throw new Error("Job not found");
  }

  /* ---------------- PERMISSION CHECK (SERVER-SIDE) ---------------- */

  const isNewJob = beforeJob.status === "new";

  const isApprovedRequester =
    beforeJob.editRequestedBy &&
    String(beforeJob.editRequestedBy) === String(session.user.id) &&
    beforeJob.editApprovedAt &&
    beforeJob.editUsed === false;

  const canEdit = isSuperAdmin || isNewJob || isApprovedRequester;

  if (!canEdit) {
    throw new Error("Edit not allowed");
  }

  /* ---------------- UPDATE PAYLOAD ---------------- */

  const update = {
    jobNumber: formData.get("jobNumber") || null,

    mblNumber: formData.get("mblNumber") || null,
    mblDate: formData.get("mblDate") || null,
    hblNumber: formData.get("hblNumber") || null,
    hblDate: formData.get("hblDate") || null,
    awbNumber: formData.get("awbNumber") || null,
    awbDate: formData.get("awbDate") || null,

    portOfLoading: formData.get("portOfLoading") || null,
    portOfDischarge: formData.get("portOfDischarge") || null,
    clearanceAt: formData.get("clearanceAt") || null,

    consignee: formData.get("consignee") || null,
    shipper: formData.get("shipper") || null,

    pkgs: formData.get("pkgs") || null,
    grossWeight: formData.get("grossWeight") || null,
    cbm: formData.get("cbm") || null,

    beNumber: formData.get("beNumber") || null,
    beDate: formData.get("beDate") || null,
    assessableValue: formData.get("assessableValue") || null,
    referenceNumber: formData.get("referenceNumber") || null,
    gigamNumber: formData.get("gigamNumber") || null,
    gigamDate: formData.get("gigamDate") || null,
    lignNumber: formData.get("lignNumber") || null,
    lignDate: formData.get("lignDate") || null,

    containerNumber: formData.get("containerNumber") || null,
    containerType: formData.get("containerType") || null,

    commodity: formData.get("commodity") || null,
  };

  // ✅ consume the edit after one successful save (only for approved requester)
  if (!isSuperAdmin && !isNewJob) {
    update.editUsed = true;

    // optional but recommended: reset workflow fields (locks again & cleans state)
    update.editRequestedBy = null;
    update.editRequestedAt = null;
    update.editApprovedBy = null;   // super admin who approved
    update.editApprovedAt = null;
    update.editRequestRemarks = ""; // if you added this field
  }

  /* ---------------- UPDATE & FETCH AFTER ---------------- */

  const afterJob = await Job.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();

  /* ---------------- DIFF ---------------- */

  const changes = {};

  for (const key of Object.keys(update)) {
    const before = beforeJob[key] ?? null;
    const after = afterJob[key] ?? null;

    if (String(before) !== String(after)) {
      changes[key] = { from: before, to: after };
    }
  }

  /* ---------------- AUDIT LOG ---------------- */

  if (Object.keys(changes).length > 0) {
    await logAudit({
      entityType: "job",
      entityId: afterJob._id,
      action: "job_updated",
      description: `Job ${afterJob.jobId} updated`,
      performedBy: session.user.id,
      meta: {
        jobId: afterJob.jobId,
        changes,
      },
    });
  }

  /* ---------------- REDIRECT ---------------- */

  redirect(`/dashboard/admin/jobs/${id}`);
}
