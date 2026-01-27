"use client";

import { useRouter } from "next/navigation";

export default function FilterTabs({ active }) {
  const router = useRouter();

  const go = ({ status = null, show = null }) => {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (show) params.set("show", show);

    const qs = params.toString();
    const url = qs
      ? `/dashboard/admin/finalized-quotes?${qs}`
      : "/dashboard/admin/finalized-quotes";

    router.replace(url);
  };

  const items = [
    { key: "all", label: "All", icon: "grid", onClick: () => go({}) },
    {
      key: "sent_to_client",
      label: "Sent to Client",
      icon: "send",
      onClick: () => go({ status: "sent_to_client" }),
    },
    {
      key: "client_approved",
      label: "Client Approved",
      icon: "check",
      onClick: () => go({ status: "client_approved" }),
    },
    {
      key: "active_jobs",
      label: "Active Jobs",
      icon: "bolt",
      onClick: () => go({ show: "active_jobs" }),
    },
  ];

  return (
    <div
      className="
        w-full overflow-x-auto no-scrollbar
        rounded-2xl border border-gray-200 bg-white p-1
      "
    >
      <div className="flex items-center gap-1 min-w-max">
        {items.map((it) => (
          <Tab
            key={it.key}
            active={active === it.key}
            onClick={it.onClick}
            icon={it.icon}
          >
            {it.label}
          </Tab>
        ))}
      </div>
    </div>
  );
}

function Tab({ active, onClick, children, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap
        transition
        ${active ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"}
      `}
    >
      <Icon name={icon} active={active} />
      {children}
    </button>
  );
}

/* Tiny inline icons (no deps) */
function Icon({ name, active }) {
  const cls = `w-4 h-4 ${active ? "text-white" : "text-gray-400"}`;

  if (name === "grid") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h7v7H4V6zm9 0h7v7h-7V6zM4 15h7v5H4v-5zm9 0h7v5h-7v-5z" />
      </svg>
    );
  }
  if (name === "send") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (name === "bolt") {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  return null;
}

