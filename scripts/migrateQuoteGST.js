import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

import connectDB from "../lib/mongodb.js";
import Quote from "../models/Quote.js";
import CompanyGST from "../models/CompanyGST.js";

/**
 * Normalize company names for deterministic matching.
 * NO fuzzy matching.
 */
function normalize(name = "") {
  return String(name)
    .toUpperCase()

    // Replace punctuation with spaces
    .replace(/[.,()&/-]/g, " ")

    // Remove legal suffixes
    .replace(/\bPRIVATE\b/g, "")
    .replace(/\bPVT\b/g, "")
    .replace(/\bLIMITED\b/g, "")
    .replace(/\bLTD\b/g, "")
    .replace(/\bLLP\b/g, "")
    .replace(/\bINC\b/g, "")
    .replace(/\bCO\b/g, "")
    .replace(/\bCOMPANY\b/g, "")

    // Collapse whitespace
    .replace(/\s+/g, " ")

    .trim();
}



const COMPANY_ALIASES = {
  /*
  ==========================================================
  EXISTING SAFE FIXES
  ==========================================================
  */

  [normalize("METERO TYRES LIMITED")]:
    normalize("METRO TYRES LIMITED"),

  [normalize("PHEONIX TOOLS")]:
    normalize("PHOENIX TOOLS"),

  [normalize("GANPTI CREATION")]:
    normalize("GANPATI CREATION"),

  [normalize("ISSGF INDIA PRIVTAE LIMITED")]:
    normalize("ISSGF INDIA PRIVATE LIMITED"),

  [normalize("ISSGF INDIA PRIVITE LIMITED")]:
    normalize("ISSGF INDIA PRIVATE LIMITED"),

  [normalize("AWS WORLDWIDE")]:
    normalize("ABS WORLDWIDE PRIVATE LIMITED"),

  [normalize("AWS WORLDWIDE PVT LTD")]:
    normalize("ABS WORLDWIDE PRIVATE LIMITED"),

  [normalize("AWS WORLDWIDE PVT. LTD.")]:
    normalize("ABS WORLDWIDE PRIVATE LIMITED"),

  /*
  ==========================================================
  RENNY STRIPS
  ==========================================================
  */

  [normalize("RENNY STRIPS")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIPS LIMITED")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIPS LIMIITED")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIPS LIIMITED")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIPS PVT LTD")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIPS PRIVATE LIMITED")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIP LIMITED")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIP LIMITED INFRA DIVISION")]:
    normalize("Renny Strips Limited (Infra Division)"),

  [normalize("RENNY STRIPS LTD")]:
    normalize("Renny Strips Limited (Infra Division)"),

  /*
  ==========================================================
  DOUBLE BARREL JEANS
  ==========================================================
  */

  [normalize("DOUBLE BARREL JEANS")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  [normalize("DOUBLE BARREL JEANS PVT LTD")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  [normalize("DOUBLE BARREL JEANS PRIVATE LIMITED")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  [normalize("DOUBLE BARRREL JEANS PVT LTD")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  [normalize("DOUBLE BARREL JEANS INDIA PVT LTD")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  [normalize("DOUBLE BARREL JEANS INDKIA PVT LTD")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  [normalize("DOUBLE BARREL JEANS INDIA PRIVATE LIMITED")]:
    normalize("Double Barrel Jeans (India) Pvt Ltd."),

  /*
  ==========================================================
  RAM KISHAN SHANKAR DASS AGRO
  ==========================================================
  */

  [normalize("RAM KISHAN SHANKAR DASS AGRO")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RAM KISHAN SHANKAR DASS AGRO PVT LTD")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RAM KISHAN SHANKAR DASS AGRO PVT. LTD.")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RAM KISHAN SHANKAR DASS AGRO PRIVATE LIMITED")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RAM KISHAN SHANKAR DASS AGRO LTD")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RAM KISHAN DASS AGRO PVT LTD")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RAM KISHAN DASS AGRO PVT. LTD.")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  [normalize("RASM KISHAN SHANKAR DASS AGRO PVT LTD")]:
    normalize("Ram Kishan Shankar Dass Agro (P) Ltd"),

  /*
  ==========================================================
  ADVANCED MOLDING TECHNOLOGY
  ==========================================================
  */

  [normalize("ADVANCE MOLDING TECHNOLOGY")]:
    normalize("Advanced Molding Technology Private Limited"),

  [normalize("ADVANCE MODELING TECHNOLOGY")]:
    normalize("Advanced Molding Technology Private Limited"),

  [normalize("ADVANCE MOLDING TECHNOLOGY PRIVATE LIMITED")]:
    normalize("Advanced Molding Technology Private Limited"),

  [normalize("ADVANCED MOLDING TECHNOLOGY")]:
    normalize("Advanced Molding Technology Private Limited"),

  /*
==========================================================
ALBACORE LOGISTICS
==========================================================
*/

[normalize("ALBACORE LOGISTICS")]:
  normalize("Albacore Logistics LLP"),

[normalize("ALBACORE LOGISTICS LLP")]:
  normalize("Albacore Logistics LLP"),

[normalize("ALBACORE LOGISTICS LIMITED LIABILITY PARTNERSHIP")]:
  normalize("Albacore Logistics LLP"),

/*
==========================================================
DOGRA CARGO EXPRESS
==========================================================
*/

[normalize("DOGRA CARGGO EXPRESS PRIVATE LIMITED")]:
  normalize("Dogra Cargo Express Private Limited"),

[normalize("DOGRA CARGGO EXPRESS")]:
  normalize("Dogra Cargo Express Private Limited"),

[normalize("DOGRA CARGO EXPRESS PROVATE LIMITED")]:
  normalize("Dogra Cargo Express Private Limited"),

[normalize("DOGRA CARGO EXPRESS PRIVATE LIMITED")]:
  normalize("Dogra Cargo Express Private Limited"),

/*
==========================================================
ADVANCED MOLDING TECHNOLOGY
==========================================================
*/

[normalize("ADVANCEED MOLDING TECHNOLOGY PVT LTD")]:
  normalize("Advanced Molding Technology Private Limited"),

[normalize("ADVANCEED MOLDING TECHNOLOGY")]:
  normalize("Advanced Molding Technology Private Limited"),

/*
==========================================================
SAI RAM ISPAT
==========================================================
*/

[normalize("SAI RAM INSPAT")]:
  normalize("SAI RAM ISPAT"),

[normalize("SAI RAM ISPAT")]:
  normalize("SAI RAM ISPAT"),

/*
==========================================================
DHANLUXMI STEELS
==========================================================
*/

[normalize("DHANLLUXMI STEELS")]:
  normalize("DHANLUXMI STEELS"),

/*
==========================================================
BBF PACKAGING
==========================================================
*/

[normalize("BBF PACKAING PVT LTD")]:
  normalize("BBF PACKAGING PVT LTD"),

[normalize("BBF PACKAING")]:
  normalize("BBF PACKAGING PVT LTD"),

/*
==========================================================
AV INTERNATIONAL
==========================================================
*/

[normalize("AV INTERTNATIONAL")]:
  normalize("AV INTERNATIONAL"),

[normalize("AV INTERNATIONAL")]:
  normalize("AV INTERNATIONAL"),

/*
==========================================================
NEW MODEL INTERNATIONAL
==========================================================
*/

[normalize("NEW MODEL INTERNATIOANL")]:
  normalize("NEW MODEL INTERNATIONAL"),

/*
==========================================================
ABS WORLDWIDE
==========================================================
*/

[normalize("ABS WORLDWIDE PPRIVATE LIMITED")]:
  normalize("ABS WORLDWIDE PRIVATE LIMITED"),


  /*
==========================================================
PRAGATI FASTENERS
==========================================================
*/

[normalize("PRAGATI FASTENERS")]:
  normalize("PRAGATI FASTENERES"),

/*
==========================================================
KUBER CASTINGS
==========================================================
*/

[normalize("KUBER CASTINGS")]:
  normalize("KUBER CASTING PVT LTD"),

[normalize("KUBER CASTINGS PVT LTD")]:
  normalize("KUBER CASTING PVT LTD"),

/*
==========================================================
AGRIBOOST IMPLEMENTS
==========================================================
*/

[normalize("AGRIBOOST IMPLEMENTS")]:
  normalize("Agriboost Implements (P) Company"),

/*
==========================================================
ARORA IRON & STEEL ROLLING MILLS
==========================================================
*/

[normalize("ARORA IRON & STEEL ROLLING MILLS")]:
  normalize("ARORA IRON & STEEL ROLLING MILLS P.L."),

/*
==========================================================
KANIN INDUSTRIES
==========================================================
*/

[normalize("KANIN INDUSTRIES PVT LTD DORAHA LUDHIANA")]:
  normalize("Kanin Industries Pvt . Ltd,"),

[normalize("KANIN INDUSTRIES PVT LTD")]:
  normalize("Kanin Industries Pvt . Ltd,"),

/*
==========================================================
SIMER WORLDWIDE CARGO
==========================================================
*/

[normalize("SIMER WORLDWIDE CARGO LUDHIANA")]:
  normalize("Simer Worldwide Cargo Logistics"),

/*
==========================================================
NICE EXPORT
==========================================================
*/

[normalize("NICE EXPORT P LTD")]:
  normalize("NICE EXPORTS P.LTD."),

[normalize("NICE EXPORT P LTD.")]:
  normalize("NICE EXPORTS P.LTD."),

/*
==========================================================
ISSGF
==========================================================
*/

[normalize("ISSGF PRIVATE LIMITED")]:
  normalize("ISSGF INDIA PRIVATE LIMITED"),
};

async function migrateQuoteGST() {
  try {
    await connectDB();

    console.log("======================================");
    console.log(" Quote GST Migration");
    console.log("======================================\n");

    console.log("✅ Connected to MongoDB");

    /**
     * --------------------------------------------------------
     * Load Company Master once
     * --------------------------------------------------------
     */

    const companies = await CompanyGST.find().lean();

    const companyMap = new Map();

    for (const company of companies) {
      companyMap.set(normalize(company.name), company);
    }

    console.log(`📄 Company Master Loaded : ${companies.length}`);

    /**
     * --------------------------------------------------------
     * Load Quotes
     * --------------------------------------------------------
     */

    const quotes = await Quote.find().lean();

    console.log(`📄 Quotes Found          : ${quotes.length}\n`);

    let updated = 0;
    let alreadyHadGST = 0;
    let aliasMatched = 0;
    let noMatch = 0;
    let noGSTInMaster = 0;

    const unmatchedCompanies = new Map();

    for (const quote of quotes) {
      // Skip quotes already migrated
      if (quote.gstin) {
        alreadyHadGST++;
        continue;
      }

      let normalizedName = normalize(quote.company);

    const alias = COMPANY_ALIASES[normalizedName];

if (alias) {
  console.log(`🔄 Alias: ${quote.company} → ${alias}`);
  normalizedName = alias;
  aliasMatched++;
}

      const match = companyMap.get(normalizedName);

      if (!match) {
  noMatch++;

  if (!unmatchedCompanies.has(normalizedName)) {
    unmatchedCompanies.set(normalizedName, {
      originals: new Set(),
      quoteNos: [],
    });
  }

  const entry = unmatchedCompanies.get(normalizedName);

  entry.originals.add(quote.company);
  entry.quoteNos.push(quote.quoteNo);

  continue;
}
      if (!match.gstin) {
        noGSTInMaster++;
        continue;
      }

      /**
       * IMPORTANT
       *
       * Also replace the historical company name
       * with the canonical Company Master name.
       */

      await Quote.updateOne(
        {
          _id: quote._id,
        },
        {
          $set: {
            company: match.name,
            gstin: match.gstin,
          },
        }
      );

      updated++;

      console.log(
        `✅ ${quote.quoteNo} | ${quote.company} → ${match.name} | ${match.gstin}`
      );
    }

    /**
     * --------------------------------------------------------
     * Summary
     * --------------------------------------------------------
     */

    console.log("\n======================================");
    console.log(" Migration Completed");
    console.log("======================================");

    console.log("Quotes Checked      :", quotes.length);
    console.log("Updated             :", updated);
    console.log("Alias Matches       :", aliasMatched);
    console.log("Already Had GST     :", alreadyHadGST);
    console.log("No Company Match    :", noMatch);
    console.log("No GST In Master    :", noGSTInMaster);

    console.log("======================================");

    /**
     * --------------------------------------------------------
     * Unmatched Companies
     * --------------------------------------------------------
     */

    if (unmatchedCompanies.size) {
      console.log("\n============= UNMATCHED =============\n");

      for (const [normalized, data] of unmatchedCompanies.entries()) {
       console.log(`Normalized : ${normalized}`);
       console.log(`Originals  : ${[...data.originals].join(" | ")}`);
       console.log(`Quotes     : ${data.quoteNos.join(", ")}`);
       console.log("--------------------------------------");
     }
    }

  } catch (err) {
    console.error("\n❌ Migration Failed\n");
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

migrateQuoteGST();