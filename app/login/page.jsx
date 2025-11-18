"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      setError("❌ Invalid email or password");
      setLoading(false);
      return;
    }

    // Fetch session details after login
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();

    // Redirect based on role
    if (sessionData?.user?.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/client");
    }

    setLoading(false);
  }; // ✅ ← This closing brace was missing!

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div
        className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl 
        shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/40 p-10"
      >
        {/* Title */}
        <h1 className="text-4xl font-semibold text-center mb-8 font-['SF Pro Display'] text-[#1d1d1f]">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="p-4 rounded-xl border border-gray-300 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="p-4 rounded-xl border border-gray-300 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
          />

          {/* Forgot Password */}
          <div className="text-right -mt-2">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm mb-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-medium text-lg py-3 rounded-full 
            hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
