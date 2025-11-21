import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(req) {
  await connectDB();

  const { id } = await req.json();

  const updated = await Quote.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true }
  );

  return Response.json({
    success: true,
    message: "Quote approved successfully",
    quote: updated,
  });
}
