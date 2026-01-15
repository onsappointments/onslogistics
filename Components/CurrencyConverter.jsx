"use client";

import { useMemo, useState } from "react";

const SYMBOL = { INR: "₹", USD: "$", EUR: "€" };

export default function CurrencyConverter({ grandTotalINR, currencySummary }) {
  const availableCurrencies = useMemo(() => {
    // show only currencies that exist in summary + INR always
    const keys = Object.keys(currencySummary || {});
    const set = new Set(["INR", ...keys]);
    return Array.from(set);
  }, [currencySummary]);

  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const converted = useMemo(() => {
    if (selectedCurrency === "INR") return grandTotalINR;

    const ex = currencySummary?.[selectedCurrency]?.exchangeRate;

    // exchangeRate = FX -> INR (e.g., 1 USD = 83 INR)
    if (!ex || Number(ex) <= 0) return null;

    return grandTotalINR / Number(ex);
  }, [selectedCurrency, grandTotalINR, currencySummary]);

  return (
    <div className="mt-6 text-right text-xl font-semibold">
      Grand Total{" "}
      <select
        className="m-2 px-4 py-2 bg-gray-50 rounded-xl text-md"
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
      >
        {availableCurrencies.map((curr) => (
          <option key={curr} value={curr}>
            {curr}
          </option>
        ))}
      </select>
      :{" "}
      {converted === null ? (
        <span className="text-red-600 text-sm font-medium">
          Exchange rate missing
        </span>
      ) : (
        <span>
          {SYMBOL[selectedCurrency] || ""} {Number(converted).toFixed(2)}
        </span>
      )}
    </div>
  );
}
