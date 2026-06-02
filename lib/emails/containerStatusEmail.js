/**
 * lib/emails/containerStatusEmail.js
 * Builds all shipment-related HTML emails.
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

/**
 * Human-readable ETA messages per status.
 * Used when emailType === "eta".
 * Format: "Your [thing] is expected to [action] by <date>."
 */
const ETA_MESSAGES = {
  "Empty Picked Up": (date) => `Your empty container is expected to be picked up by ${date}.`,
  "Gate In": (date) => `Your container is expected to arrive at the port gate by ${date}.`,
  "Loaded on Vessel": (date) => `Your container is expected to be loaded onto the vessel by ${date}.`,
  "Vessel Departed": (date) => `The vessel is expected to depart by ${date}.`,
  "Arrived at Transshipment Port": (date) => `Your container is expected to arrive at the transshipment port by ${date}.`,
  "Vessel Arrived": (date) => `The vessel is expected to arrive at the destination port by ${date}.`,
  "Discharged": (date) => `Your container is expected to be discharged from the vessel by ${date}.`,
  "Gate Out": (date) => `Your container is expected to leave the port gate by ${date}.`,
  "Delivered": (date) => `Your shipment is expected to be delivered by ${date}.`,
};

/**
 * Human-readable departure/confirmation messages per status.
 * Used when emailType === "actual".
 */
const ACTUAL_MESSAGES = {
  "Empty Picked Up": (date) => `Your empty container was picked up on ${date}.`,
  "Gate In": (date) => `Your container entered the port gate on ${date}.`,
  "Loaded on Vessel": (date) => `Your container was loaded onto the vessel on ${date}.`,
  "Vessel Departed": (date) => `The vessel departed on ${date}.`,
  "Arrived at Transshipment Port": (date) => `Your container arrived at the transshipment port on ${date}.`,
  "Vessel Arrived": (date) => `The vessel arrived at the destination port on ${date}.`,
  "Discharged": (date) => `Your container was discharged from the vessel on ${date}.`,
  "Gate Out": (date) => `Your container left the port gate on ${date}.`,
  "Delivered": (date) => `Your shipment was delivered on ${date}.`,
};

function fmt(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(date));
}

/**
 * Resolve the banner body text for ETA or actual emailType.
 *
 * Priority:
 *   1. Status-specific message from the map above (preset statuses)
 *   2. remarks (custom statuses or override)
 *   3. Bare generic fallback with no extra context sentence
 */
function resolveBannerBody(emailType, status, eta, actualDeparture, remarks) {
  const fmtEta = fmt(eta);
  const fmtActual = fmt(actualDeparture);

  if (emailType === "eta") {
    if (ETA_MESSAGES[status]) {
      return ETA_MESSAGES[status](fmtEta);
    }
    // Custom status — use remarks if available, else bare generic
    if (remarks) {
      return `${remarks} — estimated by <strong>${fmtEta}</strong>.`;
    }
    return `Your shipment update (<strong>${status}</strong>) is estimated by <strong>${fmtEta}</strong>.`;
  }

  if (emailType === "actual") {
    if (ACTUAL_MESSAGES[status]) {
      return ACTUAL_MESSAGES[status](fmtActual);
    }
    // Custom status — use remarks if available, else bare generic
    if (remarks) {
      return `${remarks} — confirmed on <strong>${fmtActual}</strong>.`;
    }
    return `Your shipment update (<strong>${status}</strong>) was confirmed on <strong>${fmtActual}</strong>.`;
  }

  return "";
}

