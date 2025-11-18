"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert("📧 Password reset link sent (placeholder)");
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div
        className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl 
        shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/40 p-10"
      >
        <h1 className="text-3xl font-semibold text-center mb-8 font-['SF Pro Display'] text-[#1d1d1f]">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Enter your registered email"
            required
            className="p-4 rounded-xl border border-gray-300 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-medium text-lg py-3 rounded-full 
            hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
