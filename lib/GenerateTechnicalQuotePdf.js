import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const isProd = process.env.NODE_ENV === "production";

/* Helper: Render only filled fields */
function renderField(label, value) {
  if (!value || value === "" || value === null) return "";
  return `<span class="label">${label}:</span> ${value}<br/>`;
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

  /* Filter & Build Line Items HTML */
  const filteredItems = technicalQuote.lineItems.filter(
    (item) => item.quantity > 0 && item.rate > 0
  );

  const lineItemsHtml = filteredItems
    .map(
      (item) => `
      <tr>
        <td>${item.head}</td>
        <td>${item.quantity}</td>
        <td>${item.rate} ${item.currency}</td>
        <td>${item.exchangeRate} </td>
        <td>${item.baseAmount}</td>
        <td>
          IGST ${item.igstPercent}% = ${item.igstAmount.toFixed(2)}<br/>
          CGST ${item.cgstPercent}% = ${item.cgstAmount.toFixed(2)}<br/>
          SGST ${item.sgstPercent}% = ${item.sgstAmount.toFixed(2)}
        </td>
        <td>${item.totalAmount} INR</td>
      </tr>
    `
    )
    .join("");

  /* Build Exchange Rate Table */
  const exchangeRateRows = filteredItems
    .map(
      (item) => `
    <tr>
      <td>${item.head}</td>
      <td>${item.currency}</td>
      <td>${item.exchangeRate}</td>
    </tr>
  `
    )
    .join("");

/* Currency Summary Table */
const currencySummaryRows = Object.values(technicalQuote.currencySummary || {})
  .filter(cs => cs.subtotal > 0 || cs.inrEquivalent > 0) // show only filled
  .map(cs => `
    <tr>
      <td>${cs.currency}</td>
      <td>${cs.subtotal}</td>
      <td>${cs.exchangeRate}</td>
      <td>${cs.inrEquivalent}</td>
    </tr>
  `)
  .join("");


  /* Build ALL filled client fields automatically */
  const clientFieldsHtml = Object.entries(clientQuote)
    .filter(
      ([key, value]) =>
        ![
          "_id",
          "createdAt",
          "updatedAt",
          "__v",
          "status",
          "referenceNo",
        ].includes(key) && value
    )
    .map(
      ([key, value]) => `
        <span class="label">${key.replace(/([A-Z])/g, " $1")}:</span> ${value}<br/>
    `
    )
    .join("");

  /* Build technical shipment details */
  const shipmentDetails = technicalQuote.shipmentDetails || {};
  const shipmentDetailsHtml = Object.entries(shipmentDetails)
    .filter(([, value]) => value)
    .map(
      ([key, value]) => `
        <span class="label">${key.replace(/([A-Z])/g, " $1")}:</span> ${value}<br/>
    `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Quotation Letter</title>

<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
  .container { width: 900px; margin: 0 auto; padding: 30px; }

  h1, h2 { color: #0F4C81; margin-bottom: 8px; }

  .section { margin-bottom: 25px; }
  .label { font-weight: bold; width: 190px; display: inline-block; }

  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  table th {
    background: #0F4C81; color: white; padding: 8px;
    font-size: 14px; text-align: left;
  }
  table td {
    border-bottom: 1px solid #ddd;
    padding: 8px;
    font-size: 14px;
  }

  .footer {
    border-top: 2px solid #0F4C81; padding-top: 15px;
    margin-top: 40px; font-size: 13px;
  }
</style>
</head>

<body>
<div class="container">

  <!-- Header -->
  <div class="section">
    <h1>Quotation Letter</h1>
    <p>
      <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
      <strong>Reference No:</strong> ${clientQuote.referenceNo || "-"}
    </p>
  </div>

  <!-- Company Info -->
  <div class="section">
    <p>
      <strong>ONS Logistics</strong><br/>
      #24, Aatma Nagar, Near Radha Swami Satsang Bhawan Gate No.7<br/>
      Mundian Kalan, Chandigarh Road<br/>
      Ludhiana-140015, Punjab, India<br/>
      Phone: 1800-890-7365<br/>
      Email: info@onslog.com<br/>
      Website: www.onslog.com
    </p>
  </div>

  <!-- Greeting -->
  <div class="section">
    <p>Dear ${clientQuote.firstName} ${clientQuote.lastName || ""},</p>

    <p>
      Thank you for choosing <strong>ONS Logistics</strong>.  
      Based on the shipment details provided, we are pleased to share  
      your customized quotation. Our team has carefully reviewed your  
      requirements to prepare the most accurate and competitive estimate.
    </p>
  </div>

  <!-- Client Filled Info -->
  <div class="section">
    <h2>Your Submitted Details</h2>
    <p>${clientFieldsHtml}</p>
  </div>

  <!-- Shipment Details -->
  <div class="section">
    <h2>Shipment Details</h2>
    <p>${shipmentDetailsHtml}</p>
  </div>

  <!-- Exchange Rates -->
  <div class="section">
    <h2>Exchange Rates Used</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Currency</th>
          <th>Exchange Rate</th>
        </tr>
      </thead>
      <tbody>
        ${exchangeRateRows}
      </tbody>
    </table>
  </div>

  <!-- Technical Quotation -->
  <div class="section">
    <h2>Quotation Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Exch. Rate</th>
          <th>Base Amount</th>
          <th>Taxes</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsHtml}
      </tbody>
    </table>
  </div>

  <!-- Currency Summary -->
  <div class="section">
   <h2>Currency Summary</h2>
<table>
  <thead>
    <tr>
      <th>Currency</th>
      <th>Subtotal</th>
      <th>Exchange Rate</th>
      <th>INR Equivalent</th>
    </tr>
  </thead>
  <tbody>
    ${currencySummaryRows}
  </tbody>
</table>

  </div>

  <!-- Grand Total -->
  <div class="section">
    <h2>Grand Total (INR)</h2>
    <p>
      <strong>Total Amount Payable:</strong>  
      ${technicalQuote.grandTotalINR} INR
    </p>
  </div>

  <!-- Closing -->
  <div class="section">
    <p>
      Should you need any modifications or have further questions, please feel  
      free to contact our team. We would be delighted to assist you and ensure  
      your shipment proceeds smoothly.
    </p>

    <p>
      Warm regards,<br/>
      <strong>ONS Logistics Team</strong>
    </p>
  </div>

  <!-- Footer -->
  <div class="footer">
    This is a system-generated quotation and does not require a signature.
  </div>

</div>
</body>
</html>
`;

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}
