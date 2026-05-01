import { NextResponse } from "next/server";
import { execSync } from "child_process";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

// ── number helpers ──────────────────────────────────────────────
function fmt(n) {
  return parseFloat(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

function numToWords(n) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function h(x) {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
    return ones[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + h(x % 100) : "");
  }
  if (!n) return "Zero";
  const p = Math.round((n % 1) * 100), r = Math.floor(n);
  let rem = r, w = "";
  if (rem >= 10000000) { w += h(Math.floor(rem / 10000000)) + " Crore "; rem %= 10000000; }
  if (rem >= 100000) { w += h(Math.floor(rem / 100000)) + " Lakh "; rem %= 100000; }
  if (rem >= 1000) { w += h(Math.floor(rem / 1000)) + " Thousand "; rem %= 1000; }
  if (rem > 0) w += h(rem);
  return "Indian Rupees " + w.trim() + (p ? " and " + h(p) + " paise" : "") + " Only";
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d)) return String(v);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }).replace(/ /g, "-");
}

// ── build tax rows grouped by HSN ───────────────────────────────
function buildTaxRows(lineItems) {
  const map = {};
  lineItems.forEach(it => {
    const a = parseFloat(it.amount) || 0;
    const g = parseFloat(it.gstRate) || 0;
    const k = it.hsnSac || "—";
    if (!map[k]) map[k] = { taxable: 0, gst: g };
    map[k].taxable += a;
  });
  return Object.entries(map).map(([hsn, d]) => {
    const half = d.gst / 2;
    return {
      hsn, taxable: d.taxable, half,
      cgst: +(d.taxable * half / 100).toFixed(2),
      sgst: +(d.taxable * half / 100).toFixed(2)
    };
  });
}

