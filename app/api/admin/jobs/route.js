import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "new";
  const shipmentType = searchParams.get("shipmentType");

  const pipeline = [
    { $match: { status } },
    {
      $lookup: {
        from: "quotes", // Replace with your actual Quote collection name
        localField: "quoteId",
        foreignField: "_id",
        as: "quoteId"
      }
    },
    { $unwind: { path: "$quoteId", preserveNullAndEmptyArrays: true } }
  ];

  // Add shipmentType filter if provided
  if (shipmentType) {
    pipeline.push({
      $match: { "quoteId.shipmentType": shipmentType }
    });
  }

  // Add sorting
  pipeline.push({ $sort: { createdAt: -1 } });

  pipeline.push({
    $project: {
      company: 1,
      jobId: 1,
      status: 1,
      createdAt: 1,
      clientQuoteId: 1,
      "quoteId.shipmentType": 1,
      "quoteId.toCity": 1,
      "quoteId.fromCity": 1,
    }
  });

  const jobs = await Job.aggregate(pipeline);

  return Response.json({ jobs });
}