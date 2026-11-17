
import mongoose from "mongoose";

const TradeIndicatorSchema = new mongoose.Schema(
  {
    // Stable identifier for the type of metric.
    // Examples: india-merchandise-exports, crude-oil-price
    indicatorKey: {
      type: String,
      required: true,
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

    category: {
      type: String,
      required: true,
      enum: [
        "trade-volume",
        "trade-value",
        "commodity-price",
        "commodity-index",
        "freight-rate",
        "economic",
        "port-activity",
        "other",
      ],
      index: true,
    },

    // The actual numerical observation.
    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    currency: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
      maxlength: 3,
    },

    // Time period represented by this observation.
    period: {
      start: {
        type: Date,
        required: true,
      },

      end: {
        type: Date,
        default: null,
      },

      label: {
        type: String,
        default: null,
        maxlength: 50,
      },

      frequency: {
        type: String,
        enum: [
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "annual",
          "irregular",
        ],
        required: true,
      },
    },

    // Flexible geography supports countries, regions, ports and routes.
    geography: {
      key: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      type: {
        type: String,
        enum: [
          "global",
          "country",
          "region",
          "port",
          "route",
        ],
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      countryCode: {
        type: String,
        default: null,
        uppercase: true,
        trim: true,
        maxlength: 3,
      },
    },

    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataSource",
      required: true,
    },

    sourceRecordId: {
      type: String,
      default: null,
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: null,
      trim: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    fetchedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["published", "archived"],
      default: "published",
      index: true,
    },

    // Provider-specific information that does not fit
    // the common normalized fields above.
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same provider from inserting the same
// indicator, geography and period more than once.
TradeIndicatorSchema.index(
  {
    source: 1,
    indicatorKey: 1,
    "geography.key": 1,
    "period.start": 1,
  },
  {
    unique: true,
  }
);

// Efficient time-series queries for charts.
TradeIndicatorSchema.index({
  indicatorKey: 1,
  "geography.key": 1,
  "period.start": -1,
  status: 1,
});

TradeIndicatorSchema.index({
  category: 1,
  "period.start": -1,
  status: 1,
});

TradeIndicatorSchema.index({
  source: 1,
  "period.start": -1,
});

export default
  mongoose.models.TradeIndicator ||
  mongoose.model("TradeIndicator", TradeIndicatorSchema);
