// lib/sendClientEmail.js
import * as Brevo from "@getbrevo/brevo";

export default async function sendClientEmail({ to, subject, html, attachments }) {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    // Set API Key
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = {
      sender: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME || "ONS Logistics" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
       
  trackClicks: false,   // ⬅ required
  trackOpens: false,    // ⬅ required
  mirrorActive: false,  // ⬅ required

  // Brevo sometimes STILL tracks unless both are added:
  tags: ["no_tracking"],  // ⬅ extra safety
    };

    if (attachments) {
      sendSmtpEmail.attachment = attachments;
    }

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return response;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
