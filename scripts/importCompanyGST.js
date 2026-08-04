import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";

import connectDB from "../lib/mongodb.js";
import CompanyGST from "../models/CompanyGST.js";

async function importCompanies() {
  try {
    await connectDB();

    console.log("✅ Connected to MongoDB");

    const filePath = path.join(process.cwd(), "PARTY DETAIL.xls");

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    const companies = rows
      .slice(9) // Skip Tally report header
      .filter((row) => row[1] && String(row[1]).trim() !== "")
      .map((row) => ({
        name: String(row[1]).trim(),
        state: String(row[3] || "").trim(),
        gstin: String(row[5] || "").trim().toUpperCase() || undefined,
      }));

    console.log(`📄 Companies Found: ${companies.length}`);

    const operations = companies.map((company) => {
      const filter = company.gstin
        ? { gstin: company.gstin }
        : { name: company.name };

      const update = {
        name: company.name,
        state: company.state,
        isActive: true,
      };

      // Only set GSTIN if it exists
      if (company.gstin) {
        update.gstin = company.gstin;
      }

      return {
        updateOne: {
          filter,
          update: {
            $set: update,
          },
          upsert: true,
        },
      };
    });

    const result = await CompanyGST.bulkWrite(operations);

    console.log("\n==============================");
    console.log("✅ Company Import Completed");
    console.log("==============================");
    console.log("Inserted :", result.upsertedCount);
    console.log("Updated  :", result.modifiedCount);
    console.log("Matched  :", result.matchedCount);
    console.log("==============================\n");
  } catch (err) {
    console.error("\n❌ Import Failed\n");
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

importCompanies();