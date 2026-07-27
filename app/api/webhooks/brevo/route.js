export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();

    console.log("========== BREVO WEBHOOK ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("===================================");

    const event = payload.event;
    const messageId = payload["message-id"];
    const recipientEmail = payload.email;

    if (!event || !messageId || !recipientEmail) {
      return NextResponse.json({ success: true });
    }

    // Find the job containing this email
    const job = await Job.findOne({
      "emailLogs.brevo.messageId": messageId,
    });

    if (!job) {
      console.log("No matching email log found:", messageId);

      // Always return 200 so Brevo doesn't keep retrying
      return NextResponse.json({ success: true });
    }

    // Find the exact email log
    const emailLog = job.emailLogs.find(
      (log) => log.brevo?.messageId === messageId
    );

    if (!emailLog) {
      console.log("Email log not found:", messageId);
      return NextResponse.json({ success: true });
    }

    // Find the recipient that generated this webhook
    const recipient = emailLog.recipients.find(
      (r) => r.email.toLowerCase() === recipientEmail.toLowerCase()
    );

    if (!recipient) {
      console.log("Recipient not found:", recipientEmail);
      return NextResponse.json({ success: true });
    }

    const now = new Date();

    switch (event) {
      case "delivered":
        recipient.status = "delivered";
        recipient.deliveredAt = now;
        emailLog.currentStatus = "delivered";
        break;

      case "opened":
        recipient.status = "opened";
        recipient.openedAt = now;
        emailLog.currentStatus = "opened";
        break;

      case "click":
        recipient.status = "clicked";
        recipient.clickedAt = now;
        emailLog.currentStatus = "clicked";
        break;

      case "hard_bounce":
        recipient.status = "hard_bounce";
        recipient.bouncedAt = now;
        recipient.bounceReason =
          payload.reason || payload["reject-reason"] || "";
        emailLog.currentStatus = "hard_bounce";
        break;

      case "soft_bounce":
        recipient.status = "soft_bounce";
        recipient.bouncedAt = now;
        recipient.bounceReason =
          payload.reason || payload["reject-reason"] || "";
        emailLog.currentStatus = "soft_bounce";
        break;

      case "blocked":
        recipient.status = "blocked";
        emailLog.currentStatus = "blocked";
        break;

      case "invalid":
        recipient.status = "invalid";
        emailLog.currentStatus = "invalid";
        break;

      // Brevo fires this immediately after accepting the email.
      // We already record "sent" when sendClientEmail() succeeds,
      // so we intentionally ignore it.
      case "request":
        break;

      default:
        console.log("Unhandled Brevo event:", event);
        break;
    }

    // Save Brevo metadata once
    if (!emailLog.brevo.uuid && payload.uuid) {
      emailLog.brevo.uuid = payload.uuid;
    }

    if (!emailLog.brevo.sendingIp && payload["sending-ip"]) {
      emailLog.brevo.sendingIp = payload["sending-ip"];
    }

    // Keep complete history of webhook events
    emailLog.rawEvents.push({
      event,
      timestamp: now,
      payload,
    });

    await job.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Brevo webhook error:", error);

    return NextResponse.json(
      {
        error: "Webhook failed",
      },
      {
        status: 500,
      }
    );
  }
}