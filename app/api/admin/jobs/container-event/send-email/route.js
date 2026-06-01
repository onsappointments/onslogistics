export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import sendClientEmail from "@/lib/sendClientEmail";
import { buildStatusEmailHtml } from "@/lib/emails/containerStatusEmail";


export async function POST(req) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            jobId, containerNumber, sizeType, event,
            emailType, recipientEmail,
            trackingUrl, fromCity, toCity,
        } = await req.json();

        if (!jobId || !containerNumber || !event?.status || !recipientEmail || !emailType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const job = await Job.findById(jobId);
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        const container = job.containers.find(c => c.containerNumber === containerNumber);
        if (!container) return NextResponse.json({ error: "Container not found" }, { status: 404 });

        // Find the event by status (most recent match)
        const eventIndex = [...container.events]
            .map((e, i) => ({ e, i }))
            .reverse()
            .find(({ e }) => e.status === event.status)?.i;

        /* Build and send email */
        const html = buildStatusEmailHtml({
            jobId: job.jobId,
            containerNumber,
            sizeType,
            status: event.status,
            location: event.location,
            eta: event.eta ? new Date(event.eta) : null,
            actualDeparture: event.actualDeparture ? new Date(event.actualDeparture) : null,
            remarks: event.remarks,
            fromCity,
            toCity,
            trackingUrl,
            emailType,
        });

        const subjects = {
            eta: `Arrival Expected: ${containerNumber} — Job ${job.jobId}`,
            actual: `Departure Confirmed: ${containerNumber} — Job ${job.jobId}`,
            status: `Shipment Update: ${event.status} — Job ${job.jobId}`,
        };

        await sendClientEmail({
            to: recipientEmail,
            subject: subjects[emailType] || subjects.status,
            html,
        });

        /* Stamp sent timestamp on the event */
        if (eventIndex !== undefined) {
            const now = new Date();
            if (emailType === "eta") {
                container.events[eventIndex].etaEmailSentAt = now;
            } else if (emailType === "actual") {
                container.events[eventIndex].actualEmailSentAt = now;
            }
            job.auditLogs.push({
                entityType: "container",
                action: "email_sent",
                description: `${emailType} email sent to ${recipientEmail} for container ${containerNumber}`,
                performedBy: session.user.id,
                performedAt: new Date(),
                reference: { jobId: job.jobId, containerNumber },
                metadata: { emailType, recipientEmail },
            });
            await job.save();
        }

        return NextResponse.json({ job });
    } catch (err) {
        console.error("Send email error:", err);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}