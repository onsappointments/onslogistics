import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, password, adminType, permissions } = body;

    // ❌ Basic validation
    if (!fullName || !email || !password || !adminType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (permissions.length === 0) {
        return NextResponse.json(
          { message: "At least one permission must be assigned" },
          { status: 400 }
        );
    }

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { message: "Permissions must be an array" },
        { status: 400 }
      );
    }

    await connectDB();

    // ❌ Email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create admin with permissions
    const newAdmin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
      adminType,
      permissions, // 👈 IMPORTANT
    });

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          fullName: newAdmin.fullName,
          email: newAdmin.email,
          adminType: newAdmin.adminType,
          permissions: newAdmin.permissions,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