/**
 * @param {object}  p
 * @param {string}  p.jobId
 * @param {string}  p.containerNumber
 * @param {string}  [p.sizeType]
 * @param {string}  p.status
 * @param {string}  [p.location]
 * @param {Date}    [p.eta]
 * @param {Date}    [p.actualDeparture]
 * @param {string}  [p.remarks]
 * @param {string}  [p.fromCity]
 * @param {string}  [p.toCity]
 * @param {string}  [p.trackingUrl]
 * @param {"status"|"eta"|"actual"} [p.emailType="status"]
 */
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
    ? `${fromCity} → ${toCity}`
    : fromCity || toCity || "";

  /* ── top-of-body contextual banner ── */
  const bannerCfg = emailType === "eta" ? {
    bg: "#fffbeb", border: "#fcd34d", headColor: "#92400e", bodyColor: "#78350f",
    icon: "🕐", title: "Arrival Expected",
    body: resolveBannerBody("eta", status, eta, actualDeparture, remarks),
  } : emailType === "actual" ? {
    bg: "#f0fdf4", border: "#86efac", headColor: "#14532d", bodyColor: "#166534",
    icon: "🚢", title: "Departure Confirmed",
    body: resolveBannerBody("actual", status, eta, actualDeparture, remarks),
  } : null;

  const deliveryBanner = isDelivered ? `
    <div style="background:#dcfce7;border:1px solid #86efac;border-radius:12px;
                padding:18px 22px;text-align:center;margin-bottom:28px;">
      <p style="margin:0;font-size:20px;font-weight:800;color:#15803d;">
        🎉 Your Shipment Has Been Delivered!
      </p>
      <p style="margin:6px 0 0;font-size:13px;color:#166534;">
        Thank you for choosing ONS Logistics.
      </p>
    </div>` : "";

  const contextBanner = bannerCfg ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:${bannerCfg.bg};border:1px solid ${bannerCfg.border};
                   border-radius:12px;padding:16px 20px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:22px;padding-right:14px;vertical-align:top;">
                ${bannerCfg.icon}
              </td>
              <td>
                <p style="margin:0;font-size:14px;font-weight:700;color:${bannerCfg.headColor};">
                  ${bannerCfg.title}
                </p>
                <p style="margin:4px 0 0;font-size:13px;color:${bannerCfg.bodyColor};line-height:1.5;">
                  ${bannerCfg.body}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>` : "";

  /* ── detail rows ── */
  function detailRow(label, value, valueColor = "#111827", isLast = false) {
    const border = isLast ? "" : "border-bottom:1px solid #f3f4f6;";
    return `
      <tr>
        <td style="padding:11px 16px;color:#6b7280;font-size:13px;width:170px;${border}
                   vertical-align:top;">${label}</td>
        <td style="padding:11px 16px;font-size:13px;font-weight:600;color:${valueColor};
                   ${border}vertical-align:top;">${value}</td>
      </tr>`;
  }

  const locationRow = location
    ? detailRow("📍 Location", location)
    : "";
  const etaRow = eta
    ? detailRow("🕐 Estimated Arrival", fmt(eta), "#d97706")
    : "";
  const departureRow = actualDeparture
    ? detailRow("🚢 Actual Departure", fmt(actualDeparture), "#059669")
    : "";
  const remarksSection = remarks ? `
    <tr>
      <td colspan="2" style="padding:0 16px 14px;">
        <div style="background:#f8fafc;border-left:3px solid #3b82f6;border-radius:0 6px 6px 0;
                    padding:10px 14px;color:#4b5563;font-size:13px;font-style:italic;line-height:1.5;">
          💬 ${remarks}
        </div>
      </td>
    </tr>` : "";

  const trackingCta = trackingUrl ? `
    <div style="text-align:center;margin-top:32px;">
      <a href="${trackingUrl}"
         style="display:inline-block;background:#1d4ed8;color:#ffffff;font-size:14px;
                font-weight:700;padding:14px 36px;border-radius:999px;text-decoration:none;
                letter-spacing:0.4px;">
        🔍 Track Your Shipment
      </a>
      <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;">
        Bookmark this link:
        <a href="${trackingUrl}" style="color:#3b82f6;word-break:break-all;">${trackingUrl}</a>
      </p>
    </div>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Shipment Update — ${jobId}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;
             font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f1f5f9;padding:36px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:18px;overflow:hidden;
                    box-shadow:0 4px 32px rgba(0,0,0,0.08);max-width:600px;">

        <!-- ═══ HEADER ═══ -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%);
                     padding:30px 36px 26px;">
            <p style="margin:0;color:#93c5fd;font-size:11px;text-transform:uppercase;
                      letter-spacing:2px;font-weight:600;">ONS Logistics</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:800;
                       line-height:1.2;">Shipment Status Update</h1>
            ${routeLine ? `
            <p style="margin:10px 0 0;color:#bfdbfe;font-size:13px;">
              📍 ${routeLine}
            </p>` : ""}
            <!-- Status pill in header -->
            <div style="display:inline-block;margin-top:14px;background:rgba(255,255,255,0.15);
                        border:1px solid rgba(255,255,255,0.3);border-radius:999px;
                        padding:6px 16px;">
              <span style="font-size:15px;">${icon}</span>
              <span style="color:#ffffff;font-weight:700;font-size:13px;
                           margin-left:8px;letter-spacing:0.3px;">${status}</span>
            </div>
          </td>
        </tr>

        <!-- ═══ BODY ═══ -->
        <tr>
          <td style="padding:32px 36px;">

            ${deliveryBanner}
            ${contextBanner}

            <!-- Details table -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

              <!-- Section header -->
              <tr style="background:#f9fafb;">
                <td colspan="2"
                    style="padding:10px 16px;font-size:11px;font-weight:700;color:#6b7280;
                           text-transform:uppercase;letter-spacing:1.2px;
                           border-bottom:1px solid #f3f4f6;">
                  Shipment Details
                </td>
              </tr>

              ${detailRow("Job ID", `<span style="font-family:monospace;">${jobId}</span>`)}
              ${detailRow("Container",
    `${containerNumber}${sizeType
      ? ` <span style="color:#9ca3af;font-weight:400;font-size:12px;">(${sizeType})</span>`
      : ""}`)}
              ${locationRow}
              ${etaRow}
              ${departureRow}
              ${remarksSection}

            </table>

            ${trackingCta}

            <p style="margin:28px 0 0;font-size:13px;color:#6b7280;line-height:1.7;">
              Questions about your shipment? Contact your
              dedicated ONS Logistics coordinator.
            </p>

          </td>
        </tr>

        <!-- ═══ FOOTER ═══ -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;
                     padding:20px 36px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.8;">
              © ${new Date().getFullYear()} ONS Logistics &nbsp;·&nbsp;
              This is an automated notification.
              ${trackingUrl
      ? `<br/><a href="${trackingUrl}" style="color:#60a5fa;text-decoration:none;">
                     View live tracking
                   </a>`
      : ""}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}