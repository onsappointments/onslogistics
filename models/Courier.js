import mongoose from "mongoose";

const CourierSchema = new mongoose.Schema(
  {
    entryType: {
      type: String,
      enum: ["receival", "dispatch"],
      required: true,
    },

    serialNo: { type: Number, required: true },

    date: { type: Date, default: Date.now },

    // RECEIVAL
    letterNo: String,
    fromWho: String,
    receiver: String,

    // DISPATCH
    name: String,
    address: String,
    place: String,
    dockNo: String,
    delivereddate: String , 
    status: String ,

    // COMMON
    subject: String,
    courierService: String,
    remarks: String,
    handoverby: String ,
    handoverto: String ,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Courier ||
  mongoose.model("Courier", CourierSchema);
