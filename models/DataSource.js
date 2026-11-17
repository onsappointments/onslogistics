
import mongoose from "mongoose";

const DataSourceSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: null,
      maxlength: 1000,
    },

    websiteUrl: {
      type: String,
      default: null,
      trim: true,
    },

    dataUrl: {
      type: String,
      default: null,
      trim: true,
    },

    providerType: {
      type: String,
      enum: [
        "government",
        "international-organization",
        "market-data",
        "news",
        "other",
      ],
      default: "other",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "disabled"],
      default: "active",
      index: true,
    },

    coverage: {
      type: [String],
      default: [],
    },

    dataCategories: {
      type: [String],
      default: [],
    },

    attribution: {
      type: String,
      default: null,
      maxlength: 1000,
    },

    licenseUrl: {
      type: String,
      default: null,
      trim: true,
    },

    updateFrequency: {
      type: String,
      enum: [
        "realtime",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "annual",
        "irregular",
        "unknown",
      ],
      default: "unknown",
    },

    sync: {
      lastAttemptAt: {
        type: Date,
        default: null,
      },

      lastSuccessAt: {
        type: Date,
        default: null,
      },

      lastError: {
        type: String,
        default: null,
        maxlength: 2000,
      },

      consecutiveFailures: {
        type: Number,
        default: 0,
        min: 0,
      },

      lastFetchedCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      lastInsertedCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

DataSourceSchema.index({ status: 1, providerType: 1 });

export default
  mongoose.models.DataSource ||
  mongoose.model("DataSource", DataSourceSchema);
