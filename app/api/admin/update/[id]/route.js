import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, email, password, adminType, permissions, personalEmail } = body;

    // ❌ Basic validation
    if (!fullName || !email || !adminType) {
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

    // ❌ Check if admin exists
    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    // ❌ Check if admin has role 'admin'
    if (admin.role !== "admin") {
      return NextResponse.json(
        { message: "User is not an admin" },
        { status: 403 }
      );
    }

    // ❌ Check if email is being changed and already exists
    if (email !== admin.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409 }
        );
      }
    }

    admin.fullName = fullName;
    admin.email = email;
    admin.personalEmail = personalEmail;
    admin.adminType = adminType;
    admin.permissions = permissions;

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    return NextResponse.json(
      {
        message: "Admin updated successfully",
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          personalEmail: admin.personalEmail,
          adminType: admin.adminType,
          permissions: admin.permissions,
          phone: admin.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE ADMIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}