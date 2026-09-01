import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

function field(label, value) {
  if (!value) return "";
  return `<tr><td>${label}</td><td>${value}</td></tr>`;
}
function buildSummaryBreakdown(lineItems = []) {
  const freightItems = lineItems.filter(
    (item) =>
      item.head === "OCEAN_FREIGHT" ||
      item.head === "AIR_FREIGHT"
  );

  const otherItems = lineItems.filter(
    (item) =>
      item.head !== "OCEAN_FREIGHT" &&
      item.head !== "AIR_FREIGHT"
  );

  // ---------------------------------------------
  // Helper: aggregate actual quotation values
  // ---------------------------------------------

  const aggregateItems = (items) => {
    const taxableAmount = items.reduce(
      (sum, item) => sum + Number(item.baseAmount || 0),
      0
    );

    const gstAmount = items.reduce(
      (sum, item) =>
        sum +
        Number(item.igstAmount || 0) +
        Number(item.cgstAmount || 0) +
        Number(item.sgstAmount || 0),
      0
    );

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    );

    const effectiveGstRate =
      taxableAmount > 0
        ? (gstAmount / taxableAmount) * 100
        : 0;

    return {
      taxableAmount,
      gstAmount,
      totalAmount,
      effectiveGstRate,
    };
  };

  // ---------------------------------------------
  // Freight
  // ---------------------------------------------

  const oceanFreight = aggregateItems(
    freightItems.filter(
      (item) => item.head === "OCEAN_FREIGHT"
    )
  );

  const airFreight = aggregateItems(
    freightItems.filter(
      (item) => item.head === "AIR_FREIGHT"
    )
  );

  // ---------------------------------------------
  // Other Local Charges
  // ---------------------------------------------

  const otherLocalCharges = aggregateItems(otherItems);

  return {
    oceanFreight,
    airFreight,
    otherLocalCharges,
  };
}

async function getBrowserConfig() {
  if (process.env.CHROME_PATH) {
    return {
      executablePath: process.env.CHROME_PATH,
      headless: true,
      defaultViewport: { width: 1123, height: 794 },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    };
  }

  return {
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  };
}

