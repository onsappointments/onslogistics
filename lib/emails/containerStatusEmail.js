/**
 * lib/emails/containerStatusEmail.js
 *
 * Outlook-safe rules followed throughout:
 *  - NEVER wrap <td> tags in MSO conditional comments — use bgcolor attribute
 *    alongside the CSS background property instead. Both coexist safely.
 *  - border-radius on <td> is ignored by Outlook — accepted, not fought.
 *  - CTA button uses VML <v:roundrect> for Outlook, <a> for everyone else.
 *  - All layout via <table>/<td> — no <div> for structure.
 *  - font-family always inlined on every element (MSO strips inherited styles).
 *  - Emojis kept out of structural/layout positions; used only in text content.
 *  - deliveryBanner only fires when emailType === "status" (not eta/actual).
 */

const STATUS_ICONS = {
  "Empty Picked Up": "📦",
  "Gate In": "🚧",
  "Loaded on Vessel": "🚢",
  "Vessel Departed": "⛵",
  "Arrived at Transshipment Port": "🔁",
  "Vessel Arrived": "🛳️",
  "Discharged": "📤",
  "Gate Out": "🚪",
  "Delivered": "✅",
};

const ETA_MESSAGES = {
  "Empty Picked Up": (d) => `Your empty container is expected to be picked up by <strong>${d}</strong>.`,
  "Gate In": (d) => `Your container is expected to arrive at the port gate by <strong>${d}</strong>.`,
  "Loaded on Vessel": (d) => `Your container is expected to be loaded onto the vessel by <strong>${d}</strong>.`,
  "Vessel Departed": (d) => `The vessel is expected to depart by <strong>${d}</strong>.`,
  "Arrived at Transshipment Port": (d) => `Your container is expected to arrive at the transshipment port by <strong>${d}</strong>.`,
  "Vessel Arrived": (d) => `The vessel is expected to arrive at the destination port by <strong>${d}</strong>.`,
  "Discharged": (d) => `Your container is expected to be discharged from the vessel by <strong>${d}</strong>.`,
  "Gate Out": (d) => `Your container is expected to leave the port gate by <strong>${d}</strong>.`,
  "Delivered": (d) => `Your shipment is expected to be delivered by <strong>${d}</strong>.`,
};

const ACTUAL_MESSAGES = {
  "Empty Picked Up": (d) => `Your empty container was picked up on <strong>${d}</strong>.`,
  "Gate In": (d) => `Your container entered the port gate on <strong>${d}</strong>.`,
  "Loaded on Vessel": (d) => `Your container was loaded onto the vessel on <strong>${d}</strong>.`,
  "Vessel Departed": (d) => `The vessel departed on <strong>${d}</strong>.`,
  "Arrived at Transshipment Port": (d) => `Your container arrived at the transshipment port on <strong>${d}</strong>.`,
  "Vessel Arrived": (d) => `The vessel arrived at the destination port on <strong>${d}</strong>.`,
  "Discharged": (d) => `Your container was discharged from the vessel on <strong>${d}</strong>.`,
  "Gate Out": (d) => `Your container left the port gate on <strong>${d}</strong>.`,
  "Delivered": (d) => `Your shipment was delivered on <strong>${d}</strong>.`,
};

function fmt(date) {
  if (!date) return "—";

  const raw = typeof date === "string" ? date.trim() : null;

  // Date-only string: YYYY-MM-DD with nothing after
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    // Parse as local midnight by appending T00:00 (no Z = local time)
    const d = new Date(raw + "T00:00");
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "long", day: "numeric",
    }).format(d);
  }

  // Full datetime string or Date object
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(d);
}

function resolveBannerBody(emailType, status, eta, actualDeparture, remarks) {
  if (emailType === "eta") {
    if (ETA_MESSAGES[status]) return ETA_MESSAGES[status](fmt(eta));
    if (remarks) return `${remarks} — estimated by <strong>${fmt(eta)}</strong>.`;
    return `Your shipment (<strong>${status}</strong>) is estimated by <strong>${fmt(eta)}</strong>.`;
  }
  if (emailType === "actual") {
    if (ACTUAL_MESSAGES[status]) return ACTUAL_MESSAGES[status](fmt(actualDeparture));
    if (remarks) return `${remarks} — confirmed on <strong>${fmt(actualDeparture)}</strong>.`;
    return `Your shipment (<strong>${status}</strong>) was confirmed on <strong>${fmt(actualDeparture)}</strong>.`;
  }
  return "";
}

/** Zebra-style detail row. `last` removes the bottom border. */
function detailRow(label, value, valueColor = "#111827", last = false) {
  const border = last ? "" : "border-bottom:1px solid #f0f0f0;";
  return `
    <tr>
      <td width="155" valign="top"
          style="padding:11px 16px;font-size:13px;color:#6b7280;
                 font-family:Helvetica,Arial,sans-serif;${border}">
        ${label}
      </td>
      <td valign="top"
          style="padding:11px 16px;font-size:13px;font-weight:bold;
                 color:${valueColor};font-family:Helvetica,Arial,sans-serif;${border}">
        ${value}
      </td>
    </tr>`;
}

