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
   const isAuthorized = currentUser?.adminType === "super_admin" || currentUser?.adminType === "manager";

  const pipeline = [
    {
      $match: {
        status,
        ...(isAuthorized
          ? {}
          : {
            $or: [
              { assignedTo: new mongoose.Types.ObjectId(currentUser._id) },
              { createdBy: new mongoose.Types.ObjectId(currentUser._id) }
            ]
          })
      }
    },
    {
      $lookup: {
        from: "quotes", 
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
    quoteId: {
      shipmentType: "$quoteId.shipmentType",
      fromCity: "$quoteId.fromCity",
      toCity: "$quoteId.toCity",
      company: "$quoteId.company",
    },

    company: 1,
    customerName: 1,

    jobId: 1,
    jobNumber: 1,

    bookingNumber: 1,
    invoiceNumber: 1,

    beNumber: 1,
    sbNumber: 1,

    mblNumber: 1,
    hblNumber: 1,
    awbNumber: 1,

    referenceNumber: 1,

    containerNumber: 1,
    containers: 1,

    status: 1,
    createdAt: 1,

    assignedTo: 1,
    shipmentType: 1,
    stage: 1,
    currentStage: 1
  }
});

  const jobs = await Job.aggregate(pipeline);

  return Response.json({ jobs });
}