import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true, // ✅ now we store the client's business name
    },
  
    shipmentId: {
  type: String, // ✅ accept text like “12345” or “SHIP-12”
  required: false,
},

    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);

