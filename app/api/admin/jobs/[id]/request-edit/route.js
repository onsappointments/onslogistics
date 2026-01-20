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

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    const { id } = params;

    // ✅ remarks from body
    const body = await req.json().catch(() => ({}));
    const remarks = (body?.remarks || "").trim();

    if (!remarks) {
      return Response.json({ error: "Remarks are required." }, { status: 400 });
    }

    const job = await Job.findById(id);
    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    // New jobs do NOT require request
    if (job.status === "new") {
      return Response.json({
        message: "No request needed. New jobs are always editable.",
      });
    }

    // ✅ prevent duplicate pending requests for same job
    if (job.editRequestedAt && job.editRequestedBy && !job.editApprovedAt && job.editUsed === false) {
      return Response.json(
        { error: "Request already pending approval." },
        { status: 409 }
      );
    }

    // Save request fields on Job
    job.editRequestedBy = user._id;
    job.editRequestedAt = new Date();
    job.editApprovedBy = null;
    job.editApprovedAt = null;
    job.editUsed = false;
    job.editRequestRemarks = remarks; // ✅ add this field in Job schema if not present
    await job.save();

    // ✅ find super admins
    const superAdmins = await User.find({
      role: "admin",
      adminType: "super_admin",
    }).select("_id email fullName");

    const superAdminIds = superAdmins.map((a) => a._id);

    if (superAdminIds.length) {
      await Notification.create({
        type: "JOB_EDIT_REQUEST",
        jobId: job._id,
        requestedBy: user._id,
        requestedByEmail: user.email,
        requestedByName: user.fullName || user.name || user.email,
        remarks,
        message: `Edit request for Job ${job.jobId || job._id}. Remarks: ${remarks}`,
        recipients: superAdminIds,
        status: "pending",
      });
    }

    return Response.json({
      success: true,
      message: "Request submitted. Super Admin notified.",
    });
  } catch (error) {
    console.error("JOB REQUEST EDIT ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
