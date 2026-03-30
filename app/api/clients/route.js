import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import escapeRegex from "@/lib/escapeRegex";

// ── FUZZY HELPERS ─────────────────────────────────────────────
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/\b(pvt|ltd|private|limited|llp|inc|corp|co)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function similarity(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;

  const dp = Array.from({ length: na.length + 1 }, (_, i) =>
    Array.from({ length: nb.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );

  for (let i = 1; i <= na.length; i++)
    for (let j = 1; j <= nb.length; j++)
      dp[i][j] =
        na[i - 1] === nb[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);

  return 1 - dp[na.length][nb.length] / Math.max(na.length, nb.length);
}
// ── END FUZZY HELPERS ─────────────────────────────────────────

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") || "companies").trim();
    const q = (searchParams.get("q") || "").trim();
    const company = (searchParams.get("company") || "").trim();

    await connectDB();

    // ── MODE: COMPANIES ───────────────────────────────────────
    if (mode === "companies") {
      if (!q) {
        return new Response(JSON.stringify({ companies: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 1. Fetch all distinct company names that loosely match the query
      const raw = await Job.distinct("company", {
        company: {
          $nin: ["", null],
          $regex: escapeRegex(q),
          $options: "i",
        },
      });

      // 2. Fuzzy group in JS — merge similar names into one canonical name
      const groups = [];
      const visited = new Set();

      for (let i = 0; i < raw.length; i++) {
        if (visited.has(i)) continue;
        let canonical = raw[i];

        for (let j = i + 1; j < raw.length; j++) {
          if (visited.has(j)) continue;
          if (similarity(raw[i], raw[j]) >= 0.82) {
            visited.add(j);
            // Keep the shorter cleaner name as the display name
            if (normalize(raw[j]).length < normalize(canonical).length) {
              canonical = raw[j];
            }
          }
        }

        visited.add(i);
        groups.push({ name: canonical });
      }

      // 3. Sort alphabetically and limit to 20
      groups.sort((a, b) => a.name.localeCompare(b.name));

      return new Response(
        JSON.stringify({ companies: groups.slice(0, 20) }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ── MODE: JOBS ────────────────────────────────────────────
    if (mode === "jobs") {
      if (!company) {
        return new Response(JSON.stringify({ jobs: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Step 1 — broad regex using first 4 chars to cast wide net
      // against raw DB string (not normalized)
      const broadMatch = company.slice(0, 4);

      const allJobs = await Job.find({
        company: {
          $nin: ["", null],
          $regex: escapeRegex(broadMatch),
          $options: "i",
        },
      })
        .sort({ createdAt: -1 })
        .select(
          "jobId jobNumber company gstin customerName shipper consignee portOfLoading portOfDischarge status stage createdAt"
        )
        .lean();

      // Step 2 — find the GSTIN from the first fuzzy match
      const matchedJob = allJobs.find(
        (job) => similarity(job.company, company) >= 0.75
      );
      const gstin = matchedJob?.gstin;

      let jobs;

      if (gstin) {
        // Step 3a — GSTIN exists → fetch ALL jobs with same GSTIN
        // most reliable grouping — catches all spelling variations
        jobs = await Job.find({ gstin })
          .sort({ createdAt: -1 })
          .select(
            "jobId jobNumber company gstin customerName shipper consignee portOfLoading portOfDischarge status stage createdAt"
          )
          .lean();
      } else {
        // Step 3b — No GSTIN → fall back to fuzzy name matching
        // catches existing bad data that has no gstin field yet
        jobs = allJobs.filter(
          (job) => similarity(job.company, company) >= 0.75
        );
      }

      return new Response(JSON.stringify({ jobs }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid mode" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Clients route error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}