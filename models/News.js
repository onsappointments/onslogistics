import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    canonicalUrlHash: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      default: "GDELT",
    },
    sourceDomain: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "customs-compliance",
        "freight-market",
        "trade-routes",
        "ports-logistics",
        "global-trade",
      ],
      index: true,
    },
    status: {
      type: String,
      enum: ["published", "archived"],
      default: "published",
      index: true,
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },
    firstSeenAt: {
      type: Date,
      default: Date.now,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: null,
    },
    sourceCountry: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

NewsSchema.index({ canonicalUrlHash: 1 }, { unique: true });
NewsSchema.index({ slug: 1 }, { unique: true });
NewsSchema.index({ status: 1, publishedAt: -1 });
NewsSchema.index({ category: 1, status: 1, publishedAt: -1 });

export default mongoose.models.News || mongoose.model("News", NewsSchema);
