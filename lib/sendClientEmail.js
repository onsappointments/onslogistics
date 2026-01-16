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
      sender: {
        email: process.env.EMAIL_FROM, // your authenticated domain sender
        name: process.env.EMAIL_FROM_NAME || "ONS Logistics",
      },

      to: [{ email: to }],

      subject,
      htmlContent: html,

      // ✅ Disable replies
      replyTo: { email: "" }, // removes reply button

      // ✅ Correct field name — "attachment" is WRONG
      attachments: attachments || [],
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Brevo email sent:", result);
    return { success: true, result };

  } catch (error) {
    console.error("❌ Brevo email error:", error);
    return { success: false, error };
  }
}
