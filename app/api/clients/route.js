import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    await connectDB();

    const clients = await User.find({
      role: "client",
      businessName: { $regex: query || "", $options: "i" },
    }).select("-password"); // hide passwords

    return new Response(JSON.stringify(companies), { status: 200 });
  } catch (err) {
    console.error("Company search error:", err);
    return new Response("Server error", { status: 500 });
  }
}
