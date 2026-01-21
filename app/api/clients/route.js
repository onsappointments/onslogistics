import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("company") || "").trim();

    await connectDB();

    const filter = query
      ? { company: { $regex: query, $options: "i" } }
      : {};

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .select(
        "jobId jobNumber company customerName shipper consignee portOfLoading portOfDischarge status stage createdAt"
      );

    return new Response(JSON.stringify({ jobs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Job search error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
