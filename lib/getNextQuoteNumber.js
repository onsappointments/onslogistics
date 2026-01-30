import Counter from "@/models/Counter";

/**
 * Normalize trade input into IM / EX / COU
 */
function normalizeTrade(trade) {
  if (!trade) return null;

  // Already normalized
  if (["IM", "EX", "COU"].includes(trade)) {
    return trade;
  }

  // Normalize from shipment type
  switch (trade.toLowerCase()) {
    case "import":
      return "IM";
    case "export":
      return "EX";
    case "courier":
      return "COU";
    default:
      return null;
  }
}

/**
 * Generate next quote number
 * Format:
 * Q-AIR-IM-2026-00001
 */
export async function getNextQuoteNumber({
  mode,        // AIR / SEA / ROAD
  trade,       // IM / EX / COU OR import / export / courier
  year = new Date().getFullYear(),
}) {
  const normalizedTrade = normalizeTrade(trade);

  if (!mode || !normalizedTrade) {
    throw new Error(
      "Mode and valid Trade (IM / EX / COU) are required to generate quote number"
    );
  }

  const key = `quote:${mode}:${normalizedTrade}:${year}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { value: 1 } },     // 🔑 matches Counter schema
    { new: true, upsert: true } // 🔑 return updated document
  );

  const serial = String(counter.value).padStart(5, "0");

  return `Q-${mode}-${normalizedTrade}-${year}-${serial}`;
}
