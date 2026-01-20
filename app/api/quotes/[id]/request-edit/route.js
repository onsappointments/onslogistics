import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import TechnicalQuote from "@/models/TechnicalQuote";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const clientQuoteId = params.id;

    const quote = await TechnicalQuote.findOne({
      clientQuoteId: new mongoose.Types.ObjectId(clientQuoteId),
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Technical quote not found" },
        { status: 404 }
      );
    }

    // Current user
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can request edit access" },
        { status: 403 }
      );
    }

    if (currentUser.adminType === "super_admin") {
      return NextResponse.json(
        { error: "Super admins do not need edit approval" },
        { status: 400 }
      );
    }

    // VALIDATIONS
    if (quote.editRequestedBy && !quote.editApprovedBy) {
      return NextResponse.json(
        { error: "Edit request already pending approval" },
        { status: 400 }
      );
    }

    if (quote.editApprovedBy && quote.editUsed === false) {
      return NextResponse.json(
        { error: "Another user already has edit access (not used yet)" },
        { status: 400 }
      );
    }

    // CREATE NEW REQUEST
    quote.editRequestedBy = currentUser._id;
    quote.editRequestedAt = new Date();
    quote.editApprovedBy = null;
    quote.editApprovedAt = null;
    quote.editUsed = false;

    await quote.save();

    // FIND SUPER ADMINS
    const superAdmins = await User.find({
      role: "admin",
      adminType: "super_admin",
    });

    if (superAdmins.length === 0) {
      return NextResponse.json(
        { error: "No super admins available to approve request" },
        { status: 404 }
      );
    }

    const requestedByName =
      currentUser.fullName ||
      `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
      currentUser.name;

    // CREATE NOTIFICATION
    const notification = await Notification.create({
      type: "EDIT_REQUEST",
      quoteId: quote._id,
      requestedBy: currentUser._id,
      requestedByEmail: currentUser.email,
      requestedByName,
      message: `${requestedByName} (${currentUser.email}) requested edit access for technical quote ${clientQuoteId}`,
      recipients: superAdmins.map((admin) => admin._id),
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: `Edit request sent to ${superAdmins.length} super admin(s)`,
      notificationId: notification._id,
    });

  } catch (error) {
    console.error("❌ Error processing edit request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
