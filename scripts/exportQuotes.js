import fs from "fs";

import connectDB from "../lib/mongodb.js";
import Quote from "../models/Quote.js";

async function exportQuotes() {
  await connectDB();

  const quotes = await Quote.find().lean();

  fs.writeFileSync(
    "quotes.json",
    JSON.stringify(quotes, null, 2)
  );

  console.log(`Exported ${quotes.length} quotes.`);
}

exportQuotes();