"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match ❌");
    return;
  }

  setLoading(true);

  const formData = {
    fullName: e.target.fullName.value,
    businessName: e.target.businessName.value,
    businessContact: e.target.businessContact.value,
    email: e.target.email.value,
    country: e.target.country.value,
    password,
  };

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("✅ Account created successfully!");
      window.location.href = "/login"; // redirect to login page
    } else {
      const data = await res.json();
      alert(`⚠️ ${data.message || "Registration failed"}`);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Something went wrong while creating the account");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div
        className="w-full max-w-3xl bg-white/70 backdrop-blur-2xl rounded-3xl 
        shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/40 p-12"
      >
        <h1 className="text-4xl font-semibold text-center mb-10 font-['SF Pro Display'] text-[#1d1d1f]">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />

            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              required
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />

            <input
              type="tel"
              name="businessContact"
              placeholder="Business Contact Info (Phone / WhatsApp)"
              required
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />

            <select
              name="country"
              required
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
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
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-4 rounded-xl border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium text-lg py-3 rounded-full 
              hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

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
