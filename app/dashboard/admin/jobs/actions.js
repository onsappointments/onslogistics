"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import {redirect} from "next/navigation";

// INITIATE JOB → Moves to Active Jobs
export async function initiateJob(formData) {
  const id = formData.get("id");

  await connectDB();
  await Job.findByIdAndUpdate(id, {
    status: "active",
    stage: "Documentation",
  });
    redirect("/dashboard/admin/jobs/active");

  return { success: true };
}

// DELETE JOB
export async function deleteJob(formData) {
  const id = formData.get("id");

  await connectDB();
  await Job.findByIdAndDelete(id);

  return { success: true };
}




export async function completeJob(formData) {
  const id = formData.get("id");

  if (!id) throw new Error("Job ID is required");

  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await connectDB();

  const job = await Job.findById(id);

  if (!job) throw new Error("Job not found");

  if (job.status !== "active") {
    throw new Error("Only active jobs can be marked as completed");
  }

  job.status = "completed";
  job.stage = "Completed";

  job.auditLogs.push({
    action: "job_completed",
    performedBy: session.user.email ?? session.user.name ?? "admin",
    metadata: { previousStatus: "active" },
  });

  await job.save();

  revalidatePath(`/dashboard/admin/jobs/${id}`);
  revalidatePath("/dashboard/admin/jobs/active");

  redirect(`/dashboard/admin/jobs/${id}`);
}