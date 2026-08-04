import mongoose from "mongoose";

const CompanyGSTSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gstin: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
      default: undefined,
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CompanyGST ||
  mongoose.model("CompanyGST", CompanyGSTSchema);