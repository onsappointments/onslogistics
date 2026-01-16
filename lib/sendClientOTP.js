// lib/sendClientOTP.js
import * as Brevo from "@getbrevo/brevo";

export default async function sendClientOTP({ to, otp }) {
  try {
    // Initialize Brevo API
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const subject = "Your ONS Verification OTP";

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ONS Logistics OTP</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f6fa; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa; padding:40px 0;">
          <tr>
            <td align="center">

              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px;">

                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <img src="https://onslogistics.com/assets/img/onslogo.png" alt="ONS Logistics" width="120" />
                  </td>
                </tr>

                <tr>
                  <td style="color:#1a73e8; font-size:22px; font-weight:600; text-align:center;">
                    ONS Logistics – Email Verification Code
                  </td>
                </tr>

                <tr>
                  <td style="color:#444444; font-size:15px; line-height:1.6; padding-top:10px; text-align:center;">
                    Thank you for choosing <strong>ONS Logistics</strong>.<br>
                    Please use the verification code below:
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:30px 0;">
                    <div style="
                      display:inline-block;
                      background:#f7f9fc;
                      border:1px solid #dce3eb;
                      border-radius:10px;
                      padding:20px 40px;
                      font-size:34px;
                      font-weight:700;
                      color:#000;
                      letter-spacing:6px;
                      text-align:center;
                    ">
                      ${otp}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="font-size:14px; color:#555; text-align:center;">
                    This verification code is valid for <strong>10 minutes</strong>.
                  </td>
                </tr>

                <tr>
                  <td style="font-size:14px; color:#777; padding-top:16px; text-align:center;">
                    If you did not request this code, please ignore this email.
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 0;">
                    <hr style="border:none; border-top:1px solid #efefef;">
                  </td>
                </tr>

                <tr>
                  <td style="font-size:12px; color:#999; text-align:center;">
                    © ${new Date().getFullYear()} ONS Logistics. All rights reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailPayload = {
      sender: {
        email: process.env.EMAIL_FROM,
        name: "ONS Verification",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
trackClicks: false,   // ⬅ stops Brevo redirect
  trackOpens: false,    // ⬅ optional
    };

    const response = await apiInstance.sendTransacEmail(emailPayload);
    return response;
  } catch (error) {
    console.error("OTP email error:", error.response?.body || error);
    throw error;
  }
}