export async function generateTechnicalQuotePdf({ clientQuote, technicalQuote ,  breakdownMode = "detailed", }) {
  const config = await getBrowserConfig();
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  await page.setViewport({ width: 1123, height: 794 });

  const filteredItems = (technicalQuote.lineItems || []).filter(
    (i) => i.quantity > 0 && i.rate > 0
  );

  const summaryBreakdown = buildSummaryBreakdown(filteredItems);

  const lineItemsHtml = filteredItems
    .map(
      (i) => `
        <tr>
          <td>${i.head}</td>
          <td>${i.remarks || "N/A"}</td>
          <td>${i.quantity}</td>
          <td>${i.rate} ${i.currency}</td>
          <td>${i.exchangeRate}</td>
          <td>${i.baseAmount}</td>
          <td>
            IGST ${i.igstPercent}% = ${i.igstAmount.toFixed(2)}<br/>
            CGST ${i.cgstPercent}% = ${i.cgstAmount.toFixed(2)}<br/>
            SGST ${i.sgstPercent}% = ${i.sgstAmount.toFixed(2)}
          </td>
          <td>${i.totalAmount} INR</td>
        </tr>
      `
    )
    .join("");

 const formatGst = (gstAmount, effectiveGstRate) => {
  if (!gstAmount || gstAmount <= 0) {
    return "-";
  }

  const roundedRate =
    Number(effectiveGstRate.toFixed(2));

  const rateText =
    Number.isInteger(roundedRate)
      ? `${roundedRate}%`
      : `${roundedRate.toFixed(2)}%`;

  return `
    ₹ ${gstAmount.toFixed(2)}
    (${rateText})
  `;
};

  

const summaryBreakdownHtml = `
  ${
    summaryBreakdown.oceanFreight.totalAmount > 0
      ? `
        <tr>
          <td>Freight - Ocean</td>

          <td>
            ₹ ${summaryBreakdown.oceanFreight.taxableAmount.toFixed(2)}
          </td>

          <td>
            ${formatGst(
              summaryBreakdown.oceanFreight.gstAmount,
              summaryBreakdown.oceanFreight.effectiveGstRate
            )}
          </td>

          <td>
            ₹ ${summaryBreakdown.oceanFreight.totalAmount.toFixed(2)}
          </td>
        </tr>
      `
      : ""
  }

  ${
    summaryBreakdown.airFreight.totalAmount > 0
      ? `
        <tr>
          <td>Freight - Air</td>

          <td>
            ₹ ${summaryBreakdown.airFreight.taxableAmount.toFixed(2)}
          </td>

          <td>
            ${formatGst(
              summaryBreakdown.airFreight.gstAmount,
              summaryBreakdown.airFreight.effectiveGstRate
            )}
          </td>

          <td>
            ₹ ${summaryBreakdown.airFreight.totalAmount.toFixed(2)}
          </td>
        </tr>
      `
      : ""
  }

  ${
    summaryBreakdown.otherLocalCharges.totalAmount > 0
      ? `
        <tr>
          <td>Other Local Charges</td>

          <td>
            ₹ ${summaryBreakdown.otherLocalCharges.taxableAmount.toFixed(2)}
          </td>

          <td>
            ${formatGst(
              summaryBreakdown.otherLocalCharges.gstAmount,
              summaryBreakdown.otherLocalCharges.effectiveGstRate
            )}
          </td>

          <td>
            ₹ ${summaryBreakdown.otherLocalCharges.totalAmount.toFixed(2)}
          </td>
        </tr>
      `
      : ""
  }
`;

  const currencySummaryRows = Object.values(technicalQuote.currencySummary || {})
    .filter((cs) => cs.subtotal > 0)
    .map(
      (cs) => `
      <tr>
        <td>${cs.currency}</td>
        <td>${cs.subtotal}</td>
        <td>${cs.exchangeRate}</td>
        <td>${cs.inrEquivalent}</td>
      </tr>`
    )
    .join("");

    /* ---------------- QUOTE VALIDITY ---------------- */

let validityText = "";

const validity = technicalQuote.quoteValidity || {};

switch (validity.type) {
  case "VESSEL":
    validityText = `
      This quotation shall remain valid until the scheduled vessel departure (ETD:
      <strong>${validity.etd
        ? new Date(validity.etd).toLocaleDateString("en-IN")
        : "-"}</strong>).
      Rates are subject to carrier schedule changes.
    `;
    break;

  case "HANDOVER":
    validityText = `
      This quotation shall remain valid until cargo handover at
      <strong>${validity.handoverLocation || "-"}</strong>.
      Any delay beyond the agreed handover may require revalidation.
    `;
    break;

  default:
    validityText = `
      This quotation shall remain valid until
      <strong>${validity.validTill
        ? new Date(validity.validTill).toLocaleDateString("en-IN")
        : "-"}</strong>.
      Rates may be revised thereafter.
    `;
}

/* ---------------- SPECIAL REMARKS ---------------- */

const remarksHtml = (technicalQuote.specialRemarks || [])
  .filter((remark) => remark.trim() !== "")
  .map((remark) => `<li>${remark}</li>`)
  .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Quotation - ONS Logistics India Pvt Ltd</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Arial, sans-serif;
    padding: 20px 28px;
    color: #222;
    background: #fff;
    font-size: 11px;
  }

  h1 {
    color: #0a3d62;
    font-size: 22px;
    letter-spacing: 0.3px;
    margin-bottom: 3px;
  }

  .quote-meta {
    font-size: 10px;
    color: #555;
    margin-bottom: 6px;
  }

  .header-box {
    background: #dff0ff;
    padding: 7px 12px;
    border-left: 3px solid #0a3d62;
    margin-bottom: 10px;
    font-size: 10px;
    line-height: 1.5;
  }

  .intro {
    font-size: 10px;
    line-height: 1.55;
    margin-bottom: 10px;
    color: #333;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    background: white;
  }

  th {
    background: #0a3d62;
    color: white;
    padding: 5px 6px;
    font-size: 10px;
    border: 0.5px solid #aaa;
    white-space: nowrap;
  }

  td {
    border: 0.5px solid #ccc;
    padding: 4px 6px;
    font-size: 10px;
    vertical-align: top;
  }

  .section {
    font-size: 12px;
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 4px;
    color: #0a3d62;
    border-bottom: 1.5px solid #0a3d62;
    padding-bottom: 2px;
  }

  .footer-text {
    margin-top: 12px;
    font-size: 10px;
    line-height: 1.5;
    background: #eef7ff;
    padding: 8px 12px;
    border-left: 3px solid #0a3d62;
  }

  .sign-off {
    margin-top: 10px;
    font-size: 10px;
  }

  a { color: #0a3d62; }
</style>
</head>
<body>

<h1>ONS LOGISTICS INDIA PVT LTD </h1>
<p class="quote-meta">
  Quote No: <strong>${clientQuote.quoteNo || "-"}</strong> &nbsp;|&nbsp;
  Date: <strong>${new Date().toLocaleDateString()}</strong>
</p>

<div class="header-box">
  <strong>#24, Aatma Nagar</strong>, Near Radha Swami Satsang Bhawan Gate No.7,
  Mundian Kalan, Chandigarh Road, Ludhiana-140015, Punjab, India<br/>
  <strong>Phone:</strong> 1800-890-7365 &nbsp;·&nbsp;
  <strong>Email:</strong> info@onslog.com &nbsp;·&nbsp;
  <strong>Web:</strong> onslog.com
</div>

<p class="intro">
  To  <strong>${clientQuote.company} </strong>,<br/>
  Dear <strong>${clientQuote.firstName} ${clientQuote.lastName || ""}</strong>,<br/>
  Thank you for choosing <strong>ONS Logistics India Pvt Ltd</strong>. Based on your shipment details,
  please find below our transparent, competitive quotation with a complete breakdown of
  routing, specifications, and charge components.
</p>

<div class="section">Shipment Routing</div>
<table>
  <tr><th>Origin</th><th>Destination</th></tr>
  <tr>
    <td>
      ${clientQuote.fromCity}, ${clientQuote.fromState}, ${clientQuote.fromCountry}<br/>
      Postal: ${clientQuote.fromPostal || "-"} &nbsp;|&nbsp; Type: ${clientQuote.fromLocationType || "-"}
    </td>
    <td>
      ${clientQuote.toCity}, ${clientQuote.toState}, ${clientQuote.toCountry}<br/>
      Postal: ${clientQuote.toPostal || "-"} &nbsp;|&nbsp; Type: ${clientQuote.toLocationType || "-"}
    </td>
  </tr>
</table>

<div class="section">Shipment Details</div>
<table>
  ${field("Item", clientQuote.item)}
  ${field("Shipment Type", clientQuote.shipmentType)}
  ${field("Mode of Transport", clientQuote.modeOfTransport)}
  ${field("Mode of Shipment", clientQuote.modeOfShipment)}
  ${field("Container Type", clientQuote.containerType)}
</table>

<div class="section">Currency Summary</div>
<table>
  <tr>
    <th>Currency</th>
    <th>Subtotal</th>
    <th>Exchange Rate</th>
    <th>INR Equivalent</th>
  </tr>
  ${currencySummaryRows}
</table>

${
  breakdownMode === "summary"
    ? `
      <div class="section">Technical Quotation Breakdown</div>

      <table>
        <tr>
          <th>Description</th>
          <th>Taxable Amount (INR)</th>
          <th>GST</th>
          <th>Total (INR)</th>
        </tr>

        ${summaryBreakdownHtml}
      </table>
    `
    : `
      <div class="section">Technical Quotation Breakdown</div>

      <table>
        <tr>
          <th>Description</th>
          <th>Remarks</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Exch. Rate</th>
          <th>Base Amount</th>
          <th>Taxes</th>
          <th>Total (INR)</th>
        </tr>

        ${lineItemsHtml}
      </table>
    `
}

<div class="section">Grand Total</div>
<table>
  <tr>
    <th>Total Payable (INR)</th>
    <td style="font-size:13px; font-weight:bold; color:#0a3d62;">
      &#8377; ${Math.round(Number(technicalQuote.grandTotalINR || 0))}
    </td>
  </tr>
</table>
 <div class="section">
Quotation Validity
</div>

<div class="footer-text">
${validityText}
</div>

${
  remarksHtml
    ? `
<div class="section">
Notes & Special Remarks
</div>

<ul style="
margin-left:20px;
margin-bottom:16px;
line-height:1.7;
font-size:10px;
">
${remarksHtml}
</ul>
`
    : ""
}
<div class="footer-text">
  Thank you for considering <strong>ONS Logistics India Pvt Ltd</strong>. We remain committed to reliable,
  cost-effective, and timely logistics solutions. For any clarification or to proceed,
  contact us — our team is happy to assist at every stage.
</div>

<p class="sign-off">
  Regards,<br/>
  <strong>ONS Logistics India Pvt Ltd Team</strong>
</p>

</body>
</html>
`;

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const contentHeight = await page.evaluate(
    () => document.documentElement.scrollHeight
  );

  const pdf = await page.pdf({
    width: "794px",
    height: `${contentHeight}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  return Buffer.from(pdf);
}