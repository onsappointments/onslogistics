import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    console.log("SESSION:", session);

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    const { id } = params;
    const job = await Job.findById(id);

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    // New jobs are always editable
    if (job.status === "new") {
      return Response.json({ canEdit: true, reason: "new-job" });
    }

    const isSuperAdmin = user.adminType === "super_admin";

    // ✅ requester can edit once after approval
    const isApprovedRequester =
      job.editRequestedBy &&
      String(job.editRequestedBy) === String(user._id) &&
      job.editApprovedAt &&
      job.editUsed === false;

    if (isSuperAdmin || isApprovedRequester) {
      return Response.json({ canEdit: true, reason: "approved" });
    }

    // pending request exists
    if (job.editRequestedBy && !job.editApprovedAt) {
      const requestedByYou = String(job.editRequestedBy) === String(user._id);

      return Response.json({
        canEdit: false,
        reason: "pending_approval",
        requestedByYou,
      });
    }

    return Response.json({ canEdit: false, reason: "not-approved" });
  } catch (error) {
    console.error("JOB CHECK PERMISSION ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
