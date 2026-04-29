import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "new";
  const shipmentType = searchParams.get("shipmentType");
  const session = await getServerSession(authOptions);

  if (!session) {
     return Response.json({ error: "Unauthorized" }, { status: 401 });
   }

   const currentUser = await User.findOne({ email: session.user.email }).lean();
   const isSuperAdmin = currentUser?.adminType === "super_admin";

  const pipeline = [
    {
      $match: {
        status,
        ...(isSuperAdmin
          ? {}
          : { assignedTo: new mongoose.Types.ObjectId(currentUser._id) }),
      },
    },
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