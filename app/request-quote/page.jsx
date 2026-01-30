"use client";
import ShowStatus from "@/Components/ShowStatus";
import { useRef, useState } from "react";
import RequestQuoteForm from "@/Components/RequestQuoteForm";

export default function RequestQuotePage() {
  const [status, setStatus] = useState({ title: "", message: "" });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [quoteId, setQuoteId] = useState(null);
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
      
      if (result) {
        setQuoteId(result.otpId);
        setShowOtpModal(true);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      showStatus("warning", "Please enter the OTP", "");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/quotes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        showStatus("error", "Invalid OTP", data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      showStatus(
        "success",
        "Quote Submitted",
        "Your quote request has been submitted successfully!"
      );
      
      setShowOtpModal(false);
      setOtp("");
      setQuoteId(null);
    } catch (err) {
      console.error(err);
      showStatus("error", "Verification Failed", "Verification failed");
    }

    setLoading(false);
  };

  return (
    <main className="bg-[#F5F5F7] min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-semibold text-center font-['SF Pro Display'] text-gray-900 mb-10">
          Request a Quote
        </h1>

        <RequestQuoteForm ref={formRef} setParentLoading={setLoading} adminMode={false} />

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <button
            type="button"
            disabled={formRef.current?.loading}
            onClick={handleSubmitClick}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:bg-blue-300"
          >
            {formRef.current?.loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {showOtpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">Verify OTP</h3>
              <p className="text-gray-600 mb-4">
                Enter the 6-digit OTP sent to your email
              </p>

              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-widest outline-none focus:ring focus:ring-blue-300"
                placeholder="••••••"
              />

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              {status.message && (
                <p className="text-red-500 text-sm mt-3">{status.message}</p>
              )}
            </div>
          </div>
        )}
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