
import * as XLSX from "xlsx";

const WORLD_BANK_LANDING_PAGE =
  "https://www.worldbank.org/en/research/commodity-markets";

const USER_AGENT =
  "ONS-Global-Trade-Intelligence/1.0 (https://onslog.com)";

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": USER_AGENT,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(
      `World Bank page request failed: HTTP ${response.status}`
    );
  }

  return response.text();
}

async function discoverMonthlyWorkbookUrl() {
  const html = await fetchText(WORLD_BANK_LANDING_PAGE);

  const matches = [
    ...html.matchAll(
      /href=["']([^"']*CMO-Historical-Data-Monthly\.xlsx[^"']*)["']/gi
    ),
  ];

  if (!matches.length) {
    throw new Error(
      "Could not find the current monthly workbook link on the World Bank page."
    );
  }

  return new URL(matches[0][1], WORLD_BANK_LANDING_PAGE).toString();
}

async function downloadWorkbook(url) {
  const response = await fetch(url, {
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/octet-stream",
      "User-Agent": USER_AGENT,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    throw new Error(
      `World Bank workbook download failed: HTTP ${response.status}`
    );
  }

  const contentType = (
    response.headers.get("content-type") || ""
  ).toLowerCase();

  if (
    contentType.includes("text/html") ||
    contentType.includes("application/json")
  ) {
    throw new Error(
      `World Bank returned an unexpected workbook content type: ${contentType}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  if (!arrayBuffer.byteLength) {
    throw new Error("World Bank returned an empty workbook.");
  }

  return Buffer.from(arrayBuffer);
}

function parseMonthLabel(value) {
  const label = String(value ?? "").trim();

  // Expected workbook labels: 1960M01, 2026M10, etc.
  const match = label.match(/^(\d{4})\s*M\s*(\d{1,2})$/i);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) return null;

  return {
    year,
    month,
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
    label: `${year}-${String(month).padStart(2, "0")}`,
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function findPreviousNonEmptyRow(rows, startIndex) {
  for (let index = startIndex; index >= 0; index--) {
    const row = rows[index];

    if (
      Array.isArray(row) &&
      row.some(
        (cell) =>
          cell !== null &&
          cell !== undefined &&
          String(cell).trim() !== ""
      )
    ) {
      return index;
    }
  }

  return -1;
}

function parseNumericValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/,/g, "");

  if (!normalized || normalized === "..." || normalized === "..") {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseMonthlyPricesSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: null,
  });

  // Find the first row containing a valid month label in column A.
  let firstDataRowIndex = -1;
  let firstMonth = null;

  for (let index = 0; index < rows.length; index++) {
    const month = parseMonthLabel(rows[index]?.[0]);

    if (month) {
      firstDataRowIndex = index;
      firstMonth = month;
      break;
    }
  }

  if (firstDataRowIndex < 2) {
    throw new Error(
      "Could not identify the monthly data, heading row and units row in the workbook."
    );
  }

  const unitsRowIndex = findPreviousNonEmptyRow(
    rows,
    firstDataRowIndex - 1
  );

  const headerRowIndex = findPreviousNonEmptyRow(
    rows,
    unitsRowIndex - 1
  );

  if (unitsRowIndex < 0 || headerRowIndex < 0) {
    throw new Error(
      "Could not identify commodity headings and units."
    );
  }

  const headers = rows[headerRowIndex] || [];
  const units = rows[unitsRowIndex] || [];

  const series = [];

  for (let columnIndex = 1; columnIndex < headers.length; columnIndex++) {
    const name = String(headers[columnIndex] || "").trim();
    const unit = String(units[columnIndex] || "").trim();

    if (!name || !unit) continue;

    series.push({
      columnIndex,
      name,
      unit,
      indicatorKey: `world-bank-${slugify(name)}`,
    });
  }

  if (!series.length) {
    throw new Error(
      "No commodity series were found in the monthly workbook."
    );
  }

  const observations = [];

  for (
    let rowIndex = firstDataRowIndex;
    rowIndex < rows.length;
    rowIndex++
  ) {
    const row = rows[rowIndex] || [];
    const period = parseMonthLabel(row[0]);

    if (!period) continue;

    for (const item of series) {
      const value = parseNumericValue(row[item.columnIndex]);

      if (value === null) continue;

      observations.push({
        indicatorKey: item.indicatorKey,
        name: item.name,
        category: "commodity-price",
        value,
        unit: item.unit,
        currency: "USD",
        period: {
          start: period.start,
          end: period.end,
          label: period.label,
          frequency: "monthly",
        },
        geography: {
          key: "global",
          type: "global",
          name: "Global",
        },
        metadata: {
          provider: "World Bank Pink Sheet",
          workbookSheet: "Monthly Prices",
          workbookSeriesName: item.name,
          originalUnit: item.unit,
          priceBasis: "nominal",
        },
      });
    }
  }

  if (!observations.length) {
    throw new Error(
      "The monthly workbook was parsed, but no valid price observations were found."
    );
  }

  return {
    observations,
    firstMonth: firstMonth.label,
    seriesCount: series.length,
  };
}

function parseMonthlyIndicesSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: null,
  });

  // Locate the first valid monthly observation.
  let firstDataRowIndex = -1;
  let firstMonth = null;

  for (let index = 0; index < rows.length; index++) {
    const month = parseMonthLabel(rows[index]?.[0]);

    if (month) {
      firstDataRowIndex = index;
      firstMonth = month;
      break;
    }
  }

  if (firstDataRowIndex < 1) {
    throw new Error(
      "Could not identify monthly observations in the Monthly Indices sheet."
    );
  }

  const ignoredHeader = /monthly indices|updated on|based on|nominal us dollar|1960 to present|2010\s*=\s*100/i;

  const series = [];
  const columnCount = Math.max(
    ...rows.slice(0, firstDataRowIndex).map((row) => row.length)
  );

  for (let columnIndex = 1; columnIndex < columnCount; columnIndex++) {
    // Headers can span multiple rows because of merged Excel cells.
    // Use the last meaningful header value for each column.
    let name = null;

    for (
      let rowIndex = firstDataRowIndex - 1;
      rowIndex >= 0;
      rowIndex--
    ) {
      const candidate = String(
        rows[rowIndex]?.[columnIndex] ?? ""
      ).trim();

      if (
        candidate &&
        !ignoredHeader.test(candidate) &&
        !parseMonthLabel(candidate)
      ) {
        name = candidate;
        break;
      }
    }

    if (!name) continue;

    const normalized = name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

    // Exclude duplicate or non-index header columns.
    if (
      normalized === "date" ||
      normalized === "month" ||
      normalized === "year"
    ) {
      continue;
    }

    series.push({
      columnIndex,
      name,
      indicatorKey: `world-bank-index-${slugify(name)}`,
    });
  }

  if (!series.length) {
    throw new Error(
      "No index series were identified in the Monthly Indices sheet."
    );
  }

  const observations = [];

  for (
    let rowIndex = firstDataRowIndex;
    rowIndex < rows.length;
    rowIndex++
  ) {
    const row = rows[rowIndex] || [];
    const period = parseMonthLabel(row[0]);

    if (!period) continue;

    for (const item of series) {
      const value = parseNumericValue(row[item.columnIndex]);

      if (value === null) continue;

      observations.push({
        indicatorKey: item.indicatorKey,
        name: item.name,
        category: "commodity-index",
        value,
        unit: "Index (2010=100)",
        currency: null,
        period: {
          start: period.start,
          end: period.end,
          label: period.label,
          frequency: "monthly",
        },
        geography: {
          key: "global",
          type: "global",
          name: "Global",
        },
        metadata: {
          provider: "World Bank Pink Sheet",
          workbookSheet: "Monthly Indices",
          workbookSeriesName: item.name,
          indexBase: 100,
          indexBaseYear: 2010,
          priceBasis: "nominal",
        },
      });
    }
  }

  if (!observations.length) {
    throw new Error(
      "The Monthly Indices sheet was parsed, but no valid index observations were found."
    );
  }

  return {
    observations,
    firstMonth: firstMonth.label,
    seriesCount: series.length,
  };
}

export async function fetchWorldBankCommodityPrices() {
  console.info("[World Bank] Discovering monthly workbook...");

  const workbookUrl = await discoverMonthlyWorkbookUrl();

  console.info("[World Bank] Downloading workbook:", workbookUrl);

  const buffer = await downloadWorkbook(workbookUrl);

  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellDates: false,
  });

  const pricesSheetName = workbook.SheetNames.find(
    (name) => name.trim().toLowerCase() === "monthly prices"
  );

  const indicesSheetName = workbook.SheetNames.find(
    (name) => name.trim().toLowerCase() === "monthly indices"
  );

  if (!pricesSheetName) {
    throw new Error(
      `Monthly Prices sheet not found. Available sheets: ${workbook.SheetNames.join(", ")}`
    );
  }

  if (!indicesSheetName) {
    throw new Error(
      `Monthly Indices sheet not found. Available sheets: ${workbook.SheetNames.join(", ")}`
    );
  }

  const prices = parseMonthlyPricesSheet(
    workbook.Sheets[pricesSheetName]
  );

  const indices = parseMonthlyIndicesSheet(
    workbook.Sheets[indicesSheetName]
  );

  console.info("[World Bank] Workbook parsed:", {
    workbookUrl,
    priceSeries: prices.seriesCount,
    priceObservations: prices.observations.length,
    indexSeries: indices.seriesCount,
    indexObservations: indices.observations.length,
  });

  return {
    workbookUrl,
    observations: prices.observations,
    indexObservations: indices.observations,
    seriesCount: prices.seriesCount,
    indexSeriesCount: indices.seriesCount,
  };
}
