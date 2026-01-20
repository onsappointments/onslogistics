"use client";

import { useRouter } from "next/navigation";

export default function FilterTabs({ active }) {
  const router = useRouter();

  const go = ({ status = null, show = null }) => {
    let url = "/dashboard/admin/finalized-quotes";

    if (status) url += `?status=${status}`;
    if (show) url += `?show=${show}`;

    router.replace(url);
  };

  return (
    <div className="flex gap-4">
      <Tab active={active === "all"} onClick={() => go({})}>
        All
      </Tab>

      <Tab
        active={active === "sent_to_client"}
        onClick={() => go({ status: "sent_to_client" })}
      >
        Sent to Client
      </Tab>

      <Tab
        active={active === "client_approved"}
        onClick={() => go({ status: "client_approved" })}
      >
        Client Approved
      </Tab>

      <Tab
        active={active === "active_jobs"}
        onClick={() => go({ show: "active_jobs" })}
      >
        Active Jobs
      </Tab>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border font-semibold transition-all ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
