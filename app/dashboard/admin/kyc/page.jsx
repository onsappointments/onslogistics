"use client";

import { Suspense } from "react";
import AdminKycPageInner from "./AdminKycPageInner";

export default function AdminKycPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
          <p className="text-gray-600">Loading KYC…</p>
        </div>
      }
    >
      <AdminKycPageInner />
    </Suspense>
  );
}
