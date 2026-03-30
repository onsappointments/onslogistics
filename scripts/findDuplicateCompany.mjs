// scripts/findDuplicateCompanies.mjs
import mongoose from "mongoose";
import User from "../models/User.js";

function normalize(s) {
    return s.toLowerCase()
        .replace(/\b(pvt|ltd|private|limited|llp|inc|corp|co)\b/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function similarity(a, b) {
    const na = normalize(a), nb = normalize(b);
    if (!na || !nb) return 0;
    const dp = Array.from({ length: na.length + 1 }, (_, i) =>
        Array.from({ length: nb.length + 1 }, (_, j) =>
            i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= na.length; i++)
        for (let j = 1; j <= nb.length; j++)
            dp[i][j] = na[i - 1] === nb[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return 1 - dp[na.length][nb.length] / Math.max(na.length, nb.length);
}

await mongoose.connect(process.env.MONGODB_URI);

const clients = await User.find({
    role: "client",
    company: { $exists: true, $ne: "" }
}).select("_id company email gstin createdAt").lean();

const groups = [];
const visited = new Set();

for (let i = 0; i < clients.length; i++) {
    if (visited.has(i)) continue;
    const group = [clients[i]];

    for (let j = i + 1; j < clients.length; j++) {
        if (visited.has(j)) continue;
        if (similarity(clients[i].company, clients[j].company) >= 0.80) {
            group.push(clients[j]);
            visited.add(j);
        }
    }
    visited.add(i);
    if (group.length > 1) groups.push(group);
}

console.log(`\nFound ${groups.length} potential duplicate groups:\n`);
console.log("=".repeat(60));

groups.forEach((group, i) => {
    console.log(`\nGroup ${i + 1}:`);
    group.forEach(u => {
        console.log(`  ID:      ${u._id}`);
        console.log(`  Name:    ${u.company}`);
        console.log(`  Email:   ${u.email}`);
        console.log(`  GSTIN:   ${u.gstin ?? "none"}`);
        console.log(`  Created: ${u.createdAt}`);
        console.log(`  ----`);
    });
});

await mongoose.disconnect();