// ── build the full A4 HTML ──────────────────────────────────────
function buildHtml(inv) {
  const isProforma = inv.invoiceType !== "tax";
  const items = inv.lineItems || [];
  const taxRows = buildTaxRows(items);
  const LOGO = "data:image/webp;base64,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";

  const metaRows = [
    ["DB. NOTE / INVOICE NO", inv.invoiceNumber || "—"],
    ["DATE", fmtDate(inv.date)],
    ["S.B/B.E NO.", inv.sbBeNumber || "N.A"],
    ["DESTINATION", inv.destination || "—"],
    ["NO. OF PKGS.", inv.numberOfPackages || "—"],
    ["GROSS WEIGHT", inv.grossWeight || "—"],
    ["PARTY INVOICE NO.", inv.partyInvoiceNumber || "N.A"],
    ["B/L NO.", inv.blNumber || "N.A"],
    ["DESCRIPTION", inv.description || "—"],
    ["CONTAINER NO.", inv.containerNumber || "—"],
    ...(inv.exRate ? [["EX RATE", inv.exRate]] : []),
    ...(inv.trackingNumber ? [["TRACKING NO.", inv.trackingNumber]] : []),
    ...(inv.dimensions ? [["DIMENSIONS", inv.dimensions]] : []),
  ].map(([k, v]) => `
    <tr>
      <td class="mk">${k}</td>
      <td class="mv">: ${v}</td>
    </tr>`).join("");

  const lineRows = items.map((it, i) => {
    const a = parseFloat(it.amount) || 0;
    const g = parseFloat(it.gstRate) || 0;
    return `
    <tr>
      <td class="center">${i + 1}</td>
      <td class="left-pad">
        <strong>${it.description || ""}</strong>
        ${it.subNote ? `<div class="subnote">${it.subNote}</div>` : ""}
      </td>
      <td class="center">${it.hsnSac || ""}</td>
      <td class="center">${g > 0 ? g + "%" : ""}</td>
      <td class="right mono">${a > 0 ? fmt(a) : ""}</td>
    </tr>`;
  }).join("");

  const taxSummaryRows = taxRows.map(r => `
    <tr>
      <td>${r.hsn}</td>
      <td class="right mono">${fmt(r.taxable)}</td>
      <td class="right">${r.half}%</td>
      <td class="right mono">${fmt(r.cgst)}</td>
      <td class="right">${r.half}%</td>
      <td class="right mono">${fmt(r.sgst)}</td>
      <td class="right mono">${fmt(r.cgst + r.sgst)}</td>
    </tr>`).join("");

  const grand = inv.grandTotal || 0;
  const tcgst = inv.totalCgst || 0;
  const tsgst = inv.totalSgst || 0;
  const tsub = inv.subtotal || 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 10px;
    color: #000;
    background: #fff5f5;
    padding: 18px 24px 14px;
    width: 794px;
  }
  .mono  { font-family: 'Courier New', Courier, monospace; }
  .right { text-align: right; }
  .center{ text-align: center; }
  .left-pad { padding-left: 6px; }
  .subnote { font-size:8px; color:#555; font-style:italic; margin-top:1px; }

  /* dup note */
  .dup { text-align:right; font-size:9px; font-style:italic; margin-bottom:3px; color:#555; }

  /* header outer */
  .header { display:flex; border:1px solid #bbb; }
  .logo-cell { width:295px; flex-shrink:0; padding:8px 10px; border-right:1px solid #bbb; display:flex; align-items:flex-start; gap:8px; }
  .logo-cell img { width:58px; height:58px; object-fit:contain; border-radius:4px; flex-shrink:0; }
  .company-name { font-size:13px; font-weight:700; color:#8b2020; margin-bottom:3px; line-height:1.15; white-space:nowrap; }
  .company-info { font-size:7.5px; line-height:1.6; color:#333; }
  .title-cell   { flex:1; padding:6px 10px; }
  .inv-title    { font-size:14px; font-weight:700; text-align:center; letter-spacing:.04em; margin-bottom:5px; }
  .meta-table   { width:100%; border-collapse:collapse; font-size:8.5px; }
  .meta-table .mk { font-weight:700; padding-right:6px; white-space:nowrap; vertical-align:top; padding-bottom:1px; }
  .meta-table .mv { padding-bottom:1px; vertical-align:top; }

  /* parties */
  .parties { display:grid; grid-template-columns:1fr 1fr; border:1px solid #bbb; border-top:none; }
  .party   { padding:6px 9px; }
  .party.br{ border-right:1px solid #bbb; }
  .party-label { font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:#555; margin-bottom:3px; }
  .party-name  { font-size:10.5px; font-weight:700; margin-bottom:2px; }
  .party-addr  { font-size:8.5px; line-height:1.55; color:#222; margin-bottom:3px; }
  .party-row   { display:flex; gap:4px; font-size:8.5px; }
  .party-key   { font-weight:700; min-width:88px; }

  /* line items */
  .items { width:100%; border-collapse:collapse; border:1px solid #bbb; border-top:none; font-size:9px; }
  .items th { background:#ffe0e0; font-size:8.5px; font-weight:700; padding:4px 5px; border:1px solid #bbb; vertical-align:bottom; }
  .items td { padding:4px 5px; border:1px solid #ddd; vertical-align:top; }
  .items .total-row td { background:#ffe8e8; font-weight:700; font-size:9.5px; border-top:1.5px solid #aaa; }
  .items tfoot td { background:#ffe8e8; font-weight:700; border-top:1.5px solid #aaa; }

  /* words */
  .words { border:1px solid #bbb; border-top:none; padding:4px 9px; display:flex; justify-content:space-between; align-items:flex-start; }
  .words-label { font-size:8px; color:#555; }
  .words-text  { font-size:9.5px; font-weight:700; }
  .eoe { font-size:8px; font-style:italic; color:#555; }

  /* tax table */
  .tax-table { width:100%; border-collapse:collapse; border:1px solid #bbb; border-top:none; font-size:8.5px; }
  .tax-table th { background:#ffe0e0; font-weight:700; padding:3px 5px; border:1px solid #bbb; text-align:right; }
  .tax-table th:first-child { text-align:left; }
  .tax-table td { padding:3px 5px; border:1px solid #ddd; }
  .tax-table .total-row td { background:#ffe8e8; font-weight:700; border-top:1px solid #aaa; }

  /* tax words */
  .tax-words { border:1px solid #bbb; border-top:none; padding:3px 9px; font-size:8.5px; }

  /* footer */
  .footer { display:grid; grid-template-columns:1fr 1fr; border:1px solid #bbb; border-top:none; }
  .footer-left  { padding:7px 9px; border-right:1px solid #bbb; }
  .footer-right { padding:7px 9px; }
  .footer-title { font-size:8.5px; font-weight:700; margin-bottom:3px; }
  .remarks-text { font-size:8.5px; font-style:italic; line-height:1.5; margin-bottom:7px; }
  .bank-row     { display:flex; gap:5px; font-size:8.5px; line-height:1.6; }
  .bank-key     { font-weight:700; min-width:96px; flex-shrink:0; }
  .declaration  { font-size:8px; font-style:italic; color:#444; line-height:1.5; }
  .auth-block   { text-align:right; margin-top:14px; }
  .auth-for     { font-size:8px; color:#555; }
  .auth-sig     { margin-top:28px; font-size:8.5px; font-weight:700; }

  /* jurisdiction */
  .jurisdiction { text-align:center; font-size:8.5px; font-weight:700; letter-spacing:.1em;
    border-top:1px solid #bbb; padding:4px 0 2px; margin-top:4px; }
  .sys-note { text-align:center; font-size:7.5px; color:#888; margin-top:2px; }

  /* watermark */
  .watermark {
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%) rotate(-28deg);
    font-size:80px; font-weight:900; color:rgba(180,60,60,.055);
    pointer-events:none; letter-spacing:.1em; white-space:nowrap;
    z-index:0;
  }
</style>
</head>
<body>

${isProforma ? '<div class="watermark">PROFORMA</div>' : ''}

<div class="dup">${isProforma ? "(PROFORMA INVOICE — NOT A TAX DOCUMENT)" : "(DUPLICATE FOR SUPPLIER)"}</div>

<!-- HEADER -->
<div class="header">
  <div class="logo-cell">
    <img src="data:image/webp;base64,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" alt="ONS Logo"/>
    <div>
      <div class="company-name">ONS Logistics India Pvt. Ltd</div>
      <div class="company-info">
        24, Atam Nagar, Near Radha Swami Satsang Bhawan, Gate No.7<br/>
        Mundian Kalan, Chandigarh Road, Ludhiana<br/>
        PAN NO: AABCO1633R | GSTIN/UIN: 03AABCO1633R1ZD<br/>
        State Name: Punjab, Code: 03<br/>
        CIN: U61100PB2006PTC031261<br/>
        Contact: +91-9988886511<br/>
        E-Mail: accounts@onslog.com | www.onslog.com
      </div>
    </div>
  </div>
  <div class="title-cell">
    <div class="inv-title">${isProforma ? "Proforma Invoice" : "Tax Invoice"}</div>
    <table class="meta-table">
      <tbody>${metaRows}</tbody>
    </table>
  </div>
</div>

<!-- PARTIES -->
<div class="parties">
  <div class="party br">
    <div class="party-label">Consignee (Ship to)</div>
    <div class="party-name">${inv.consigneeName || "—"}</div>
    <div class="party-addr">${(inv.consigneeAddress || "").replace(/\n/g, "<br/>")}</div>
    <div class="party-row"><span class="party-key">GSTIN/UIN</span><span>: ${inv.consigneeGstin || "—"}</span></div>
    <div class="party-row"><span class="party-key">PAN/IT No</span><span>: ${inv.consigneePan || "—"}</span></div>
    <div class="party-row"><span class="party-key">State Name</span><span>: ${inv.consigneeState || "—"}</span></div>
  </div>
  <div class="party">
    <div class="party-label">Buyer (Bill to)</div>
    <div class="party-name">${inv.buyerName || "—"}</div>
    <div class="party-addr">${(inv.buyerAddress || "").replace(/\n/g, "<br/>")}</div>
    <div class="party-row"><span class="party-key">GSTIN/UIN</span><span>: ${inv.buyerGstin || "—"}</span></div>
    <div class="party-row"><span class="party-key">PAN/IT No</span><span>: ${inv.buyerPan || "—"}</span></div>
    <div class="party-row"><span class="party-key">State Name</span><span>: ${inv.buyerState || "—"}</span></div>
    <div class="party-row"><span class="party-key">Place of Supply</span><span>: ${inv.placeOfSupply || "—"}</span></div>
  </div>
</div>

<!-- LINE ITEMS — 5 columns: Sl No | Particulars | HSN/SAC | GST Rate | Amount -->
<table class="items">
  <thead>
    <tr>
      <th style="width:24px;text-align:center">Sl No.</th>
      <th style="text-align:left">Particulars</th>
      <th style="width:54px;text-align:center">HSN/SAC</th>
      <th style="width:48px;text-align:center">GST Rate</th>
      <th style="width:80px;text-align:right">Amount</th>
    </tr>
  </thead>
  <tbody>
    ${lineRows}
    ${tcgst > 0 || tsgst > 0 ? `
    <tr>
      <td colspan="3" style="border:none;background:transparent"></td>
      <td class="right" style="font-weight:700;font-size:8.5px;border:1px solid #ddd;padding:3px 5px">CGST</td>
      <td class="right mono" style="font-weight:700;border:1px solid #ddd;padding:3px 5px">${fmt(tcgst)}</td>
    </tr>
    <tr>
      <td colspan="3" style="border:none;background:transparent"></td>
      <td class="right" style="font-weight:700;font-size:8.5px;border:1px solid #ddd;padding:3px 5px">SGST</td>
      <td class="right mono" style="font-weight:700;border:1px solid #ddd;padding:3px 5px">${fmt(tsgst)}</td>
    </tr>` : ""}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4" class="right" style="padding:5px 8px;font-weight:700;font-size:9.5px;border:1px solid #bbb">Total</td>
      <td class="right mono" style="padding:5px 8px;font-size:12px;font-weight:700;border:1px solid #bbb">&#8377; ${fmt(grand)}</td>
    </tr>
  </tfoot>
</table>

<!-- AMOUNT IN WORDS -->
<div class="words">
  <div>
    <div class="words-label">Amount Chargeable (in words)</div>
    <div class="words-text">${numToWords(grand)}</div>
  </div>
  <div class="eoe">E. &amp; O.E</div>
</div>

<!-- TAX SUMMARY -->
<table class="tax-table">
  <thead>
    <tr>
      <th>HSN/SAC</th>
      <th>Taxable Value</th>
      <th>CGST Rate</th>
      <th>CGST Amount</th>
      <th>SGST/UTGST Rate</th>
      <th>SGST/UTGST Amt</th>
      <th>Total Tax Amt</th>
    </tr>
  </thead>
  <tbody>
    ${taxSummaryRows}
    <tr class="total-row">
      <td style="font-weight:700">Total</td>
      <td class="right mono">${fmt(tsub)}</td>
      <td></td>
      <td class="right mono">${fmt(tcgst)}</td>
      <td></td>
      <td class="right mono">${fmt(tsgst)}</td>
      <td class="right mono">${fmt(tcgst + tsgst)}</td>
    </tr>
  </tbody>
</table>

<!-- TAX IN WORDS -->
<div class="tax-words">
  Tax Amount (in words) : <strong style="font-size:9px">${numToWords(tcgst + tsgst)}</strong>
</div>

<!-- FOOTER -->
<div class="footer">
  <div class="footer-left">
    <div class="footer-title">Remarks:</div>
    <div class="remarks-text">${(inv.remarks || "").replace(/\n/g, "<br/>")}</div>
    <div class="bank-row"><span class="bank-key">Company's PAN</span><span>: ${inv.companyPan || "AABCO1633R"}</span></div>
    <div style="margin-top:8px">
      <div class="footer-title">Declaration</div>
      <div class="declaration">${inv.declaration || ""}</div>
    </div>
  </div>
  <div class="footer-right">
    <div class="footer-title">Company's Bank Details</div>
    <div class="bank-row"><span class="bank-key">A/c Holder's Name</span><span>: ${inv.bankAccountHolder || ""}</span></div>
    <div class="bank-row"><span class="bank-key">Bank Name</span><span>: ${inv.bankName || ""}</span></div>
    <div class="bank-row"><span class="bank-key">A/c No.</span><span>: ${inv.bankAccountNumber || ""}</span></div>
    <div class="bank-row"><span class="bank-key">Branch &amp; IFS Code</span><span>: ${inv.bankIfsc || ""}</span></div>
    <div class="bank-row"><span class="bank-key">SWIFT Code</span><span>: ${inv.bankSwift || ""}</span></div>
    <div class="auth-block">
      <div class="auth-for">for ONS Logistics India Pvt. Ltd</div>
      <div class="auth-sig">Authorised Signatory</div>
    </div>
  </div>
</div>

<div class="jurisdiction">SUBJECT TO LUDHIANA JURISDICTION</div>
<div class="sys-note">This is a system generated invoice</div>

</body>
</html>`;
}

// ── Chrome auto-detect (same pattern as your quotation PDF route) ─
function findSystemChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.platform === "win32") {
    return `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`;
  }
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  const bins = ["google-chrome-stable", "google-chrome", "chromium-browser", "chromium"];
  for (const b of bins) {
    try { const p = execSync(`which ${b} 2>/dev/null`).toString().trim(); if (p) return p; } catch { }
  }
  return "/usr/bin/google-chrome-stable";
}

async function launchBrowser() {
  const puppeteerCore = (await import("puppeteer-core")).default;
  if (process.env.NODE_ENV === "production") {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  const executablePath = findSystemChrome();
  console.log(`[Invoice PDF] Chrome: ${executablePath}`);
  return puppeteerCore.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
}

// ── GET /api/admin/invoices/generate-pdf?invoiceId=xxx ────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoiceId");

  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId required" }, { status: 400 });
  }

  await connectDB();
  const inv = await Invoice.findById(invoiceId).lean();
  if (!inv) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const html = buildHtml(inv);
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${inv.invoiceNumber || invoiceId}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}