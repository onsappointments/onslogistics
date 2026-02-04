import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const clientQuoteId = new mongoose.Types.ObjectId(params.id);

    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 👑 Super admin → always allowed
    if (currentUser.adminType === "super_admin") {
      return NextResponse.json({
        canEdit: true,
        reason: "super_admin",
      });
    }

    const quote = await TechnicalQuote.findOne({ clientQuoteId });

    if (!quote) {
      return NextResponse.json(
        { error: "Technical quote not found" },
        { status: 404 }
      );
    }

    // 🔒 Locked → nobody edits
    if (quote.isLocked === true) {
      return NextResponse.json({
        canEdit: false,
        reason: "locked",
        message: "This quote is locked.",
      });
    }

    // ✅ Approved user (one-time)
    if (
      quote.editApprovedBy &&
      quote.editApprovedBy.toString() === currentUser._id.toString() &&
      quote.editUsed === false
    ) {
      return NextResponse.json({
        canEdit: true,
        reason: "approved_access",
        message: "You have approved edit access.",
      });
    }

    // 🚫 Approved for someone else
    if (quote.editApprovedBy && quote.editUsed === false) {
      return NextResponse.json({
        canEdit: false,
        reason: "approved_for_other",
        message:
          "This quote has already been approved for another user.",
      });
    }

    // ⏳ Request pending by this user
    if (
      quote.editRequestedBy &&
      quote.editRequestedBy.toString() === currentUser._id.toString()
    ) {
      return NextResponse.json({
        canEdit: false,
        reason: "pending_approval",
        message: "Your edit request is pending approval.",
      });
    }

    // ❌ Default → can request
    return NextResponse.json({
      canEdit: false,
      reason: "no_permission",
      message: "You need to request edit access.",
    });
  } catch (error) {
    console.error("❌ Error checking permission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
