// src/models/PartyDirectory.js
//
// Lightweight collection that stores party (consignee/buyer) details keyed
// by GSTIN. Populated automatically whenever a proforma invoice is saved.
// Used by the GSTIN auto-fill feature on the invoice editor.
//
// Intentionally separate from User — parties on an invoice are often
// third-party companies that have no login account in the system.

import mongoose from "mongoose";

const PartyDirectorySchema = new mongoose.Schema(
    {
        gstin: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true,
        },

        name: { type: String, default: "" }, // company / person name
        address: { type: String, default: "" }, // full address as typed on invoice
        pan: { type: String, default: "", uppercase: true, trim: true },
        state: { type: String, default: "" }, // e.g. "Punjab, 03"

        // Track when this record was last seen on an invoice (for staleness)
        lastSeenAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.PartyDirectory ||
    mongoose.model("PartyDirectory", PartyDirectorySchema);