"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // ✅ Email OTP modal state (your existing)
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");
  const [otpErr, setOtpErr] = useState("");

  const isClient = useMemo(() => session?.user?.role === "client", [session]);
  const userId = session?.user?.id;
  const company = session?.user?.company;
  const currentUser = session?.user;

  const email =
    session?.user?.email ||
    session?.user?.requestedByEmail ||
    "";

  // ✅ KYC state
  const [kycLoading, setKycLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState("not_submitted"); // not_submitted | pending | approved | rejected
  const [kycReason, setKycReason] = useState(null);
  const [kycDocs, setKycDocs] = useState([]); // [{type,fileUrl,uploadedAt}]
  const [kycErr, setKycErr] = useState("");
  const [kycMsg, setKycMsg] = useState("");

  // Upload fields
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [pan, setPan] = useState(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);

  const kycApproved = kycStatus === "approved";

  // Redirect if not authenticated / not client
  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !isClient) {
      router.push("/login");
    }
  }, [status, isClient, router]);

  // ✅ Fetch KYC status
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    const fetchKyc = async () => {
      setKycLoading(true);
      setKycErr("");
      try {
        const res = await fetch("/api/kyc/status", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // If API not ready yet, keep UI safe
          setKycStatus("not_submitted");
          return;
        }

        setKycStatus(data?.status || "not_submitted");
        setKycReason(data?.rejectionReason || null);
        setKycDocs(Array.isArray(data?.documents) ? data.documents : []);
      } catch (e) {
        console.error("❌ KYC status fetch failed:", e);
        setKycStatus("not_submitted");
      } finally {
        setKycLoading(false);
      }
    };

    fetchKyc();
  }, [status, isClient]);

  // Fetch ongoing jobs (basic fields only)
  useEffect(() => {
    if (status !== "authenticated" || !isClient) return;

    if (!userId) {
      console.warn("⚠️ session.user.id missing. Add it in NextAuth callbacks.");
      return;
    }

    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await fetch("/api/client/jobs", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("❌ Jobs API error:", data);
          setJobs([]);
          return;
        }

        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        console.error("❌ Failed to fetch jobs:", err);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [status, isClient, userId]);

  // When modal opens, auto-send OTP once
  useEffect(() => {
    if (!otpModal) return;

    setOtp("");
    setOtpErr("");
    setOtpMsg("");

    requestOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpModal]);

  const requestOtp = async () => {
    setOtpErr("");
    setOtpMsg("");

    if (!email) {
      setOtpErr("Email missing in session. Please login again.");
      return;
    }
    if (otpSending) return;

    setOtpSending(true);
    try {
      const res = await fetch("/api/client/verify/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setOtpErr(data?.error || "Failed to send OTP.");
        return;
      }

      setOtpMsg(data?.message || "OTP sent. Check your email.");
    } catch (e) {
      console.error(e);
      setOtpErr("Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    setOtpErr("");
    setOtpMsg("");

    if (!email) {
      setOtpErr("Email missing in session. Please login again.");
      return;
    }
    if (!otp || String(otp).trim().length < 4) {
      setOtpErr("Please enter a valid OTP.");
      return;
    }
    if (otpVerifying) return;

    setOtpVerifying(true);
    try {
      const res = await fetch("/api/client/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: String(otp).trim() }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setOtpErr(data?.error || "Invalid OTP.");
        return;
      }

      setOtpMsg(data?.message || "Verified successfully!");

      try {
        await update();
      } catch (err) {
        console.error("❌ Session update failed:", err);
      }

      setTimeout(async () => {
        setOtpModal(false);
        setOtp("");
        setOtpErr("");
        setOtpMsg("");
        await update();
      }, 1000);
    } catch (e) {
      console.error(e);
      setOtpErr("Verification failed. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  // ✅ KYC Upload handler
  const submitKyc = async () => {
    setKycErr("");
    setKycMsg("");

    // Aadhaar needs both sides
    if (!aadhaarFront || !aadhaarBack || !pan) {
      setKycErr("Please upload Aadhaar front, Aadhaar back, and PAN.");
      return;
    }

    if (uploadingKyc) return;

    setUploadingKyc(true);
    try {
      const fd = new FormData();
      fd.append("aadhaar_front", aadhaarFront);
      fd.append("aadhaar_back", aadhaarBack);
      fd.append("pan", pan);

      const res = await fetch("/api/kyc/upload", {
        method: "POST",
        body: fd,
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setKycErr(data?.error || "Failed to upload documents.");
        return;
      }

      setKycMsg("Documents uploaded successfully. Verification is in progress.");
      setKycStatus(data?.status || "pending");
      setKycReason(null);

      // reset inputs
      setAadhaarFront(null);
      setAadhaarBack(null);
      setPan(null);
    } catch (e) {
      console.error(e);
      setKycErr("Upload failed. Please try again.");
    } finally {
      setUploadingKyc(false);
    }
  };

  const prettyKycStatus = (s) => {
    if (s === "not_submitted") return "Not submitted";
    if (s === "pending") return "Under review";
    if (s === "approved") return "Approved";
    if (s === "rejected") return "Rejected";
    return s;
  };

  if (status === "loading") {
    return <p className="text-center mt-20">Loading your dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-3">
                Welcome back, {session?.user?.name || session?.user?.fullName || "Client"} 👋
              </h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                {company && (
                  <>
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium text-gray-800">{company}</span>
                  </>
                )}
              </p>
            </div>

            {/* Email Verified badge (your existing meaning) */}
            {currentUser?.verified && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-sm">Email Verified</span>
              </div>
            )}
          </div>
        </section>

        {/* Email Verify banner (your existing) */}
        {currentUser?.verified === false && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">Account Verification Required</h3>
                <p className="text-yellow-800 text-sm">
                  Please verify your email to access all features.{" "}
                  <button
                    onClick={() => setOtpModal(true)}
                    className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors"
                  >
                    Verify Now →
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ KYC Verification Card */}
        <section id="kyc" className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3zm8 0c0 2.761-2.239 5-5 5a4.99 4.99 0 01-4.9-4H3V7a2 2 0 012-2h14a2 2 0 012 2v4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">ID Verification (KYC)</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload Aadhaar & PAN so we can verify your identity.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                    kycStatus === "approved"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : kycStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : kycStatus === "rejected"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {kycLoading ? "Checking status..." : prettyKycStatus(kycStatus)}
                </span>

                {kycStatus === "rejected" && kycReason && (
                  <span className="text-sm text-red-700">
                    Reason: <span className="font-semibold">{kycReason}</span>
                  </span>
                )}
              </div>

              {/* Alerts */}
              {kycErr && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{kycErr}</p>
                </div>
              )}
              {kycMsg && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">{kycMsg}</p>
                </div>
              )}

              {/* Status Views */}
              <div className="mt-6">
                {kycStatus === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-900">Your ID is verified ✅</p>
                      <p className="text-sm text-green-800 mt-1">
                        You can now use all dashboard features.
                      </p>
                    </div>
                  </div>
                )}

                {(kycStatus === "pending") && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v5h2V7zm0 6H9v2h2v-2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-900">Under review ⏳</p>
                      <p className="text-sm text-yellow-800 mt-1">
                        Our team is verifying your documents. You’ll see “Approved” once done.
                      </p>
                    </div>
                  </div>
                )}

                {(kycStatus === "not_submitted" || kycStatus === "rejected") && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                      <p className="font-semibold text-blue-900">Upload Documents</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Aadhaar requires <b>front + back</b>. PAN requires <b>one image</b>.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="block bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Aadhaar (Front)</p>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setAadhaarFront(e.target.files?.[0] || null)}
                          className="block w-full text-sm"
                        />
                        {aadhaarFront && (
                          <p className="text-xs text-gray-500 mt-2 truncate">Selected: {aadhaarFront.name}</p>
                        )}
                      </label>

                      <label className="block bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Aadhaar (Back)</p>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setAadhaarBack(e.target.files?.[0] || null)}
                          className="block w-full text-sm"
                        />
                        {aadhaarBack && (
                          <p className="text-xs text-gray-500 mt-2 truncate">Selected: {aadhaarBack.name}</p>
                        )}
                      </label>

                      <label className="block bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">PAN</p>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setPan(e.target.files?.[0] || null)}
                          className="block w-full text-sm"
                        />
                        {pan && (
                          <p className="text-xs text-gray-500 mt-2 truncate">Selected: {pan.name}</p>
                        )}
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={submitKyc}
                        disabled={uploadingKyc}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingKyc ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          "Submit for Verification"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAadhaarFront(null);
                          setAadhaarBack(null);
                          setPan(null);
                          setKycErr("");
                          setKycMsg("");
                        }}
                        className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold rounded-xl px-6 py-3 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: small checklist */}
          {kycStatus !== "approved" && ( <div className="hidden lg:block w-80">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-5">
                <p className="font-bold text-gray-900 mb-3">Checklist</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Aadhaar Front (clear photo)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Aadhaar Back (clear photo)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    PAN (clear photo)
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">
                  Tip: Avoid glare, blur, and cropped edges.
                </p>
              </div>
            </div>
          )}
          </div>
        </section>

        {/* ✅ Ongoing Jobs (soft-locked until KYC approved) */}
        <section className="relative bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
          {!kycApproved && (
            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center p-6">
              <div className="max-w-lg text-center bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <p className="text-lg font-bold text-gray-900">Complete ID Verification to continue</p>
                <p className="text-sm text-gray-600 mt-2">
                  Upload Aadhaar & PAN above. Once approved, you’ll get full access.
                </p>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-3 transition-all"
                >
                  Go to KYC
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* --- your jobs UI unchanged below --- */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ongoing Jobs</h2>
              <p className="text-sm text-gray-500 mt-1">Track and manage your shipments</p>
            </div>

            {jobs?.length > 0 && (
              <button
                type="button"
                onClick={() => router.push("/dashboard/client/jobs")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {jobsLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-blue-600">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">Fetching your jobs...</span>
              </div>
            </div>
          )}

          {!jobsLoading && jobs?.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-500">You don't have any ongoing shipments at the moment.</p>
            </div>
          )}

          {!jobsLoading && jobs?.length > 0 && (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j._id}
                  onClick={() => router.push(`/dashboard/client/jobs/${j._id}`)}
                  className="group bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-blue-100/50 border border-gray-200 hover:border-blue-300 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Job ID</p>
                        <p className="text-sm font-bold text-gray-900">{j.jobId}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</p>
                        <p className="text-sm text-gray-700">{j?.quoteId?.shipmentType || "-"}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            j.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : j.status === "active"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {j.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created</p>
                        <p className="text-sm text-gray-600">
                          {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "-"}
                        </p>
                      </div>
                    </div>

                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}

              <p className="text-xs text-center text-gray-500 mt-4 pt-4 border-t border-gray-200">
                💡 Tip: Click any job to view full details and documents
              </p>
            </div>
          )}
        </section>

        {/* Support (unchanged) */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Need Help?</h2>
                  <p className="text-blue-100 text-sm">We're here to assist you 24/7</p>
                </div>
              </div>
              <p className="text-blue-50 mb-4 max-w-xl">
                Contact our support team for shipment updates, documentation help, or any questions about your orders.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            <div className="hidden lg:block">
              <svg className="w-32 h-32 text-blue-500/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
          </div>
        </section>
      </div>

      {/* OTP Modal (your existing, unchanged) */}
      {otpModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setOtpModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl flex flex-col items-center w-full max-w-md transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Verify Your Account</h2>
                  <p className="text-blue-100 text-sm">Enter the code we sent to your email</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="w-full p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-900 text-center">
                  <span className="font-semibold">{email || "your email"}</span>
                </p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-4 mb-4 text-center text-2xl font-bold tracking-[0.5em] transition-all outline-none"
              />

              {otpErr && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm text-center flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {otpErr}
                  </p>
                </div>
              )}

              {otpMsg && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-700 text-sm text-center flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {otpMsg}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={otpSending}
                  className="flex-1 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold rounded-xl px-4 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpSending ? "Sending..." : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={otpVerifying || !otp}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setOtpModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <p className="text-xs text-gray-500">
                  OTP is valid for 10 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
