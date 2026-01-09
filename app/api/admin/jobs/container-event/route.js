export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import mongoose from "mongoose";

/* ---------------- STATUS FLOW ---------------- */

const STATUS_FLOW = [
  "Empty Picked Up",
  "Gate In",
  "Loaded on Vessel",
  "Vessel Departed",
  "Arrived at Transshipment Port",
  "Vessel Arrived",
  "Discharged",
  "Gate Out",
  "Delivered",
];

/* ---------------- POST ---------------- */

export async function POST(req) {
  try {
    await connectDB();

    const { jobId, containerNumber, sizeType, event } = await req.json();

    if (!jobId || !containerNumber || !event?.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!STATUS_FLOW.includes(event.status)) {
      return NextResponse.json(
        { error: "Invalid container status" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    /* -------- FIND OR CREATE CONTAINER -------- */

    let container = job.containers.find(
      (c) => c.containerNumber === containerNumber
    );

    if (!container) {
      container = {
        containerNumber,
        sizeType,
        events: [],
      };
      job.containers.push(container);
    }

    /* -------- VALIDATION LOGIC -------- */

    const existingEvents = container.events || [];

    // Prevent duplicate status
    if (existingEvents.some((e) => e.status === event.status)) {
      return NextResponse.json(
        { error: `Status "${event.status}" already exists for this container` },
        { status: 400 }
      );
    }

    // Enforce forward-only flow
    if (existingEvents.length > 0) {
      const lastStatus = existingEvents[existingEvents.length - 1].status;

      const lastIndex = STATUS_FLOW.indexOf(lastStatus);
      const newIndex = STATUS_FLOW.indexOf(event.status);

      if (newIndex < lastIndex) {
        return NextResponse.json(
          {
            error: `Invalid status order. Cannot move from "${lastStatus}" to "${event.status}".`,
          },
          { status: 400 }
        );
      }
    }

    /* -------- ADD EVENT -------- */

    container.events.push({
      status: event.status,
      location: event.location || "",
      remarks: event.remarks || "",
      eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
      createdAt: new Date(),
      createdBy: req.user?._id || null, // optional if auth middleware exists
    });
    job.auditLogs.push({
      action: "container_status_added",
      containerNumber,
      status: event.status,
      performedBy: "admin", // later: req.user.email
      metadata: {
        location: event.location,
        remarks: event.remarks,
      },
    });
    
      

    await job.save();

    return NextResponse.json({ job });
  } catch (err) {
    console.error("Container event error:", err);
    return NextResponse.json(
      { error: "Failed to update container status" },
      { status: 500 }
    );
  }
}
