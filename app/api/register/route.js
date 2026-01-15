import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { fullName, businessName, businessContact, email, country, password } =
      await req.json();

      if (!fullName || !email || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Missing required fields",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

    await connectDB();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists. Please login instead.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = await User.create({
      fullName,
      businessName,
      businessContact,
      email,
      country,
      password: hashedPassword,
    });

    // ✅ Return success response (don’t leak password)
    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully!",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          country: newUser.country,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message || "Internal Server Error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
