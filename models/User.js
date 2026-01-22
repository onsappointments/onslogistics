import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    company: { type: String, required: function () { return this.role === "client"; } },
    email: { type: String, required: true, unique: true },
    country: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
    adminType: {
      type: String,
      enum: ["super_admin", "manager", "accounts", "sales", "operations","IT","reception"],
      required: function () {
        return this.role === "admin";
      },
    },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
