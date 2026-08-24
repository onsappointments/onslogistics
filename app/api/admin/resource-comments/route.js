import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import ResourceComment from "@/models/ResourceComment";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await connectDB();

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // FIND CURRENT USER
    // ==========================================

    const currentUser = await User.findOne({
      email: session.user.email,
    }).lean();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // AUTHORIZATION
    // ==========================================

    const isAuthorized =
      currentUser.adminType === "super_admin" ||
      currentUser.adminType === "manager";

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to view resource questions.",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // FETCH QUESTIONS
    // ==========================================

    const comments = await ResourceComment.find({})
      .sort({
        isAnswered: 1,
        createdAt: -1,
      })
      .lean();

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(
      "ADMIN RESOURCE COMMENTS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load resource questions.",
      },
      { status: 500 }
    );
  }
}