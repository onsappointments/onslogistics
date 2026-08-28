"use client";

import { useState } from "react";

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function ShippingBillsEditor({
  initialBills = [],
}) {
  const [bills, setBills] = useState(
    initialBills.length > 0
      ? initialBills.map((bill) => ({
          number: bill.number || "",
          date: formatDate(bill.date),
        }))
      : [{ number: "", date: "" }]
  );

  function updateBill(index, field, value) {
    setBills((current) =>
      current.map((bill, i) =>
        i === index
          ? {
              ...bill,
              [field]: value,
            }
          : bill
      )
    );
  }

  function addBill() {
    setBills((current) => [
      ...current,
      {
        number: "",
        date: "",
      },
    ]);
  }

  function removeBill(index) {
    setBills((current) => {
      const next = current.filter(
        (_, i) => i !== index
      );

      return next.length > 0
        ? next
        : [{ number: "", date: "" }];
    });
  }

  return (
    <div className="md:col-span-2 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Shipping Bills
        </span>

        <button
          type="button"
          onClick={addBill}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          + Add Shipping Bill
        </button>
      </div>

      <input
        type="hidden"
        name="shippingBills"
        value={JSON.stringify(bills)}
      />

      <div className="space-y-2">
        {bills.map((bill, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end rounded-xl border border-gray-200 bg-gray-50 p-3"
          >
            <label className="block text-sm">
              <span className="text-gray-600">
                SB Number
              </span>

              <input
                type="text"
                value={bill.number}
                onChange={(event) =>
                  updateBill(
                    index,
                    "number",
                    event.target.value
                  )
                }
                placeholder="SB Number"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-600">
                SB Date
              </span>

              <input
                type="date"
                value={bill.date}
                onChange={(event) =>
                  updateBill(
                    index,
                    "date",
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <button
              type="button"
              onClick={() =>
                removeBill(index)
              }
              disabled={bills.length === 1}
              className="h-10 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Remove shipping bill"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}