import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendClientEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent via Resend:", result);
    return { success: true };
  } catch (error) {
    console.error("❌ Resend email error:", error);
    return { success: false, error };
  }
}
