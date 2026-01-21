"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function RegisterPage() {
  // separate loading states (fix: Send + Verify shouldn’t share one loading)
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  // flow state
  const [hasRequestedQuote, setHasRequestedQuote] = useState(null); // null | "yes" | "no"

  // lead flow inputs
  const [companySearch, setCompanySearch] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [otp, setOtp] = useState("");

  // tokens
  const [challengeToken, setChallengeToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");

  // prefill fields (from quote)
  const [prefill, setPrefill] = useState(null);

  // password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isLeadFlow = hasRequestedQuote === "yes";
  const isNormalFlow = hasRequestedQuote === "no";

  const canShowForm = useMemo(() => {
    if (isNormalFlow) return true;
    if (isLeadFlow) return Boolean(verifiedToken && prefill);
    return false;
  }, [isNormalFlow, isLeadFlow, verifiedToken, prefill]);

  const resetAll = () => {
    setHasRequestedQuote(null);

    setCompanySearch("");
    setCompanyOptions([]);
    setSelectedCompany("");
    setLeadEmail("");
    setOtp("");

    setChallengeToken("");
    setVerifiedToken("");
    setPrefill(null);

    setPassword("");
    setConfirmPassword("");

    setSendingOtp(false);
    setVerifyingOtp(false);
    setRegistering(false);
  };

  // Company search (debounced)
  useEffect(() => {
    if (!isLeadFlow) return;

    const q = companySearch.trim();
    if (q.length < 2) {
      setCompanyOptions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/leads/companies?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setCompanyOptions(Array.isArray(data.companies) ? data.companies : []);
      } catch (e) {
        console.error(e);
        setCompanyOptions([]);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [companySearch, isLeadFlow]);

  const startOtp = async () => {
    if (sendingOtp || verifyingOtp || registering) return;

    if (!selectedCompany) return alert("Select your company first.");
    if (!leadEmail.trim()) return alert("Enter your email (same as in quote).");

    setSendingOtp(true);
    try {
      const res = await fetch("/api/leads/start-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: selectedCompany,
          email: leadEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(`⚠️ ${data.error || "Failed to send OTP"}`);
        return;
      }

      setChallengeToken(data.challengeToken || "");
      alert("✅ OTP sent to your email.");
    } catch (e) {
      console.error(e);
      alert("❌ Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (sendingOtp || verifyingOtp || registering) return;

    if (!challengeToken) return alert("Please request OTP first.");
    if (!otp.trim()) return alert("Enter OTP.");

    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/leads/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken,
          otp: otp.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(`⚠️ ${data.error || "OTP verification failed"}`);
        return;
      }

      setVerifiedToken(data.verifiedToken || "");
      setPrefill(data.prefill || null);

      // Lock company/email once verified (keep UI consistent)
      if (data.prefill?.company) {
        setSelectedCompany(data.prefill.company);
        setCompanySearch(data.prefill.company);
      }
      if (data.prefill?.email) setLeadEmail(data.prefill.email);

      alert("✅ OTP verified. Your details have been pre-filled.");
    } catch (e) {
      console.error(e);
      alert("❌ Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registering || sendingOtp || verifyingOtp) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    setRegistering(true);

    try {
      // ONE backend route: /api/register
      // Normal flow: send company+email
      // Lead flow: send verifiedToken (email+company comes from token)
      let payload;

      if (isNormalFlow) {
        payload = {
          fullName: e.target.fullName.value,
          company: e.target.company.value, // ✅ matches backend schema
          email: e.target.email.value,
          country: e.target.country.value,
          password,
        };
      } else {
        if (!verifiedToken) {
          alert("Please verify OTP first.");
          return;
        }

        payload = {
          verifiedToken,
          fullName: e.target.fullName.value || prefill?.fullName || "",
          country: e.target.country.value,
          password,
        };
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("✅ Account created successfully!");
        window.location.href = "/login";
      } else {
        alert(`⚠️ ${data.message || data.error || "Registration failed"}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong while creating the account");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/40 p-12">
        <h1 className="text-4xl font-semibold text-center mb-10 font-['SF Pro Display'] text-[#1d1d1f]">
          Create Account
        </h1>

        {/* Step 0: Question */}
        {hasRequestedQuote === null && (
          <div className="space-y-4">
            <p className="text-center text-gray-700">
              Have you requested a quote with us before?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setHasRequestedQuote("no")}
                className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setHasRequestedQuote("yes")}
                className="px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-black transition"
              >
                Yes
              </button>
            </div>
          </div>
        )}

        {/* Lead Flow Step: Company + Email + OTP */}
        {isLeadFlow && !canShowForm && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                Search and select your company (from your quote)
              </label>

              <input
                value={companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setSelectedCompany("");
                  // if user changes company again, invalidate tokens
                  setChallengeToken("");
                  setVerifiedToken("");
                  setPrefill(null);
                }}
                placeholder="Type company name..."
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              {companyOptions.length > 0 && !selectedCompany && (
                <div className="border border-gray-200 rounded-xl bg-white max-h-52 overflow-auto">
                  {companyOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCompany(c);
                        setCompanySearch(c);
                        setCompanyOptions([]);
                        setChallengeToken("");
                        setVerifiedToken("");
                        setPrefill(null);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {selectedCompany && (
                <p className="text-sm text-green-700">
                  Selected: <span className="font-semibold">{selectedCompany}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => {
                  setLeadEmail(e.target.value);
                  setChallengeToken("");
                  setVerifiedToken("");
                  setPrefill(null);
                }}
                placeholder="Email used in quote"
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <button
                type="button"
                disabled={sendingOtp || verifyingOtp || registering}
                onClick={startOtp}
                className="p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <button
                type="button"
                disabled={!challengeToken || verifyingOtp || sendingOtp || registering}
                onClick={verifyOtp}
                className="p-4 rounded-xl bg-gray-900 text-white hover:bg-black transition disabled:opacity-60"
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="text-sm text-gray-600 hover:underline"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Registration form */}
        {canShowForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                defaultValue={prefill?.fullName || ""}
                disabled={isLeadFlow}
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-100"
              />

              <input
                type="text"
                name="company"
                placeholder="Company Name"
                required
                defaultValue={prefill?.company || ""}
                disabled={isLeadFlow}
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-100"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                defaultValue={prefill?.email || ""}
                disabled={isLeadFlow}
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-100"
              />

              <select
                name="country"
                required
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                defaultValue=""
              >
                <option value="">Select Country / Region</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="USA">USA</option>
                <option value="Singapore">Singapore</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={registering || sendingOtp || verifyingOtp}
                className="w-full bg-blue-600 text-white font-medium text-lg py-3 rounded-full hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md disabled:opacity-60"
              >
                {registering ? "Registering..." : "Register"}
              </button>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="text-sm text-gray-600 hover:underline mx-auto"
            >
              Start over
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
