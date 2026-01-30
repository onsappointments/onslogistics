import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const isProd = process.env.NODE_ENV === "production";

/* Helper: Render fields only if they exist */
function field(label, value) {
  if (!value) return "";
  return `<tr><td>${label}</td><td>${value}</td></tr>`;
}

export async function generateTechnicalQuotePdf({ clientQuote, technicalQuote }) {
  const browser = await puppeteer.launch({
    args: isProd ? chromium.args : [],
    executablePath: isProd
      ? await chromium.executablePath()
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    defaultViewport: isProd ? chromium.defaultViewport : null,
  });

  const page = await browser.newPage();

  /* Filter Line Items */
  const filteredItems = (technicalQuote.lineItems || []).filter(
    (i) => i.quantity > 0 && i.rate > 0
  );

  const lineItemsHtml = filteredItems
    .map(
      (i) => `
        <tr>
          <td>${i.head}</td>
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

  /* Currency Summary */
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

  /* Shipment Details */
  const s = technicalQuote.shipmentDetails || {};

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Quotation - ONS Logistics</title>

<style>
  body {
    font-family: Arial, sans-serif;
    padding: 40px;
    color: #222;
    background: #f7f9fc;
  }

  h1 {
    margin-bottom: 5px;
    color: #0a3d62;
    font-size: 32px;
    letter-spacing: 0.5px;
  }

  .header-box {
    background: #dff0ff;
    padding: 15px 20px;
    border-left: 4px solid #0a3d62;
    margin-bottom: 25px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 22px;
    background: white;
  }

  th {
    background: #0a3d62;
    color: white;
    padding: 10px;
    font-size: 13px;
    border: 1px solid #ccc;
  }

  td {
    border: 1px solid #ccc;
    padding: 8px;
    font-size: 13px;
  }

  .section {
    font-size: 20px;
    font-weight: bold;
    margin-top: 35px;
    margin-bottom: 8px;
    color: #0a3d62;
    border-bottom: 2px solid #0a3d62;
    padding-bottom: 4px;
  }

  .footer-text {
    margin-top: 40px;
    font-size: 14px;
    line-height: 1.6;
    background: #eef7ff;
    padding: 15px;
    border-left: 4px solid #0a3d62;
  }
</style>
</head>

<body>

<!-- HEADER -->
<h1>ONS LOGISTICS</h1>
<p>Quote No: <strong>${clientQuote.quoteNo || "-"}</strong></p>  
<div class="header-box">
  <strong>#24, Aatma Nagar</strong>, Near Radha Swami Satsang Bhawan Gate No.7<br/>
  Mundian Kalan, Chandigarh Road, Ludhiana-140015, Punjab, India<br/>
  <strong>Phone:</strong> <a href="tel:+1800-890-7365">1800-890-7365</a> · <strong>Email:</strong> <a href="mailto:info@onslog.com">info@onslog.com</a> · <strong>Web:</strong> <a href="https://onslog.com">onslog.com</a>
</div>

<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

<p><strong>Subject:</strong> Quotation for Shipment Services</p>


<p>Dear <strong>${clientQuote.firstName} ${clientQuote.lastName || ""}</strong>,</p>

<p style="line-height: 1.7;">
Thank you for choosing <strong>ONS Logistics</strong> for your international shipment needs.
We truly appreciate the opportunity to support your logistics requirements. Based on the 
details you shared, our team has carefully evaluated the route, handling conditions, service level, 
and cargo specifics to provide you with a clear, transparent, and competitive quotation.
Below, you will find a complete breakdown of routing, shipment specifications, and charge
components for your review.
</p>

<!-- ROUTING -->
<div class="section">Shipment Routing Details</div>
<table>
  <tr><th>Origin</th><th>Destination</th></tr>
  <tr>
    <td>
      ${clientQuote.fromCity}, ${clientQuote.fromState}, ${clientQuote.fromCountry}<br/>
      Postal: ${clientQuote.fromPostal || "-"}<br/>
      Location Type: ${clientQuote.fromLocationType || "-"}
    </td>
    <td>
      ${clientQuote.toCity}, ${clientQuote.toState}, ${clientQuote.toCountry}<br/>
      Postal: ${clientQuote.toPostal || "-"}<br/>
      Location Type: ${clientQuote.toLocationType || "-"}
    </td>
  </tr>
</table>

<!-- SHIPMENT DETAILS -->
<div class="section">Shipment Details</div>
<table>
 ${field("Item", clientQuote.item)}
 ${field("Shipment Type", clientQuote.shipmentType)}
 ${field("Mode of Transport", clientQuote.modeOfTransport)}
 ${field("Mode of Shipment", clientQuote.modeOfShipment)}
 ${field("Container Type", clientQuote.containerType)}
</table>

<!-- CURRENCY SUMMARY -->
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

<!-- TECHNICAL QUOTE -->
<div class="section">Technical Quotation Breakdown</div>
<table>
  <tr>
    <th>Description</th>
    <th>Qty</th>
    <th>Rate</th>
    <th>Exch. Rate</th>
    <th>Base Amount</th>
    <th>Taxes</th>
    <th>Total (INR)</th>
  </tr>
  ${lineItemsHtml}
</table>

<!-- GRAND TOTAL -->
<div class="section">Grand Total</div>
<table>
  <tr>
    <th>Total Payable (INR)</th>
    <td style="font-size:16px; font-weight:bold; color:#0a3d62;">
      ₹ ${technicalQuote.grandTotalINR}
    </td>
  </tr>
</table>

<div class="footer-text">
Thank you once again for considering <strong>ONS Logistics</strong>.
We remain committed to providing reliable, cost-effective, and timely logistics solutions for
your business. Should you need any clarification or wish to proceed, please feel free to contact us.
Our team will be happy to assist you at every stage of the shipment.
</div>

<p style="margin-top:20px;">
Regards,<br/>
<strong>ONS Logistics Team</strong>
</p>

</body>
</html>
`;

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdf);
}
