import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    await connectDB();

    const clients = await User.find({
      role: "client",
      businessName: { $regex: query || "", $options: "i" },
    }).select("-password"); // hide passwords

    return new Response(JSON.stringify(clients), { status: 200 });
  } catch (err) {
    console.error("Error fetching clients:", err);
    return new Response("Server error", { status: 500 });
  }
}
