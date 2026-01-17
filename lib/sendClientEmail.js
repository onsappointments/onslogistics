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

    // ✅ Aggressively clean the HTML to remove any newlines in href attributes
    let cleanHtml = html;
    
    // Remove ALL newlines, tabs, and extra whitespace within href attributes
    cleanHtml = cleanHtml.replace(/href="([^"]*)"/g, (match, url) => {
      const cleanUrl = url
        .replace(/[\n\r\t]/g, '')  // Remove newlines and tabs
        .replace(/\s+/g, '')       // Remove all whitespace
        .trim();
      return `href="${cleanUrl}"`;
    });
    
    // Also clean any newlines that might be in the HTML structure
    cleanHtml = cleanHtml.replace(/>\s+</g, '><');
    
    // Debug log in production
    console.log('=== SENDING EMAIL ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML length:', cleanHtml.length);
    console.log('First 300 chars:', cleanHtml.substring(0, 300));
    console.log('==================');

    const sendSmtpEmail = {
      sender: { 
        email: process.env.EMAIL_FROM, 
        name: process.env.EMAIL_FROM_NAME || "ONS Logistics" 
      },
      to: [{ email: to }],
      subject,
      htmlContent: cleanHtml, // ✅ Use cleaned HTML

      // Disable all tracking
      trackClicks: false,
      trackOpens: false,
      mirrorActive: false,
      tags: ["no_tracking"],

      // Required or Brevo still rewrites links
      utmCampaign: "",
      utmSource: "",
      utmMedium: "",
      utmTerm: "",
      utmContent: "",

      // This disables Brevo's auto-wrapping of all neutral links
      disableNeutralLinksTracking: true
    };

    if (attachments) {
      sendSmtpEmail.attachment = attachments;
    }

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully:', response.messageId);
    return response;
    
  } catch (error) {
    console.error("❌ Email sending error:", error);
    console.error("Error response:", error.response?.body);
    throw error;
  }
}