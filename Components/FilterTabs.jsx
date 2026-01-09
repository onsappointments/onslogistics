"use client";

import { useRouter } from "next/navigation";

export default function FilterTabs({ active }) {
  const router = useRouter();

  const go = (status) => {
    const url =
      status === "all"
        ? "/dashboard/admin/finalized-quotes"
        : `/dashboard/admin/finalized-quotes?status=${status}`;
    
    console.log("🔄 Navigating to:", url); // Debug
    router.replace(url); // 🔥 Use replace instead of push
  };

  return (
    <div className="flex gap-4">
      <Tab active={active === "all"} onClick={() => go("all")}>
        All
      </Tab>

      <Tab active={active === "sent_to_client"} onClick={() => go("sent_to_client")}>
        Sent to Client
      </Tab>

      <Tab active={active === "client_approved"} onClick={() => go("client_approved")}>
        Client Approved
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