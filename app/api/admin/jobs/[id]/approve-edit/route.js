import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const superAdmin = await User.findOne({ email: session.user.email });
    if (!superAdmin || superAdmin.adminType !== "super_admin") {
      return Response.json(
        { error: "Only super admin can approve." },
        { status: 403 }
      );
    }

    const { id } = params;
    const job = await Job.findById(id);

    if (!job) return Response.json({ error: "Job not found" }, { status: 404 });

    if (!job.editRequestedBy) {
      return Response.json({ error: "No pending edit request." }, { status: 400 });
    }

    if (job.editApprovedAt && job.editUsed === false) {
      return Response.json({ error: "Edit already approved." }, { status: 409 });
    }

    // approve
    job.editApprovedBy = superAdmin._id; // ✅ approver
    job.editApprovedAt = new Date();
    job.editUsed = false;
    await job.save();

    // requester user
    const requester = await User.findById(job.editRequestedBy).select("_id email fullName");

    // mark request notification approved (optional)
    await Notification.updateMany(
      { type: "JOB_EDIT_REQUEST", jobId: job._id, status: "pending" },
      { $set: { status: "approved" } }
    );

    // notify requester
    if (requester) {
      await Notification.create({
        type: "JOB_EDIT_APPROVED",
        jobId: job._id,
        requestedBy: superAdmin._id,
        requestedByEmail: superAdmin.email,
        requestedByName: superAdmin.fullName || superAdmin.email,
        message: `Your edit request for Job ${job.jobId || job._id} has been approved. You can edit once now.`,
        recipients: [requester._id],
        status: "approved",
      });
    }

    return Response.json({ success: true, message: "Edit approved." });
  } catch (error) {
    console.error("JOB APPROVE EDIT ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
