/**
 * mapJobToInvoiceDefaults
 *
 * Given a populated Job document (with quoteId populated),
 * returns a plain object matching the Invoice schema defaults.
 *
 * Job fields used:
 *   jobId, beNumber, sbNumber, sbDate, mblNumber, hblNumber,
 *   awbNumber, containerNumber, containerType, pkgs, grossWeight,
 *   consignee, shipper, company, portOfLoading, portOfDischarge,
 *   dimensions (cbm used as proxy), referenceNumber
 *
 * Quote fields used (via job.quoteId):
 *   fromCity, toCity, fromCountry, toCountry, shipmentType,
 *   company, firstName, lastName, totalWeight, weightMeasure,
 *   pieces, dimensions, currency, valueOfGoods, item, modeOfTransport
 */
export function mapJobToInvoiceDefaults(job) {
    const quote = job?.quoteId || {};

    // ── Destination: prefer portOfDischarge → toCity + toCountry ──
    const destination =
        job.portOfDischarge ||
        (quote.toCity && quote.toCountry
            ? `${quote.toCity} (${quote.toCountry})`
            : quote.toCity || "");

    // ── Shipment type label ────────────────────────────────────────
    const rawType = quote.shipmentType || "";
    const shipmentType = rawType
        ? rawType.charAt(0).toUpperCase() + rawType.slice(1)
        : "";

    // ── B/L Number: HBL > MBL > AWB ───────────────────────────────
    const blNumber = job.hblNumber || job.mblNumber || job.awbNumber || "";

    // ── Tracking number: AWB for courier / air ────────────────────
    const trackingNumber = job.awbNumber || "";

    // ── S.B / B.E number ──────────────────────────────────────────
    // Export → SB number, Import → BE number
    const sbBeNumber =
        rawType === "export"
            ? formatWithDate(job.sbNumber, job.sbDate)
            : formatWithDate(job.beNumber, job.beDate);

    // ── Weight + packages ──────────────────────────────────────────
    const grossWeight = job.grossWeight
        ? `${job.grossWeight} KGS`
        : quote.totalWeight
            ? `${quote.totalWeight} ${quote.weightMeasure || "KGS"}`
            : "";

    const numberOfPackages = job.pkgs || quote.pieces || "";

    // ── Consignee (who receives shipment) ─────────────────────────
    // For import: consignee = local company (ONS client)
    // For export: shipper   = local company, consignee = overseas party
    const consigneeName =
        rawType === "export"
            ? job.consignee || ""
            : job.consignee || job.company || quote.company || "";

    // ── Buyer = who pays the bill (usually same as consignee) ─────
    const buyerName = job.company || quote.company || "";

    // ── Address: build from quote location fields ──────────────────
    const buyerAddress = buildAddress(quote);

    // ── Description ───────────────────────────────────────────────
    const description = buildDescription(rawType, job, quote);

    // ── Container ─────────────────────────────────────────────────
    const containerNumber =
        job.containerNumber ||
        (job.containers?.length ? job.containers[0].containerNumber : "") ||
        "";

    // ── Dimensions ────────────────────────────────────────────────
    const dimensions = quote.dimensions || job.cbm ? `${job.cbm} CBM` : "";

    // ── Remarks auto-text ─────────────────────────────────────────
    const remarks = buildRemarks(rawType, job, quote);

    return {
        jobRef: job.jobId || "",
        date: new Date().toISOString().split("T")[0],
        sbBeNumber,
        destination,
        numberOfPackages: String(numberOfPackages),
        grossWeight,
        partyInvoiceNumber: job.referenceNumber || "",
        blNumber,
        description,
        containerNumber,
        trackingNumber,
        dimensions,
        shipmentType,
        exRate: quote.currency && quote.currency !== "INR"
            ? `1 ${quote.currency} = __ INR`
            : "",

        // Consignee
        consigneeName,
        consigneeAddress: buyerAddress,
        consigneeGstin: "",
        consigneePan: "",
        consigneeState: quote.toState || quote.fromState || "",

        // Buyer
        buyerName,
        buyerAddress,
        buyerGstin: "",
        buyerPan: "",
        buyerState: quote.fromState || "",
        placeOfSupply: quote.fromState || quote.fromCity || "",

        // Bank defaults (static)
        bankAccountHolder: "ONS Logistics India Pvt. Ltd",
        bankName: "State Bank of India",
        bankAccountNumber: "36207405735",
        bankIfsc: "Chd. Road, Mundian Kalan & SBIN0004633",
        bankSwift: "",
        companyPan: "AABCO1633R",

        remarks,
        declaration:
            "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",

        lineItems: [],
    };
}

// ── Helpers ──────────────────────────────────────────────────────

function formatWithDate(number, date) {
    if (!number) return "";
    if (!date) return number;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = String(d.getMonth() + 1).padStart(2, "0");
    const yr = String(d.getFullYear()).slice(2);
    return `${number} DT: ${day}.${mon}.${yr}`;
}

function buildAddress(quote) {
    const parts = [
        quote.fromCity,
        quote.fromState,
        quote.fromPostal,
        quote.fromCountry,
    ].filter(Boolean);
    return parts.join(", ");
}

function buildDescription(type, job, quote) {
    const mode = (quote.modeOfTransport || "").toUpperCase();
    const dest = job.portOfDischarge || quote.toCity || "";
    const country = quote.toCountry || "";
    if (type === "export") return `EXPORT_${dest}${country ? ` (${country})` : ""}`;
    if (type === "import") return `IMPORT ${mode}_${dest}${country ? ` (${country})` : ""}`;
    if (type === "courier") return `IMPORT COURIER_${dest}${country ? ` (${country})` : ""}`;
    return `${dest}${country ? ` (${country})` : ""}`;
}

function buildRemarks(type, job, quote) {
    const dest = job.portOfDischarge || quote.toCity || "";
    const country = quote.toCountry || "";
    if (type === "export") {
        const cntr = job.containerNumber || (job.containers?.[0]?.containerNumber) || "";
        const sb = formatWithDate(job.sbNumber, job.sbDate);
        const mbl = job.mblNumber || "";
        return [
            `BEING EXPORT_${dest}${country ? `_${country}` : ""}`,
            cntr && `CNTR NO. ${cntr}`,
            sb && `SB NO.${sb}`,
            mbl && `MBL: ${mbl}`,
        ].filter(Boolean).join("_");
    }
    if (type === "courier") {
        const awb = job.awbNumber || "";
        return `BEING IMPORT COURIER_${dest}${country ? ` (${country})` : ""}${awb ? `_TRACKING NO.${awb}` : ""}`;
    }
    return `BEING IMPORT_${dest}${country ? ` (${country})` : ""}`;
}