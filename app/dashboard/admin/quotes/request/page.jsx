"use client";
import ShowStatus from "@/Components/ShowStatus";
import { useRef, useState } from "react";
import RequestQuoteForm from "@/Components/RequestQuoteForm";

export default function AdminRequestQuotePage() {
  const [status, setStatus] = useState({ title: "", message: "" });
  const [statusType, setStatusType] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const showStatus = (type, title, message) => {
    setStatusType(type);
    setStatus({ title, message });
    setShowStatusModal(true);
  };

  const handleSubmitClick = async () => {
    if (formRef.current?.handleSubmit) {
      const result = await formRef.current.handleSubmit(showStatus);
      
      if (result && result.skipOtp) {
       
        console.log("Admin quote created successfully, ID:", result.quoteId);
      }
    }
  };

  return (
    <main className="bg-[#F5F5F7] min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-semibold text-center font-['SF Pro Display'] text-gray-900 mb-10">
          Create Quote
        </h1>

        <RequestQuoteForm ref={formRef} adminMode={true} setParentLoading={setLoading} />

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmitClick}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Quote"}
          </button>
        </div>
      </div>

      {showStatusModal && (
        <ShowStatus
          type={statusType}
          title={status.title}
          message={status.message}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </main>
  );
}