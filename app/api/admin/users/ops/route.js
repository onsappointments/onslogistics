import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const users = await User.find({
    role: "admin",
  })
    .select("_id fullName email") // ✅ FIXED
    .lean();

  return Response.json(users);
}