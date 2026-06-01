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
    if (!QuotationLinkedWithJob) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

    const emailIdForShipmentUpdates = QuotationLinkedWithJob.email || job.quoteId?.clientEmail; 

    if (!emailIdForShipmentUpdates) {
      console.warn(`No client email found for job ${jobId}. Skipping shipment update email.`);
    }

    /* Find or create container */
    let container = job.containers.find((c) => c.containerNumber === containerNumber);
    if (!container) {
      container = { containerNumber, sizeType, events: [] };
      job.containers.push(container);
      container = job.containers[job.containers.length - 1];
    }

    /* No duplicate status */
    if ((container.events || []).some((e) => e.status === event.status)) {
      return NextResponse.json(
        { error: `Status "${event.status}" already exists for this container` },
        { status: 400 }
      );
    }

    /* Add event */
    container.events.push({
      status: event.status,
      location: event.location || "",
      remarks: event.remarks || "",
      eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
      eta: event.eta ? new Date(event.eta) : null,
      actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      createdAt: new Date(),
    });

    /* Audit log */
    job.auditLogs.push({
      entityType: "container",
      action: "container_status_added",
      description: `Status "${event.status}" added for container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: {
        status: event.status,
        location: event.location || null,
        remarks: event.remarks || null,
        eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
        eta: event.eta ? new Date(event.eta) : null,
        actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      },
    });

    await job.save();

    return NextResponse.json({ job , clientEmail: emailIdForShipmentUpdates });
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

    if (jobId === undefined || containerNumber === undefined || eventIndex === undefined || !event?.status) {
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

    /* Check duplicate status (allow same index) */
    const isDuplicate = container.events.some(
      (e, i) => e.status === event.status && i !== eventIndex
    );
    if (isDuplicate) {
      return NextResponse.json(
        { error: `Status "${event.status}" already exists for this container` },
        { status: 400 }
      );
    }

    const oldStatus = container.events[eventIndex].status;

    /* Update */
    container.events[eventIndex] = {
      ...container.events[eventIndex].toObject?.() || container.events[eventIndex],
      status: event.status,
      location: event.location || "",
      remarks: event.remarks || "",
      eventDate: event.eventDate ? new Date(event.eventDate) : container.events[eventIndex].eventDate,
      eta: event.eta ? new Date(event.eta) : null,
      actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    };

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_edited",
      description: `Status changed from "${oldStatus}" to "${event.status}" for container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: { oldStatus, newStatus: event.status, eventIndex },
    });

    await job.save();
    return NextResponse.json({ job });
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

    if (jobId === undefined || containerNumber === undefined || eventIndex === undefined) {
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
    container.events.splice(eventIndex, 1);

    job.auditLogs.push({
      entityType: "container",
      action: "container_status_deleted",
      description: `Status "${removedStatus}" deleted from container ${containerNumber}`,
      performedBy: session.user.id,
      performedAt: new Date(),
      reference: { jobId: job.jobId, containerNumber },
      metadata: { removedStatus, eventIndex },
    });

    await job.save();
    return NextResponse.json({ job });
  } catch (err) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}