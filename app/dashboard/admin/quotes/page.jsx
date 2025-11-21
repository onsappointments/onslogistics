"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminQuotesPage() {
    const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState("24h");

  const fetchQuotes = async () => {
    const res = await fetch(`/api/admin/quotes?filter=${filter}`);
    const data = await res.json();
    setQuotes(data);
  };

  const approveQuote = async (id) => {
    const res = await fetch("/api/admin/quotes/approve", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    fetchQuotes();
  };

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold mb-6">Client Quotes</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {["24h", "48h", "7d"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full border ${
              filter === f ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Last {f.replace("h", " Hours").replace("d", " Days")}
          </button>
        ))}
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-xl shadow p-6">
        {quotes.length === 0 ? (
          <p>No quotes found for this period.</p>
        ) : (
          quotes.map((q) => (
            <div
             key={q._id}
             onClick={() => router.push(`/dashboard/admin/quotes/${q._id}`)}
             className="border-b py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            >

              <div>
                <p className="font-bold">{q.fullName}</p>
                <p className="text-sm text-gray-600">{q.email}</p>
                <p className="text-sm text-gray-600">
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    q.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {q.status}
                </span>

                {q.status === "pending" && (
                  <button
                    onClick={() => approveQuote(q._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
