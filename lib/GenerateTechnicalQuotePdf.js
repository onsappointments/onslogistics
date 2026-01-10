import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const isProd = process.env.NODE_ENV === "production";


export async function generateTechnicalQuotePdf({
  clientQuote,
  technicalQuote,
}) {
  const browser = await puppeteer.launch({
    args: isProd ? chromium.args : [],
    executablePath: isProd
      ? await chromium.executablePath()
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    defaultViewport: isProd ? chromium.defaultViewport : null,
  });

  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1e3a8a; }
          table { width:100%; border-collapse: collapse; margin-top:20px; }
          th, td { border:1px solid #ddd; padding:8px; }
          th { background:#f3f4f6; text-align:left; }
        </style>
      </head>
      <body>
        <h1>Technical Quotation</h1>

        <p><strong>Client:</strong> ${clientQuote.company || "-"}</p>
        <p><strong>Email:</strong> ${clientQuote.email || "-"}</p>

        <h3>Shipment Details</h3>
        <table>
          <tr><th>From</th><td>${clientQuote.fromCity || "-"}</td></tr>
          <tr><th>To</th><td>${clientQuote.toCity || "-"}</td></tr>
          <tr><th>Mode</th><td>${clientQuote.modeOfShipment || "-"}</td></tr>
        </table>

        <h3>Total Amount</h3>
        <p style="font-size:20px;font-weight:bold">
          ₹ ${Number(technicalQuote.grandTotal || 0).toFixed(2)}
        </p>

        <p style="margin-top:40px">
          This is a system-generated quotation.
        </p>
      </body>
    </html>
  `;

  await page.setContent(html, {
    waitUntil: "domcontentloaded", // ✅ CRITICAL FIX
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer); // return pdfBuffer;
}
