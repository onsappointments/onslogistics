export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PRE_CONTAINER_SENTINEL } from "@/models/Job";
import { getCycleStep, getCycleForShipment } from "@/lib/shipmentCycles";

// ─────────────────────────────────────────────────────────────────────────────
// Steps that always route to the sentinel (job-level) bucket regardless of
// what the client sends.
// ─────────────────────────────────────────────────────────────────────────────

const JOB_LEVEL_STEPS = new Set([
  "booking_docs_received",
  "cargo_received",
  "custom_clearance_origin",
  "bill_of_entry",
  "cargo_examination",
  "ooc_customs_cleared",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the effective containerNumber for an event.
 * Job-level steps always go to the sentinel bucket.
 * Container-level steps require a real container number.
 */
function resolveContainerNumber(
  cycleStepKey: string,
  cycleStepDef: any,
  suppliedContainerNumber: string | undefined
): string {
  if (JOB_LEVEL_STEPS.has(cycleStepKey) || !cycleStepDef?.requiresContainer) {
    return PRE_CONTAINER_SENTINEL;
  }
  if (!suppliedContainerNumber || suppliedContainerNumber === PRE_CONTAINER_SENTINEL) {
    throw new Error(
      `Step "${cycleStepDef.label}" requires a container number — please provide one.`
    );
  }
  return suppliedContainerNumber;
}

/**
 * Derive eventType from the event payload.
 * actualDeparture filled → "actual"
 * eta filled             → "eta"
 * neither                → "single"
 */
function deriveEventType(event: any): "actual" | "eta" | "single" {
  if (event.actualDeparture) return "actual";
  if (event.eta) return "eta";
  return "single";
}

/**
 * Check for an exact duplicate: same cycleStep + same eventType on the same container.
 * Allows the same step to have both an "eta" and an "actual" record.
 * excludeIndex lets PATCH skip the record being edited.
 */
function isDuplicateEvent(
  events: any[],
  cycleStep: string,
  eventType: string,
  excludeIndex = -1
): boolean {
  return events.some(
    (e, i) =>
      i !== excludeIndex &&
      e.cycleStep === cycleStep &&
      (e.eventType || "single") === eventType
  );
}

/**
 * Detect a sequence violation: the incoming step's cycle index is earlier than
 * the highest cycle index already recorded for this container.
 *
 * Returns a human-readable warning string, or null if no violation.
 * The violation is advisory — the API still saves the event.
 */
function detectSequenceViolation(
  shipmentType: string,
  containerEvents: any[],
  incomingCycleStep: string,
  excludeIndex = -1
): string | null {
  const cycle = getCycleForShipment(shipmentType);
  const stepIndex = cycle.findIndex((s) => s.key === incomingCycleStep);
  if (stepIndex === -1) return null; // unknown step — can't check

  // Collect indices of all existing events on this container (excluding the edited one)
  const existingIndices = containerEvents
    .filter((_, i) => i !== excludeIndex)
    .map((e) => cycle.findIndex((s) => s.key === e.cycleStep))
    .filter((i) => i !== -1);

  if (existingIndices.length === 0) return null;

  const maxExisting = Math.max(...existingIndices);
  if (stepIndex < maxExisting) {
    const latestStep = cycle[maxExisting];
    const incomingStep = cycle[stepIndex];
    return `"${incomingStep.label}" is earlier in the cycle than the most recently recorded step "${latestStep.label}". The event has been saved, but please verify this is intentional.`;
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST — add new event
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, containerNumber, sizeType, event } = await req.json();

    if (!jobId || !event?.cycleStep || !event?.status) {
      return NextResponse.json(
        { error: "Missing required fields: jobId, event.cycleStep, event.status" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId).populate("quoteId");
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // ── Validate cycle step belongs to this shipment type ────────────
    const cycleStepDef = getCycleStep(job.shipmentType, event.cycleStep);
    if (!cycleStepDef) {
      return NextResponse.json(
        {
          error: `Step "${event.cycleStep}" is not valid for a ${
            job.shipmentType ?? "import"
          } shipment.`,
        },
        { status: 400 }
      );
    }

    // ── Resolve container number ──────────────────────────────────────
    let effectiveContainerNumber: string;
    try {
      effectiveContainerNumber = resolveContainerNumber(
        event.cycleStep,
        cycleStepDef,
        containerNumber
      );
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const incomingEventType = deriveEventType(event);

    // ── Client email ─────────────────────────────────────────────────
    const QuotationLinkedWithJob = await Quote.findById(job.quoteId);
    const clientEmail =
      QuotationLinkedWithJob?.email || job.quoteId?.clientEmail || null;

    // ── Find or create container bucket ──────────────────────────────
    let container = job.containers.find(
      (c: any) => c.containerNumber === effectiveContainerNumber
    );
    if (!container) {
      job.containers.push({
        containerNumber: effectiveContainerNumber,
        sizeType:
          effectiveContainerNumber === PRE_CONTAINER_SENTINEL ? null : sizeType,
        events: [],
      });
      container = job.containers[job.containers.length - 1];
    }

    // ── Duplicate check ───────────────────────────────────────────────
    if (isDuplicateEvent(container.events, event.cycleStep, incomingEventType)) {
      return NextResponse.json(
        {
          error: `A "${incomingEventType}" record for "${cycleStepDef.label}" already exists on this container. Edit the existing record instead.`,
        },
        { status: 400 }
      );
    }

    // ── Sequence violation check (advisory — does not block save) ────
    const sequenceWarning = detectSequenceViolation(
      job.shipmentType ?? "import",
      container.events,
      event.cycleStep
    );

    // ── Push event ───────────────────────────────────────────────────
    container.events.push({
      cycleStep: event.cycleStep,
      status: event.status,
      eventType: incomingEventType,
      location: event.location || "",
      remarks: event.remarks || "",
      eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
      eta: event.eta ? new Date(event.eta) : null,
      actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      createdAt: new Date(),
    });

    // ── Update job-level container fields if this step assigns one ───
    if (cycleStepDef.assignsContainer && containerNumber) {
      job.containerNumber = containerNumber;
      job.containerType = sizeType || job.containerType;
    }

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_added",
      description: `[${job.shipmentType?.toUpperCase() ?? "IMPORT"}] "${
        cycleStepDef.label
      }" (${incomingEventType}) added for container ${effectiveContainerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber: effectiveContainerNumber },
      metadata: {
        cycleStep: event.cycleStep,
        status: event.status,
        eventType: incomingEventType,
        shipmentType: job.shipmentType,
        location: event.location || null,
        remarks: event.remarks || null,
        eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
        eta: event.eta ? new Date(event.eta) : null,
        actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
        sequenceViolation: !!sequenceWarning,
      },
    });

    await job.save();
    return NextResponse.json({ job, clientEmail, sequenceWarning: sequenceWarning ?? null });
  } catch (err) {
    console.error("Container event error:", err);
    return NextResponse.json(
      { error: "Failed to update container status" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH — edit existing event
// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, containerNumber, eventIndex, event } = await req.json();

    if (
      jobId === undefined ||
      containerNumber === undefined ||
      eventIndex === undefined ||
      !event?.status
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await Job.findById(jobId).populate("quoteId");
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const container = job.containers.find(
      (c: any) => c.containerNumber === containerNumber
    );
    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }
    if (!container.events?.[eventIndex]) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const incomingEventType = deriveEventType(event);
    const cycleStep = event.cycleStep ?? container.events[eventIndex].cycleStep;

    if (isDuplicateEvent(container.events, cycleStep, incomingEventType, eventIndex)) {
      return NextResponse.json(
        {
          error: `A "${incomingEventType}" record for this step already exists on this container.`,
        },
        { status: 400 }
      );
    }

    // ── Sequence violation check ──────────────────────────────────────
    const sequenceWarning = detectSequenceViolation(
      job.shipmentType ?? "import",
      container.events,
      cycleStep,
      eventIndex
    );

    const oldStatus = container.events[eventIndex].status;

    container.events[eventIndex] = {
      ...(container.events[eventIndex].toObject?.() ?? container.events[eventIndex]),
      cycleStep,
      status: event.status,
      eventType: incomingEventType,
      location: event.location || "",
      remarks: event.remarks || "",
      eventDate: event.eventDate
        ? new Date(event.eventDate)
        : container.events[eventIndex].eventDate,
      eta: event.eta ? new Date(event.eta) : null,
      actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    };

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_edited",
      description: `[${job.shipmentType?.toUpperCase() ?? "IMPORT"}] "${oldStatus}" → "${
        event.status
      }" (${incomingEventType}) for container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: {
        oldStatus,
        newStatus: event.status,
        incomingEventType,
        eventIndex,
        cycleStep,
        sequenceViolation: !!sequenceWarning,
      },
    });

    await job.save();

    const QuotationLinkedWithJob = await Quote.findById(job.quoteId);
    const clientEmail =
      QuotationLinkedWithJob?.email || job.quoteId?.clientEmail || null;

    return NextResponse.json({ job, clientEmail, sequenceWarning: sequenceWarning ?? null });
  } catch (err) {
    console.error("Edit event error:", err);
    return NextResponse.json({ error: "Failed to edit event" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE — remove event
// ─────────────────────────────────────────────────────────────────────────────

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, containerNumber, eventIndex } = await req.json();

    if (
      jobId === undefined ||
      containerNumber === undefined ||
      eventIndex === undefined
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const container = job.containers.find(
      (c: any) => c.containerNumber === containerNumber
    );
    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }
    if (!container.events?.[eventIndex]) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const removedStatus = container.events[eventIndex].status;
    const removedCycleStep = container.events[eventIndex].cycleStep;
    const removedType = container.events[eventIndex].eventType || "single";
    container.events.splice(eventIndex, 1);

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_deleted",
      description: `[${job.shipmentType?.toUpperCase() ?? "IMPORT"}] "${removedStatus}" (${removedType}) deleted from container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: { removedStatus, removedCycleStep, removedType, eventIndex },
    });

    await job.save();
    return NextResponse.json({ job });
  } catch (err) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}