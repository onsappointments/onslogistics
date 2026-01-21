import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // mode=companies (debounced typing suggestions) OR mode=jobs (fetch jobs by company)
    const mode = (searchParams.get("mode") || "companies").trim();

    // for suggestions
    const q = (searchParams.get("q") || "").trim();

    // for jobs fetch
    const company = (searchParams.get("company") || "").trim();

    await connectDB();

    if (mode === "companies") {
      if (!q) {
        return new Response(JSON.stringify({ companies: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
const companies = await Job.aggregate([
  // only non-empty companies
  { $match: { company: { $nin: ["", null] } } },

  // trim + lowercase key for uniqueness
  { $addFields: { companyTrimmed: { $trim: { input: "$company" } } } },
  { $addFields: { companyKey: { $toLower: "$companyTrimmed" } } },

  // ✅ IMPORTANT: prefix match (starts with)
  {
    $match: {
      companyTrimmed: {
        $regex: `^${escapeRegex(q)}`, // <-- "on" matches only starting with "on"
        $options: "i",
      },
    },
  },

  { $group: { _id: "$companyKey", name: { $first: "$companyTrimmed" } } },
  { $sort: { name: 1 } },
  { $limit: 20 },
  { $project: { _id: 0, name: 1 } },
]);


      return new Response(JSON.stringify({ companies }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (mode === "jobs") {
      if (!company) {
        return new Response(JSON.stringify({ jobs: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // case-insensitive exact match
      const jobs = await Job.find({
        company: { $regex: `^${escapeRegex(company)}$`, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .select(
          "jobId jobNumber company customerName shipper consignee portOfLoading portOfDischarge status stage createdAt"
        );

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

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
