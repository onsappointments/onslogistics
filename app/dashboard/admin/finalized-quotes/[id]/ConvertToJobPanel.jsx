"use client";
import { useState } from "react";


export default function ConvertToJobPanel({
  technicalQuoteId,
  status,
}) {

  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [addBookingNumber, setAddBookingNumber] = useState(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [creatingJob, setCreatingJob] = useState(false);
  if (status !== "client_approved") return null;

 
 const convertToJob = async () => {
  setShowBookingPanel(true);
  setAddBookingNumber(null);
  setBookingNumber("");
};

const createJob = async () => {
  if (addBookingNumber === true && !bookingNumber.trim()) {
    alert("Please enter the booking number.");
    return;
  }

  setCreatingJob(true);

  try {
    const res = await fetch(
      "/api/admin/jobs/create-from-quote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technicalQuoteId,
          bookingNumber:
            addBookingNumber === true
              ? bookingNumber.trim()
              : null,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create job");
      return;
    }

    alert("Job created successfully");

    window.location.href =
      "/dashboard/admin/jobs/new";
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    alert("Failed to create job");
  } finally {
    setCreatingJob(false);
  }
};

  return (
  <>
    <div className="mt-10 bg-green-50 border border-green-200 p-6 rounded-xl">
      <h3 className="font-semibold text-green-800 mb-2">
        Client has approved this quote
      </h3>

      <p className="text-green-700 mb-4">
        You can now convert this quote into a job.
      </p>

      <button
        onClick={convertToJob}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Convert to Job
      </button>
    </div>

    {showBookingPanel && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          
          <h3 className="text-lg font-semibold text-gray-900">
            Create Job
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            Would you like to add a booking number to this job?
          </p>

          {/* YES / NO */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setAddBookingNumber(true)}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                addBookingNumber === true
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() => {
                setAddBookingNumber(false);
                setBookingNumber("");
              }}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                addBookingNumber === false
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              No
            </button>
          </div>

          {/* BOOKING NUMBER */}
          {addBookingNumber === true && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Number
              </label>

              <input
                type="text"
                value={bookingNumber}
                onChange={(e) =>
                  setBookingNumber(e.target.value)
                }
                placeholder="Enter booking number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-7">
            <button
              type="button"
              onClick={() => setShowBookingPanel(false)}
              disabled={creatingJob}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createJob}
              disabled={
                creatingJob ||
                addBookingNumber === null ||
                (addBookingNumber === true &&
                  !bookingNumber.trim())
              }
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingJob
                ? "Creating Job..."
                : "Create Job"}
            </button>
          </div>

        </div>
      </div>
    )}
  </>
);
}
