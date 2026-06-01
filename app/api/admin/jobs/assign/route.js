import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import sendClientEmail from "@/lib/sendClientEmail";
import { jobAssignedTemplate } from "@/lib/notifications/jobAssignedTemplate";

export async function POST(req) {
  await connectDB();

  const { jobId, userId, userName } = await req.json();

  const job = await Job.findByIdAndUpdate(
    jobId,
    {
      assignedTo: userId,
      assignedToName: userName,
      assignedAt: new Date(),
    },
    { new: true }
  );
  const assignedUser =
  await User.findById(userId);

if (assignedUser?.email) {

  try {

    await sendClientEmail({
      to: assignedUser.personalEmail,
      subject: `Job Assigned - ${job.jobNumber}`,
      html: jobAssignedTemplate(job)
    });

  } catch (error) {

    console.error(
      "ASSIGNMENT EMAIL FAILED",
      error
    );

  }

}

  return Response.json(job);
}