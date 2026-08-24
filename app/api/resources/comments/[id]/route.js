import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import ResourceComment from "@/models/ResourceComment";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req, { params }) {
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
    // ONS AUTHORIZATION
    // ==========================================

    const isAuthorized =
      currentUser.adminType === "super_admin" ||
      currentUser.adminType === "manager";

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to answer questions.",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // COMMENT ID
    // ==========================================

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid question ID.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // REQUEST BODY
    // ==========================================

    const body = await req.json();

    const answer =
      typeof body.answer === "string"
        ? body.answer.trim()
        : "";

    if (!answer) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter an answer.",
        },
        { status: 400 }
      );
    }

    if (answer.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Answer is too short.",
        },
        { status: 400 }
      );
    }

    if (answer.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Answer is too long.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // FIND QUESTION
    // ==========================================

    const comment = await ResourceComment.findById(id);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found.",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // DON'T OVERWRITE EXISTING ANSWER
    // ==========================================

    if (comment.isAnswered && comment.answer) {
      return NextResponse.json(
        {
          success: false,
          message: "This question has already been answered.",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // SAVE ONS ANSWER
    // ==========================================

    comment.answer = answer;
    comment.isAnswered = true;
    comment.answeredAt = new Date();

    await comment.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "Answer submitted successfully.",
      comment: {
        _id: comment._id,
        answer: comment.answer,
        isAnswered: comment.isAnswered,
        answeredAt: comment.answeredAt,
      },
    });
  } catch (error) {
    console.error(
      "RESOURCE COMMENT ANSWER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit answer.",
      },
      { status: 500 }
    );
  }
}