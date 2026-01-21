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
  { label: "Audit Logs", value: "audit_logs:view" },
  { label: "Create Admin", value: "admin:create" },
  { label: "Approval Requests", value: "approvals:permission" },
];

export default function CreateAdminForm({ adminsData = [] }) {
  const router = useRouter();

  const [mode, setMode] = useState("create"); // "create" or "edit"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    adminType: "operations",
    permissions: [],
  });

  /* ---------------- LOAD ADMIN FOR EDITING ---------------- */

  const loadAdminForEdit = (adminId) => {
    if (!adminId) return;

    const selectedAdmin = adminsData.find((admin) => admin._id === adminId);

    if (selectedAdmin) {
      setFormData({
        fullName: selectedAdmin.fullName || "",
        email: selectedAdmin.email || "",
        password: "",
        confirmPassword: "",
        phone: selectedAdmin.phone || "",
        adminType: selectedAdmin.adminType || "operations",
        permissions: selectedAdmin.permissions || [],
      });
      setMode("edit");
      setSelectedAdminId(adminId);
      setError("");
      setSuccess("");
    }
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "adminType") {
      setFormData((prev) => ({
        ...prev,
        adminType: value,
        permissions:
          value === "super_admin" ? ALL_PERMISSION_VALUES : prev.permissions,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permission) => {
    if (isSuperAdmin) return; // Don't allow toggling for super admin

    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleAdminSelect = (e) => {
    const adminId = e.target.value;
    setSelectedAdminId(adminId);

    if (adminId) {
      loadAdminForEdit(adminId);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      adminType: "operations",
      permissions: [],
    });
    setMode("create");
    setSelectedAdminId("");
    setError("");
    setSuccess("");
  };

  const isSuperAdmin = formData.adminType === "super_admin";
  const ALL_PERMISSION_VALUES = PERMISSION_OPTIONS.map((perm) => perm.value);

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!formData.fullName || !formData.email) {
      setError("Full name and email are required");
      return false;
    }

    // Password is required only for create mode
    if (mode === "create" && !formData.password) {
      setError("Password is required");
      return false;
    }

    // If password is provided in edit mode or required in create mode
    if (formData.password) {
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
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
      const url =
        mode === "edit"
          ? `/api/admin/update/${selectedAdminId}`
          : "/api/admin/create";

      const method = mode === "edit" ? "PUT" : "POST";

      // Don't send password fields if they're empty in edit mode
      const submitData = { ...formData };
      if (mode === "edit" && !submitData.password) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `Failed to ${mode} admin`);

      setSuccess(
        mode === "edit"
          ? "Admin updated successfully"
          : "Admin created successfully"
      );

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/admin");
        router.refresh(); // Refresh to get updated data
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
          <h2 className="text-2xl font-bold text-white">
            {mode === "edit" ? "Edit Admin" : "Create Admin"}
          </h2>
          <p className="text-blue-100 text-sm">
            {mode === "edit"
              ? "Update administrator details and permissions"
              : "Add a new administrator and assign menu permissions"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* ADMIN SELECTOR */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Admin to Edit (optional)
            </label>
            <div className="flex gap-3">
              <select
                value={selectedAdminId}
                onChange={handleAdminSelect}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Edit Admin --</option>
                {adminsData.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.fullName} ({admin.email}) - {admin.adminType}
                  </option>
                ))}
              </select>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Security</h3>
            {mode === "edit" && (
              <p className="text-sm text-gray-600 mb-2">
                Leave password fields empty to keep current password
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder={
                  mode === "edit" ? "New Password (optional)" : "Password"
                }
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* ADMIN TYPE */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Admin Type</h3>

            <select
              name="adminType"
              value={formData.adminType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="super_admin">Super Admin</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
              <option value="operations">Operations</option>
              <option value="accounts">Accounts</option>
              <option value="IT">IT</option>
              <option value="reception">Reception</option>
            </select>
          </div>

          {/* PERMISSIONS */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Menu Permissions
            </h3>
            {isSuperAdmin && (
              <p className="text-sm text-blue-600 mb-2">
                Super Admin has all permissions by default
              </p>
            )}

            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSION_OPTIONS.map((perm) => (
                <label
                  key={perm.value}
                  className={`flex items-center space-x-2 text-sm ${
                    isSuperAdmin
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      isSuperAdmin || formData.permissions.includes(perm.value)
                    }
                    onChange={() => togglePermission(perm.value)}
                    disabled={isSuperAdmin}
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
              className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
            >
              {loading
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Update Admin"
                : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}