export function buildStatusEmailHtml({
  jobId,
  containerNumber,
  sizeType,
  status,
  location,
  eta,
  actualDeparture,
  remarks,
  fromCity,
  toCity,
  trackingUrl,
  emailType = "status",
}) {
  const icon = STATUS_ICONS[status] || "📍";
  const isDelivered = status === "Delivered";
  const routeLine = fromCity && toCity
    ? `${fromCity} &rarr; ${toCity}`
    : fromCity || toCity || "";

  /* ──────────────────────────────────────────────────────
     DELIVERY BANNER
     Only shown when emailType === "status" AND delivered.
     An ETA/actual email about a delivered container uses
     the contextual banner instead.
  ────────────────────────────────────────────────────── */
  const deliveryBanner = (isDelivered && emailType === "status") ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="margin-bottom:24px;">
      <tr>
        <td align="center" bgcolor="#dcfce7"
            style="background:#dcfce7;border:2px solid #86efac;
                   border-radius:10px;padding:18px 22px;">
          <p style="margin:0;font-size:17px;font-weight:bold;color:#15803d;
                     font-family:Helvetica,Arial,sans-serif;">
            Your Shipment Has Been Delivered!
          </p>
          <p style="margin:6px 0 0;font-size:13px;color:#166534;
                     font-family:Helvetica,Arial,sans-serif;">
            Thank you for choosing ONS Logistics.
          </p>
        </td>
      </tr>
    </table>` : "";

  /* ──────────────────────────────────────────────────────
     CONTEXTUAL BANNER (ETA or Actual)
  ────────────────────────────────────────────────────── */
  const bannerCfg = emailType === "eta" ? {
    bg: "#fffbeb", border: "#fcd34d", headColor: "#92400e", bodyColor: "#78350f",
    label: "Arrival Expected",
    body: resolveBannerBody("eta", status, eta, actualDeparture, remarks),
  } : emailType === "actual" ? {
    bg: "#f0fdf4", border: "#86efac", headColor: "#14532d", bodyColor: "#166534",
    label: "Departure Confirmed",
    body: resolveBannerBody("actual", status, eta, actualDeparture, remarks),
  } : null;

  const contextBanner = bannerCfg ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="margin-bottom:24px;">
      <tr>
        <td bgcolor="${bannerCfg.bg}"
            style="background:${bannerCfg.bg};border:2px solid ${bannerCfg.border};
                   border-radius:10px;padding:16px 20px;">
          <p style="margin:0 0 5px 0;font-size:14px;font-weight:bold;
                     color:${bannerCfg.headColor};
                     font-family:Helvetica,Arial,sans-serif;">
            ${bannerCfg.label}
          </p>
          <p style="margin:0;font-size:13px;color:${bannerCfg.bodyColor};
                     line-height:1.6;font-family:Helvetica,Arial,sans-serif;">
            ${bannerCfg.body}
          </p>
        </td>
      </tr>
    </table>` : "";

  /* ──────────────────────────────────────────────────────
     DETAIL ROWS
  ────────────────────────────────────────────────────── */
  const locationRow = location ? detailRow("Location", location) : "";
  const etaRow = eta ? detailRow("Estimated Arrival", fmt(eta), "#b45309") : "";
  const departureRow = actualDeparture
    ? detailRow("Actual Departure", fmt(actualDeparture), "#047857", !remarks)
    : "";
  const remarksRow = remarks ? `
    <tr>
      <td colspan="2" style="padding:0 16px 14px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td bgcolor="#f8fafc"
                style="background:#f8fafc;border-left:4px solid #3b82f6;
                       padding:10px 14px;font-size:13px;font-style:italic;
                       color:#4b5563;line-height:1.6;
                       font-family:Helvetica,Arial,sans-serif;">
              ${remarks}
            </td>
          </tr>
        </table>
      </td>
    </tr>` : "";

  /* ──────────────────────────────────────────────────────
     CTA BUTTON
     VML v:roundrect for Outlook; standard <a> for everyone else.
     The two blocks must NOT overlap — use [if mso] / [if !mso].
     This pattern is safe because it wraps content, not <td> tags.
  ────────────────────────────────────────────────────── */
  const trackingCta = trackingUrl ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="margin-top:32px;">
      <tr>
        <td align="center">

          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                       xmlns:w="urn:schemas-microsoft-com:office:word"
                       href="${trackingUrl}"
                       style="height:48px;v-text-anchor:middle;width:240px;"
                       arcsize="50%" strokecolor="#1d4ed8" fillcolor="#1d4ed8">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Helvetica,Arial,sans-serif;
                           font-size:14px;font-weight:bold;">
              Track Your Shipment
            </center>
          </v:roundrect>
          <![endif]-->

          <!--[if !mso]><!-->
          <a href="${trackingUrl}"
             style="display:inline-block;background:#1d4ed8;color:#ffffff;
                    font-size:14px;font-weight:bold;padding:14px 36px;
                    border-radius:999px;text-decoration:none;letter-spacing:0.3px;
                    font-family:Helvetica,Arial,sans-serif;mso-hide:all;">
            Track Your Shipment
          </a>
          <!--<![endif]-->

          <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;
                     font-family:Helvetica,Arial,sans-serif;text-align:center;">
            Or visit:
            <a href="${trackingUrl}"
               style="color:#3b82f6;word-break:break-all;
                      font-family:Helvetica,Arial,sans-serif;">${trackingUrl}</a>
          </p>

        </td>
      </tr>
    </table>` : "";

  /* ──────────────────────────────────────────────────────
     FULL TEMPLATE
     Key fix: the header <td> uses BOTH bgcolor attribute (Outlook reads this)
     and background CSS (modern clients read this). No conditional wrapping
     around the <td> itself — that was breaking Outlook entirely.
  ────────────────────────────────────────────────────── */
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <!--[if mso]>
  <noscript><xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml></noscript>
  <![endif]-->
  <title>Shipment Update — ${jobId}</title>
  <style>
    body, table, td, p, a, span {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;
             font-family:Helvetica,Arial,sans-serif;">

  <!-- Outer centering table -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         bgcolor="#f1f5f9" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:36px 16px;">

        <!-- Card: 600px wide -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               bgcolor="#ffffff"
               style="max-width:600px;background:#ffffff;border-radius:16px;">

          <!-- ═══════════════════════════════════════
               HEADER ROW
               bgcolor="#1d4ed8"   → solid blue fallback in Outlook
               background:linear-gradient(...)  → gradient in Gmail/Apple Mail
               Do NOT wrap this <td> in [if mso]/[if !mso] — that breaks Outlook.
          ═══════════════════════════════════════ -->
          <tr>
            <td bgcolor="#1d4ed8"
                style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%);
                       padding:30px 36px 26px;border-radius:16px 16px 0 0;">

              <!-- Brand -->
              <p style="margin:0;color:#93c5fd;font-size:11px;font-weight:bold;
                         text-transform:uppercase;letter-spacing:2px;
                         font-family:Helvetica,Arial,sans-serif;">
                ONS Logistics
              </p>

              <!-- Headline -->
              <p style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:bold;
                         line-height:1.3;font-family:Helvetica,Arial,sans-serif;">
                Shipment Status Update
              </p>

              <!-- Route -->
              ${routeLine ? `
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:13px;
                         font-family:Helvetica,Arial,sans-serif;">
                ${routeLine}
              </p>` : ""}

              <!-- Status text — plain bold white, no box (border-radius unsupported in Outlook) -->
              <p style="margin:14px 0 0;color:#ffffff;font-size:14px;font-weight:bold;
                         letter-spacing:0.3px;font-family:Helvetica,Arial,sans-serif;">
                ${icon}&nbsp;&nbsp;${status}
              </p>

            </td>
          </tr>

          <!-- ═══════════════════════════════════════
               BODY
          ═══════════════════════════════════════ -->
          <tr>
            <td style="padding:32px 36px;">

              ${deliveryBanner}
              ${contextBanner}

              <!-- Shipment details -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="border:1px solid #e5e7eb;border-radius:10px;">

                <!-- Header row -->
                <tr>
                  <td colspan="2" bgcolor="#f9fafb"
                      style="background:#f9fafb;padding:10px 16px;font-size:11px;
                             font-weight:bold;color:#6b7280;text-transform:uppercase;
                             letter-spacing:1.2px;border-bottom:1px solid #f0f0f0;
                             border-radius:10px 10px 0 0;
                             font-family:Helvetica,Arial,sans-serif;">
                    Shipment Details
                  </td>
                </tr>

                ${detailRow("Job ID",
    `<span style="font-family:'Courier New',Courier,monospace;">${jobId}</span>`)}
                ${detailRow("Container",
      `${containerNumber}${sizeType
        ? ` <span style="color:#9ca3af;font-weight:normal;font-size:12px;">(${sizeType})</span>`
        : ""}`)}
                ${locationRow}
                ${etaRow}
                ${departureRow}
                ${remarksRow}

              </table>

              ${trackingCta}

              <p style="margin:28px 0 0;font-size:13px;color:#6b7280;line-height:1.7;
                         font-family:Helvetica,Arial,sans-serif;">
                Questions about your shipment? Contact your dedicated
                ONS Logistics coordinator.
              </p>

            </td>
          </tr>

          <!-- ═══════════════════════════════════════
               FOOTER
          ═══════════════════════════════════════ -->
          <tr>
            <td align="center" bgcolor="#f8fafc"
                style="background:#f8fafc;border-top:1px solid #e2e8f0;
                       padding:20px 36px;border-radius:0 0 16px 16px;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.8;
                         font-family:Helvetica,Arial,sans-serif;">
                &copy; ${new Date().getFullYear()} ONS Logistics
                &nbsp;&middot;&nbsp;
                Automated notification.
                ${trackingUrl
      ? `<br/><a href="${trackingUrl}"
                       style="color:#3b82f6;text-decoration:none;
                              font-family:Helvetica,Arial,sans-serif;">
                       View live tracking
                     </a>`
      : ""}
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}