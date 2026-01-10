import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import AuditDashboardClient from "./audit-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AuditDashboardPage() {
  await connectDB();

  // ✅ Fetch active jobs
  const activeJobs = await Job.find({ status: "active" })
    .select("_id jobId company shipmentType")
    .lean();

  // ✅ Fetch admins
  const admins = await User.find({ role: "admin" })
    .select("_id name email")
    .lean();

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Audit Logs</h1>
        <p className="text-gray-600 mt-1">
          Track operational activity across jobs and admins
        </p>
      </div>

      {/* CLIENT SIDE CONTROLLER */}
      <AuditDashboardClient
        jobs={JSON.parse(JSON.stringify(activeJobs))}
        admins={JSON.parse(JSON.stringify(admins))}
      />
    </div>
  );
}
