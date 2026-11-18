
import mongoose from "mongoose";

const TradeFlowSchema = new mongoose.Schema(
  {
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataSource",
      required: true,
      index: true,
    },

    typeCode: {
      type: String,
      default: "C",
      required: true,
    },


    frequency: {
      type: String,
      enum: ["A", "M"],
      required: true,
    },

    period: {
      type: String,
      required: true,
      index: true,
    },

    periodStart: {
      type: Date,
      required: true,
    },

    reporterCode: {
      type: Number,
      required: true,
    },

    reporterISO: {
      type: String,
      default: null,
    },

    reporterName: {
      type: String,
      default: null,
    },

    partnerCode: {
      type: Number,
      required: true,
    },

    partnerISO: {
      type: String,
      default: null,
    },

    partnerName: {
      type: String,
      default: null,
    },

    flowCode: {
      type: String,
      required: true,
    },

    flowName: {
      type: String,
      default: null,
    },

    classificationCode: {
      type: String,
      default: null,
    },

    classificationSearchCode: {
      type: String,
      default: null,
    },

    isOriginalClassification: {
      type: Boolean,
      default: null,
    },

    cmdCode: {
      type: String,
      required: true,
    },

    cmdName: {
      type: String,
      default: null,
    },

    aggregationLevel: {
      type: Number,
      default: null,
    },

    primaryValue: {
      type: Number,
      default: null,
    },

    cifValue: {
      type: Number,
      default: null,
    },

    fobValue: {
      type: Number,
      default: null,
    },

    netWeight: {
      type: Number,
      default: null,
    },

    grossWeight: {
      type: Number,
      default: null,
    },

    quantity: {
      type: Number,
      default: null,
    },

    quantityUnitCode: {
      type: Number,
      default: null,
    },

    quantityUnit: {
      type: String,
      default: null,
    },

    alternateQuantity: {
      type: Number,
      default: null,
    },

    alternateQuantityUnitCode: {
      type: Number,
      default: null,
    },

    alternateQuantityUnit: {
      type: String,
      default: null,
    },

    isAlternateQuantityEstimated: {
      type: Boolean,
      default: null,
    },

    isQuantityEstimated: {
      type: Boolean,
      default: null,
    },

    isNetWeightEstimated: {
      type: Boolean,
      default: null,
    },

    isGrossWeightEstimated: {
      type: Boolean,
      default: null,
    },

    isReported: {
      type: Boolean,
      default: null,
    },

    isAggregate: {
      type: Boolean,
      default: null,
    },

    sourceRecordId: {
      type: String,
      default: null,
    },

    sourceUrl: {
      type: String,
      default: null,
    },

    firstFetchedAt: {
      type: Date,
      default: Date.now,
    },

    lastFetchedAt: {
      type: Date,
      default: Date.now,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// One record per source, period, reporter, partner,
// flow, classification and commodity code.
TradeFlowSchema.index(
  {
    source: 1,
    frequency: 1,
    period: 1,
    reporterCode: 1,
    partnerCode: 1,
    flowCode: 1,
    classificationCode: 1,
    cmdCode: 1,
  },
  { unique: true }
);

TradeFlowSchema.index({
  reporterCode: 1,
  period: -1,
  flowCode: 1,
});

TradeFlowSchema.index({
  reporterCode: 1,
  partnerCode: 1,
  period: -1,
  flowCode: 1,
});

TradeFlowSchema.index({
  cmdCode: 1,
  period: -1,
  flowCode: 1,
});

export default
  mongoose.models.TradeFlow ||
  mongoose.model("TradeFlow", TradeFlowSchema);
