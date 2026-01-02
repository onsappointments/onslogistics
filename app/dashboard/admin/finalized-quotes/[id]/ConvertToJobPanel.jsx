"use client";

export default function ConvertToJobPanel({
  technicalQuoteId,
  status,
}) {
  if (status !== "client_approved") return null;

  const convertToJob = async () => {
    const confirmConvert = window.confirm(
      "This will create a job and lock this quote. Continue?"
    );
    if (!confirmConvert) return;

    const res = await fetch("/api/admin/jobs/create-from-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ technicalQuoteId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create job");
      return;
    }

    alert("Job created successfully");
    window.location.href = "/dashboard/admin/jobs/new";
  };

  return (
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
  );
}
