"use client";

export default function QuoteActions({ id }) {
  const approve = async () => {
    await fetch("/api/admin/quotes/approve", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    alert("Quote approved!");
    window.location.reload();
  };

  const reject = async () => {
    if (!confirm("Are you sure you want to delete this quote permanently?")) return;

    await fetch("/api/admin/quotes/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    alert("Quote deleted!");
    window.location.href = "/dashboard/admin/quotes";
  };

  const edit = () => {
    window.location.href = `/dashboard/admin/quotes/${id}/edit`;
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={approve}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Approve
      </button>

      <button
        onClick={edit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Edit
      </button>

      <button
        onClick={reject}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}
