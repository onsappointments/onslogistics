import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    await connectDB();

    const companies = await Quote.aggregate([
      /* 🔍 Search by company name */
      {
        $match: {
          company: { $regex: query, $options: "i" },
        },
      },

      /* 🔗 Quotes → Jobs */
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "quoteId",
          as: "jobs",
        },
      },

      /* 🔗 Jobs → Documents */
      {
        $lookup: {
          from: "documents",
          localField: "jobs._id",
          foreignField: "jobId",
          as: "documents",
        },
      },

      /* 🏢 Group everything by company */
      {
        $group: {
          _id: "$company",
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          phoneCountryCode: { $first: "$phoneCountryCode" },
          quotes: { $push: "$$ROOT" },
          allJobs: { $push: "$jobs" },
          allDocuments: { $push: "$documents" },
        },
      },

      /* 🧹 Flatten arrays */
      {
        $project: {
          _id: 0,
          company: "$_id",
          email: 1,
          phone: 1,
          phoneCountryCode: 1,
          quotes: 1,
          jobs: {
            $reduce: {
              input: "$allJobs",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
          documents: {
            $reduce: {
              input: "$allDocuments",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
    ]);

    return new Response(JSON.stringify(companies), { status: 200 });
  } catch (err) {
    console.error("Company search error:", err);
    return new Response("Server error", { status: 500 });
  }
}
