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

  trackClicks: false,
  trackOpens: false,
  mirrorActive: false,
  tags: ["no_tracking"],

  // 🔥 Required or Brevo still rewrites links
  utmCampaign: "",
  utmSource: "",
  utmMedium: "",
  utmTerm: "",
  utmContent: "",

  // 🔥 This disables Brevo’s auto-wrapping of all neutral links
  disableNeutralLinksTracking: true
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
