export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ---------------- POST — add new event ---------------- */

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, containerNumber, sizeType, event } = await req.json();

    if (!jobId || !containerNumber || !event?.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await Job.findById(jobId).populate("quoteId");
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const QuotationLinkedWithJob = await Quote.findById(job.quoteId);
    if (!QuotationLinkedWithJob)
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

    const emailIdForShipmentUpdates =
      QuotationLinkedWithJob.email || job.quoteId?.clientEmail;

    if (!emailIdForShipmentUpdates) {
      console.warn(`No client email found for job ${jobId}.`);
    }

    /* Find or create container */
    let container = job.containers.find((c) => c.containerNumber === containerNumber);
    if (!container) {
      container = { containerNumber, sizeType, events: [] };
      job.containers.push(container);
      container = job.containers[job.containers.length - 1];
    }

    /*
     * Duplicate check — keyed on status + eventType together.
     * Same status is allowed twice if one is "eta" and the other is "actual".
     * e.g. "Gate In (ETA)" and "Gate In (Actual)" can both exist.
     *
     * eventType derived from what was filled:
     *   eta filled            → "eta"
     *   actualDeparture filled → "actual"
     *   neither               → "status"
     */
    
    const incomingEventType = event.eta
      ? "eta"
      : event.actualDeparture
        ? "actual"
        : "status";

    const isDuplicate = (container.events || []).some(
      (e) => e.status === event.status && (e.eventType || "status") === incomingEventType
    );

    if (isDuplicate) {
      return NextResponse.json(
        {
          error: `A "${incomingEventType}" event for status "${event.status}" already exists for this container`,
        },
        { status: 400 }
      );
    }

    /* Add event — store eventType field */
    container.events.push({
      status: event.status,
      eventType: incomingEventType,
      location: event.location || "",
      remarks: event.remarks || "",
      eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
      eta: event.eta ? new Date(event.eta) : null,
      actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      createdAt: new Date(),
    });

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_added",
      description: `Status "${event.status}" (${incomingEventType}) added for container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: {
        status: event.status,
        eventType: incomingEventType,
        location: event.location || null,
        remarks: event.remarks || null,
        eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
        eta: event.eta ? new Date(event.eta) : null,
        actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      },
    });

    await job.save();

    return NextResponse.json({ job, clientEmail: emailIdForShipmentUpdates });
  } catch (err) {
    console.error("Container event error:", err);
    return NextResponse.json({ error: "Failed to update container status" }, { status: 500 });
  }
}

/* ---------------- PATCH — edit existing event ---------------- */

export async function PATCH(req) {
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

    const container = job.containers.find((c) => c.containerNumber === containerNumber);
    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }

    if (!container.events?.[eventIndex]) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const incomingEventType = event.eta
      ? "eta"
      : event.actualDeparture
        ? "actual"
        : "status";

    /* Duplicate check — allow same index, key on status + eventType */
    const isDuplicate = container.events.some(
      (e, i) =>
        i !== eventIndex &&
        e.status === event.status &&
        (e.eventType || "status") === incomingEventType
    );

    if (isDuplicate) {
      return NextResponse.json(
        {
          error: `A "${incomingEventType}" event for status "${event.status}" already exists for this container`,
        },
        { status: 400 }
      );
    }

    const oldStatus = container.events[eventIndex].status;

    container.events[eventIndex] = {
      ...(container.events[eventIndex].toObject?.() || container.events[eventIndex]),
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
      description: `Status "${oldStatus}" → "${event.status}" (${incomingEventType}) for container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: { oldStatus, newStatus: event.status, incomingEventType, eventIndex },
    });

    await job.save();

    const QuotationLinkedWithJob = await Quote.findById(job.quoteId);
    const clientEmail =
      QuotationLinkedWithJob?.email || job.quoteId?.clientEmail || null;

    return NextResponse.json({ job, clientEmail });
  } catch (err) {
    console.error("Edit event error:", err);
    return NextResponse.json({ error: "Failed to edit event" }, { status: 500 });
  }
}

/* ---------------- DELETE — remove event ---------------- */

export async function DELETE(req) {
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

    const container = job.containers.find((c) => c.containerNumber === containerNumber);
    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }

    if (!container.events?.[eventIndex]) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const removedStatus = container.events[eventIndex].status;
    const removedType = container.events[eventIndex].eventType || "status";
    container.events.splice(eventIndex, 1);

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_deleted",
      description: `Status "${removedStatus}" (${removedType}) deleted from container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: { removedStatus, removedType, eventIndex },
    });

    await job.save();
    return NextResponse.json({ job });
  } catch (err) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}