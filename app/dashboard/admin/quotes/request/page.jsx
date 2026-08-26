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
  console.log(
    "Admin quote created successfully, ID:",
    result.quoteId
  );

  // --------------------------------------------------
  // COPY PREVIOUS TECHNICAL QUOTE
  // --------------------------------------------------

  if (result.technicalQuote) {
    try {
      const technicalRes = await fetch(
        "/api/admin/technical-quotes/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteId: result.quoteId,

            shipmentType:
              result.shipmentType,

            lineItems:
              result.technicalQuote.lineItems || [],

            quoteValidity:
              result.technicalQuote.quoteValidity || {
                type: "DATE",
                etd: "",
                handoverLocation: "",
                validTill: "",
              },

            specialRemarks:
              result.technicalQuote.specialRemarks || [],
          }),
        }
      );

      const technicalData = await technicalRes.json();

      if (!technicalRes.ok) {
        console.error(
          "Failed to copy technical quote:",
          technicalData
        );

        showStatus(
          "warning",
          "Quote Created",
          "Client quote was created, but the previous technical quote could not be copied."
        );

        return;
      }

      console.log(
        "Technical quote copied successfully:",
        technicalData.technicalQuote
      );

    } catch (technicalError) {
      console.error(
        "Technical quote copy error:",
        technicalError
      );

      showStatus(
        "warning",
        "Quote Created",
        "Client quote was created, but the previous technical quote could not be copied."
      );

      return;
    }
  }
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