// lib/sendClientEmail.js
import * as Brevo from "@getbrevo/brevo";

export default async function sendClientEmail({
  to,
  subject,
  html,
  attachments,
  cc = [],
  bcc = [],
  shipmentType = null, // "import" | "export" | null (quotes/default)
}) {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    // Set API Key
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // ✅ Aggressively clean the HTML to remove any newlines in href attributes
    let cleanHtml = html;

    // Remove ALL newlines, tabs, and extra whitespace within href attributes
    cleanHtml = cleanHtml.replace(/href="([^"]*)"/g, (match, url) => {
      const cleanUrl = url
        .replace(/[\n\r\t]/g, "") // Remove newlines and tabs
        .replace(/\s+/g, "") // Remove all whitespace
        .trim();

      return `href="${cleanUrl}"`;
    });

    // Also clean any newlines that might be in the HTML structure
    cleanHtml = cleanHtml.replace(/>\s+</g, "><");

    // Debug log in production
    console.log("=== SENDING EMAIL ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Shipment Type:", shipmentType);
    console.log("HTML length:", cleanHtml.length);
    console.log("First 300 chars:", cleanHtml.substring(0, 300));
    console.log("==================");

    const permanentCC = [
      process.env.EMAIL_CC_1,
      process.env.EMAIL_CC_2,
    ].filter(Boolean);

    // ✅ Decide sender email
    let senderEmail = process.env.SALES_EMAIL_FROM;

    if (shipmentType === "import") {
      senderEmail = process.env.IMPORT_EMAIL_FROM;
    } else if (shipmentType === "export") {
      senderEmail = process.env.EXPORT_EMAIL_FROM;
    }

    const sendSmtpEmail = {
  sender: {
    email: senderEmail,
    name: process.env.EMAIL_FROM_NAME || "ONS Logistics India",
  },

  to: [{ email: to }],

  subject,
  htmlContent: cleanHtml,

  trackClicks: false,
  trackOpens: false,
  mirrorActive: false,
  tags: ["no_tracking"],

  utmCampaign: "",
  utmSource: "",
  utmMedium: "",
  utmTerm: "",
  utmContent: "",

  disableNeutralLinksTracking: true,
};

// Add CC only if it exists
const ccRecipients = [
  ...permanentCC,
  ...cc,
]
  .map((email) => email?.trim())
  .filter(Boolean);

if (ccRecipients.length > 0) {
  sendSmtpEmail.cc = ccRecipients.map((email) => ({ email }));
}

// Add BCC only if it exists
const bccRecipients = bcc
  .map((email) => email?.trim())
  .filter(Boolean);

if (bccRecipients.length > 0) {
  sendSmtpEmail.bcc = bccRecipients.map((email) => ({ email }));
}

    if (attachments) {
      sendSmtpEmail.attachment = attachments;
    }

    

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

const messageId = response.body.messageId;

const recipients = [
  {
    email: to,
    type: "to",
  },

  ...permanentCC.map((email) => ({
    email,
    type: "cc",
  })),

  ...cc.map((email) => ({
    email,
    type: "cc",
  })),

  ...bcc.map((email) => ({
    email,
    type: "bcc",
  })),
];

console.log("✅ Email sent successfully:", messageId);
console.log("Sender:", senderEmail);

return {
  messageId,
  recipients,
};
  } catch (error) {
  console.error("❌ Email sending error");

  console.error("Status:", error.status);
  console.error("Message:", error.message);
  console.error("Body:", error.body);
  console.error("Response:", error.response);
  console.error("Full error:", JSON.stringify(error, null, 2));

  throw error;
}
}