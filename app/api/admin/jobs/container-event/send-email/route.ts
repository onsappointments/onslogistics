export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import sendClientEmail from "@/lib/sendClientEmail";
import { buildStatusEmailHtml, buildSubjectLine } from "@/lib/emails/containerStatusEmail";
import { PRE_CONTAINER_SENTINEL } from "@/models/Job";

// ─────────────────────────────────────────────────────────────────────────────
// POST — send (or resend) a status email for a container event.
//
// isResend = true  → email only, no event mutation, no timestamp stamp.
//                    Use when the operator wants to re-notify without
//                    changing the recorded status (EC-13).
// isResend = false → normal flow: stamp etaEmailSentAt / actualEmailSentAt
//                    on the matching event and write an audit log entry.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      jobId,
      containerNumber,
      sizeType,
      event,
      emailType,        // "eta" | "actual" | "single" | "status"
      recipientEmail,
      trackingUrl,
      fromCity,
      toCity,
      isResend = false, // NEW — true means email-only, no DB mutation
    } = await req.json();

    if (!jobId || !containerNumber || !event?.status || !recipientEmail || !emailType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const shipmentType: "import" | "export" =
      job.shipmentType === "export" ? "export" : "import";

    // ── Resolve cycleStep from the stored event (preferred) or payload ──
    const container = job.containers.find(
      (c: any) =>
        c.containerNumber.trim().toLowerCase() ===
        containerNumber.trim().toLowerCase()
    );

    const matchedEventIndex =
      container
        ? [...container.events]
          .map((e: any, i: number) => ({ e, i }))
          .reverse()
          .find(({ e }: { e: any }) => e.status === event.status)?.i
        : undefined;

    const dbEvent =
      container && matchedEventIndex !== undefined
        ? container.events[matchedEventIndex]
        : null;

    const cycleStep: string =
      dbEvent?.cycleStep ||
      event?.cycleStep ||
      event?.stepKey ||
      event?.key ||
      "";

    // ── Build and send email ──────────────────────────────────────────
    const html = buildStatusEmailHtml({
      jobId: job.jobId,
      containerNumber:
        containerNumber === PRE_CONTAINER_SENTINEL ? null : containerNumber,
      sizeType,
      status: event.status,
      cycleStep,
      location: event.location,
      eta: event.eta ?? null,
      actualDeparture: event.actualDeparture ?? null,
      remarks: event.remarks,
      fromCity,
      toCity,
      trackingUrl,
      emailType,
      shipmentType,
    });

    const subject = buildSubjectLine({
      shipmentType,
      emailType,
      containerNumber,
      jobId: job.jobId,
      status: event.status,
    });

    await sendClientEmail({ to: recipientEmail, subject, html });

    // ── On a normal send (not resend), stamp the event ────────────────
    if (!isResend && container && matchedEventIndex !== undefined) {
      const now = new Date();
      if (emailType === "eta" || emailType === "single") {
        container.events[matchedEventIndex].etaEmailSentAt = now;
      }
      if (emailType === "actual") {
        container.events[matchedEventIndex].actualEmailSentAt = now;
      }
    }

    // ── Audit log — distinguishes send vs resend ─────────────────────
    job.auditLogs.push({
      entityType: "container",
      action: isResend ? "email_resent" : "email_sent",
      description: `[${shipmentType.toUpperCase()}] ${isResend ? "Resent" : "Sent"
        } ${emailType} email to ${recipientEmail} for container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: { emailType, recipientEmail, shipmentType, isResend, cycleStep },
    });

    await job.save();
    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}