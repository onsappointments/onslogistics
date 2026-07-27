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

    // Ignore request event (already handled when email is sent)
    if (event === "request") {
      return NextResponse.json({ success: true });
    }

    const job = await Job.findOne(
      {
        "emailLogs.brevo.messageId": messageId,
      },
      {
        emailLogs: 1,
      }
    );

    if (!job) {
      console.log("No email log found:", messageId);
      return NextResponse.json({ success: true });
    }

    const emailLogIndex = job.emailLogs.findIndex(
      (log) => log.brevo?.messageId === messageId
    );

    if (emailLogIndex === -1) {
      console.log("Email log not found:", messageId);
      return NextResponse.json({ success: true });
    }

    const recipientIndex = job.emailLogs[emailLogIndex].recipients.findIndex(
      (r) => r.email.toLowerCase() === recipientEmail.toLowerCase()
    );

    if (recipientIndex === -1) {
      console.log("Recipient not found:", recipientEmail);
      return NextResponse.json({ success: true });
    }

    const now = new Date();

    const update = {
      $set: {},
      $push: {},
    };

    const recipientPrefix = `emailLogs.${emailLogIndex}.recipients.${recipientIndex}`;
    const emailPrefix = `emailLogs.${emailLogIndex}`;

    switch (event) {
      case "delivered":
        update.$set[`${recipientPrefix}.status`] = "delivered";
        update.$set[`${recipientPrefix}.deliveredAt`] = now;
        update.$set[`${emailPrefix}.currentStatus`] = "delivered";
        break;

      case "opened":
        update.$set[`${recipientPrefix}.status`] = "opened";
        update.$set[`${recipientPrefix}.openedAt`] = now;
        update.$set[`${emailPrefix}.currentStatus`] = "opened";
        break;

      case "click":
        update.$set[`${recipientPrefix}.status`] = "clicked";
        update.$set[`${recipientPrefix}.clickedAt`] = now;
        update.$set[`${emailPrefix}.currentStatus`] = "clicked";
        break;

      case "soft_bounce":
        update.$set[`${recipientPrefix}.status`] = "soft_bounce";
        update.$set[`${recipientPrefix}.bouncedAt`] = now;
        update.$set[`${recipientPrefix}.bounceReason`] =
          payload.reason || payload["reject-reason"] || "";
        update.$set[`${emailPrefix}.currentStatus`] = "soft_bounce";
        break;

      case "hard_bounce":
        update.$set[`${recipientPrefix}.status`] = "hard_bounce";
        update.$set[`${recipientPrefix}.bouncedAt`] = now;
        update.$set[`${recipientPrefix}.bounceReason`] =
          payload.reason || payload["reject-reason"] || "";
        update.$set[`${emailPrefix}.currentStatus`] = "hard_bounce";
        break;

      case "blocked":
        update.$set[`${recipientPrefix}.status`] = "blocked";
        update.$set[`${emailPrefix}.currentStatus`] = "blocked";
        break;

      case "invalid":
        update.$set[`${recipientPrefix}.status`] = "invalid";
        update.$set[`${emailPrefix}.currentStatus`] = "invalid";
        break;

      default:
        console.log("Unhandled event:", event);
        return NextResponse.json({ success: true });
    }

    // Save metadata once
    if (!job.emailLogs[emailLogIndex].brevo?.uuid && payload.uuid) {
      update.$set[`${emailPrefix}.brevo.uuid`] = payload.uuid;
    }

    if (!job.emailLogs[emailLogIndex].brevo?.sendingIp && payload.sending_ip) {
      update.$set[`${emailPrefix}.brevo.sendingIp`] = payload.sending_ip;
    }

    if (payload.tags?.length) {
      update.$set[`${emailPrefix}.brevo.tags`] = payload.tags;
    }

    update.$push[`${emailPrefix}.rawEvents`] = {
      event,
      timestamp: now,
      payload,
    };

    await Job.updateOne(
      { _id: job._id },
      update
    );

    return NextResponse.json({ success: true });
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