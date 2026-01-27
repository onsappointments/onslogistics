"use server";

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
