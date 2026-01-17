"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------- PERMISSION OPTIONS ---------------- */

const PERMISSION_OPTIONS = [
  { label: "Search Clients", value: "client:view" },
  { label: "View Quotes", value: "quote:view" },
  { label: "View Finalized Quotes", value: "quote:view_finalized" },
  { label: "Create a Job", value: "job:create" },
  { label: "New Jobs", value: "job:view_new" },
  { label: "Active Jobs", value: "job:view_active" },
  {label : "Audit Logs", value: "audit_logs:view"},
  {label: "Create Admin", value: "admin:create"},
];

export default function CreateAdminForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    adminType: "operations",
    permissions: [], // 👈 permissions as array
  });

  /* ---------------- HANDLERS ---------------- */

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "adminType") {
    setFormData((prev) => ({
      ...prev,
      adminType: value,
      permissions: value === "super_admin" ? ALL_PERMISSION_VALUES : prev.permissions,
    }));
    return;
  }

  setFormData((prev) => ({ ...prev, [name]: value }));
};


  const togglePermission = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const isSuperAdmin = formData.adminType === "super_admin";
  const ALL_PERMISSION_VALUES = PERMISSION_OPTIONS.map((perm) => perm.value);
  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Full name, email and password are required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create admin");

      setSuccess("Admin created successfully");

      setTimeout(() => {
        router.push("/dashboard/admin");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg">

        {/* HEADER */}
        <div className="bg-blue-600 px-8 py-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Create Admin</h2>
          <p className="text-blue-100 text-sm">
            Add a new administrator and assign menu permissions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* BASIC INFO */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Security
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* ADMIN TYPE */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Admin Type
            </h3>

            <select
              name="adminType"
              value={formData.adminType}
              onChange={handleChange}
              className="input"
            >
              <option value="super_admin">Super Admin</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
              <option value="operations">Operations</option>
              <option value="accounts">Accounts</option>
              <option value="IT">IT</option>
              <option value="reception">reception</option>
            </select>
          </div>

          {/* PERMISSIONS */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Menu Permissions
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSION_OPTIONS.map((perm) => (
                <label
                  key={perm.value}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSuperAdmin || formData.permissions.includes(perm.value)}
                    onChange={() => togglePermission(perm.value)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 border rounded-lg text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

