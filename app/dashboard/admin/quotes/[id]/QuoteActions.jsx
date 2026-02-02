"use client";
import { redirect } from "next/navigation";

export default function QuoteActions({ id, status }) {
  const createTechQuote = () => {
    redirect(`/dashboard/admin/quotes/${id}/technical`);
  };

  const sendToClient = async () => {
    await fetch("/api/admin/send-technical-quote", {
      method: "POST",
      body: JSON.stringify({ quoteId: id }),
    });
    alert("Quote sent to client");
    location.reload();
  };

  if (status === "pending") {
    return (
      <button onClick={createTechQuote} className="btn-primary">
        Create Technical Quote
      </button>
    );
  }

  if (status === "tech_draft") {
    return (
      <div className="flex gap-3">
        <button onClick={createTechQuote} className="btn-blue">
          Edit Technical Quote
        </button>
        <button onClick={sendToClient} className="btn-green">
          Send to Client
        </button>
      </div>
    );
  }

  return null;
}
