import * as mongoose from "mongoose";

const ResourceCommentSchema = new mongoose.Schema(
  {
    // ==========================================
    // ARTICLE
    // ==========================================

    articleSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    articleTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // USER INFORMATION
    // ==========================================

    // This name will eventually be displayed publicly
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Private contact information
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      maxlength: 254,
    },

    mobile: {
      type: String,
      trim: true,
      default: null,
      maxlength: 30,
    },

    // ==========================================
    // QUESTION
    // ==========================================

    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },

    // ==========================================
    // MODERATION
    // ==========================================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // ==========================================
    // ANSWER
    // ==========================================

    isAnswered: {
      type: Boolean,
      default: false,
    },

    answer: {
      type: String,
      trim: true,
      default: null,
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    answeredAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================
// REQUIRE EMAIL OR MOBILE
// ==========================================

ResourceCommentSchema.pre("validate", function (next) {
  const hasEmail =
    typeof this.email === "string" &&
    this.email.trim().length > 0;

  const hasMobile =
    typeof this.mobile === "string" &&
    this.mobile.trim().length > 0;

  if (!hasEmail && !hasMobile) {
    this.invalidate(
      "email",
      "Either email or mobile number is required."
    );

    this.invalidate(
      "mobile",
      "Either email or mobile number is required."
    );
  }

  next();
});

// ==========================================
// MODEL
// ==========================================

export default mongoose.models?.ResourceComment ||
  mongoose.model("ResourceComment", ResourceCommentSchema);