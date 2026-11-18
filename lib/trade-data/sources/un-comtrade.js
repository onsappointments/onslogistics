
const API_BASE_URL = "https://comtradeapi.un.org/data/v1/get";

const USER_AGENT =
  "ONS-Global-Trade-Intelligence/1.0 (https://onslog.com)";

const INDIA_REPORTER_CODE = 699;
const WORLD_PARTNER_CODE = 0;

function getRecentMonthlyPeriods(numberOfMonths = 12) {
  const periods = [];
  const now = new Date();

  // Start with the previous complete month.
  const cursor = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
  );

  for (let index = 0; index < numberOfMonths; index++) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, "0");

    periods.push(`${year}${month}`);
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  }

  return periods.reverse();
}

function parsePeriodStart(period) {
  if (!/^\d{6}$/.test(String(period))) {
    throw new Error(`Invalid monthly period received: ${period}`);
  }

  const year = Number(period.slice(0, 4));
  const month = Number(period.slice(4, 6));

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month in period: ${period}`);
  }

  return new Date(Date.UTC(year, month - 1, 1));
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeTradeRecord(record) {
  if (!record || typeof record !== "object") {
    throw new Error("UN Comtrade returned an invalid record.");
  }

  const period = String(record.period || "");

  return {
    typeCode: record.typeCode || "C",
    frequency: record.freqCode || "M",
    period,
    periodStart: parsePeriodStart(period),

    reporterCode: Number(record.reporterCode),
    reporterISO: record.reporterISO || null,
    reporterName: record.reporterDesc || null,

    partnerCode: Number(record.partnerCode),
    partnerISO: record.partnerISO || null,
    partnerName: record.partnerDesc || null,

    flowCode: String(record.flowCode || ""),
    flowName: record.flowDesc || null,

    classificationCode: record.classificationCode || null,
    classificationSearchCode:
      record.classificationSearchCode || null,
    isOriginalClassification:
      typeof record.isOriginalClassification === "boolean"
        ? record.isOriginalClassification
        : null,

    cmdCode: String(record.cmdCode || ""),
    cmdName: record.cmdDesc || null,
    aggregationLevel: toNullableNumber(record.aggrLevel),

    primaryValue: toNullableNumber(record.primaryValue),
    cifValue: toNullableNumber(record.cifvalue),
    fobValue: toNullableNumber(record.fobvalue),
    netWeight: toNullableNumber(record.netWgt),
    grossWeight: toNullableNumber(record.grossWgt),
    quantity: toNullableNumber(record.qty),
    quantityUnitCode: toNullableNumber(record.qtyUnitCode),
    quantityUnit: record.qtyUnitAbbr || null,

    alternateQuantity: toNullableNumber(record.altQty),
    alternateQuantityUnitCode:
      toNullableNumber(record.altQtyUnitCode),
    alternateQuantityUnit: record.altQtyUnitAbbr || null,

    isQuantityEstimated:
  typeof record.isQtyEstimated === "boolean"
    ? record.isQtyEstimated
    : null,

isAlternateQuantityEstimated:
  typeof record.isAltQtyEstimated === "boolean"
    ? record.isAltQtyEstimated
    : null,

isNetWeightEstimated:
  typeof record.isNetWgtEstimated === "boolean"
    ? record.isNetWgtEstimated
    : null,

isGrossWeightEstimated:
  typeof record.isGrossWgtEstimated === "boolean"
    ? record.isGrossWgtEstimated
    : null,

isReported:
  typeof record.isReported === "boolean"
    ? record.isReported
    : null,

isAggregate:
  typeof record.isAggregate === "boolean"
    ? record.isAggregate
    : null,

    sourceRecordId: record.datasetCode
      ? String(record.datasetCode)
      : null,

    metadata: {
      customsCode: record.customsCode ?? null,
      customsDescription: record.customsDesc ?? null,
      modeOfTransportCode: record.motCode ?? null,
      modeOfTransportDescription: record.motDesc ?? null,
      secondPartnerCode: record.partner2Code ?? null,
      secondPartnerISO: record.partner2ISO ?? null,
      secondPartnerName: record.partner2Desc ?? null,
      isExtendedFlowCode: record.isExtendedFlowCode ?? null,
      isExtendedPartnerCode: record.isExtendedPartnerCode ?? null,
      originalRecord: record,
    },
  };
}

async function fetchTradeData({
  periods,
  reporterCode = INDIA_REPORTER_CODE,
  partnerCode = WORLD_PARTNER_CODE,
  flowCodes = ["M", "X"],
}) {
  const apiKey = process.env.UN_COMTRADE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "UN_COMTRADE_API_KEY is missing from the environment."
    );
  }

  const url = new URL(`${API_BASE_URL}/C/M/HS`);

  url.searchParams.set("reporterCode", String(reporterCode));
  url.searchParams.set("partnerCode", String(partnerCode));
  url.searchParams.set("partner2Code", "0");
  url.searchParams.set("period", periods.join(","));
  url.searchParams.set("flowCode", flowCodes.join(","));
  url.searchParams.set("cmdCode", "TOTAL");
  url.searchParams.set("maxRecords", "100000");
  url.searchParams.set("includeDesc", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Ocp-Apim-Subscription-Key": apiKey,
      "User-Agent": USER_AGENT,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `UN Comtrade API request failed: HTTP ${response.status}. ` +
        responseText.slice(0, 1000)
    );
  }

  const payload = await response.json();

  if (payload.error) {
    throw new Error(`UN Comtrade API error: ${payload.error}`);
  }

  if (!Array.isArray(payload.data)) {
    throw new Error(
      "UN Comtrade returned an unexpected response: data is not an array."
    );
  }

  const reportedCount = Number(payload.count);

  if (
    Number.isFinite(reportedCount) &&
    reportedCount > payload.data.length
  ) {
    throw new Error(
      `UN Comtrade response is incomplete: API reports ${reportedCount} ` +
        `records but returned ${payload.data.length}.`
    );
  }

  const records = payload.data.map(normalizeTradeRecord);

  return {
    records,
    requestedPeriods: periods,
    reportedCount: Number.isFinite(reportedCount)
      ? reportedCount
      : records.length,
    elapsedTime: payload.elapsedTime || null,
    requestUrl: url.toString(),
  };
}

export async function fetchIndiaMonthlyTradeFlows({
  numberOfMonths = 12,
  periods,
} = {}) {
  const requestedPeriods =
    periods || getRecentMonthlyPeriods(numberOfMonths);

  if (
    !Array.isArray(requestedPeriods) ||
    requestedPeriods.length === 0
  ) {
    throw new Error("At least one monthly period is required.");
  }

  const result = await fetchTradeData({
    periods: requestedPeriods,
  });

  if (!result.records.length) {
    throw new Error(
      "UN Comtrade returned no India monthly total trade records."
    );
  }

  const invalidRecords = result.records.filter(
    (record) =>
      !Number.isInteger(record.reporterCode) ||
      !Number.isInteger(record.partnerCode) ||
      !["M", "X"].includes(record.flowCode) ||
      !record.period ||
      !record.cmdCode
  );

  if (invalidRecords.length) {
    throw new Error(
      `UN Comtrade returned ${invalidRecords.length} records with invalid identity fields.`
    );
  }

  return result;
}
