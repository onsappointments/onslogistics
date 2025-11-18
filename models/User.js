import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    businessName: { type: String },
    businessContact: { type: String },
    email: { type: String, required: true, unique: true },
    country: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
