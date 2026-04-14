import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
      required: true,
    },

    // ✅ optional at schema level; enforced in pre-validate
    company: { type: String, default: undefined, trim: true },
    gstin: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      unique: true,
      validate: {
        validator: (v) => !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v),
        message: "Invalid GSTIN format",
      },
    },

pan: {
  type: String,
  uppercase: true,
  trim: true,
  sparse: true,
  unique: true,
},

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    country: { type: String, default: undefined, trim: true },

    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    clientOtp: { type: String, default: null },
    clientOtpExpiresAt: { type: Date, default: null },
    clientOtpAttempts: { type: Number, default: 0 },
    clientOtpLastSentAt: { type: Date, default: null },
    kycVerified: { type: Boolean, default: false },
    adminType: {
      type: String,
      enum: ["super_admin", "manager", "accounts", "sales", "operations", "IT", "reception"],
      default: undefined,
    },

    permissions: { type: [String], default: [] },
    personalEmail : {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    }
  },
  { timestamps: true }
);

// ✅ enforce requirements deterministically (no flaky conditional `required`)
UserSchema.pre("validate", function (next) {
  // Admin rules
  if (this.role === "admin") {
    this.company = undefined; // never required for admin
    if (!this.adminType) return next(new Error("adminType is required for admins"));
    return next();
  }

  // Client rules
  if (this.role === "client") {
    this.adminType = undefined;
    this.permissions = []; // optional: keep clients clean
    if (!this.company) return next(new Error("Company is required for clients"));
  }

  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
