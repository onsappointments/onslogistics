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
    const clientQuoteId = params.id; // correct

    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || currentUser.adminType !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can approve edit requests" },
        { status: 403 }
      );
    }

    // Find technical quote using clientQuoteId
    const quote = await TechnicalQuote.findOne({
      clientQuoteId: new mongoose.Types.ObjectId(clientQuoteId),
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Technical quote not found" },
        { status: 404 }
      );
    }

    if (!quote.editRequestedBy) {
      return NextResponse.json(
        { error: "No edit request found for this quote" },
        { status: 400 }
      );
    }

    if (quote.editApprovedBy && quote.editUsed === false) {
      return NextResponse.json(
        { error: "Edit access already granted and not used yet" },
        { status: 400 }
      );
    }

    const requestedUserId = quote.editRequestedBy;
    const requestedUser = await User.findById(requestedUserId);

    // APPROVE REQUEST
    quote.editApprovedBy = requestedUserId; // requester gets access, NOT super admin
    quote.editApprovedAt = new Date();
    quote.editRequestedBy = null;
    quote.editRequestedAt = null;
    quote.editUsed = false;

    await quote.save();

    // Mark pending notifications as approved
    await Notification.updateMany(
      { quoteId: quote._id, type: "EDIT_REQUEST", status: "pending" },
      { status: "approved" }
    );

    // Notify requester
    if (requestedUser) {
      const approverName =
        currentUser.fullName || currentUser.name || "Super Admin";

      await Notification.create({
        type: "EDIT_APPROVED",
        quoteId: quote._id,
        requestedBy: requestedUserId,
        requestedByEmail: requestedUser.email,
        requestedByName:
          requestedUser.fullName || requestedUser.name || "User",
        message: `Your edit request has been approved by ${approverName}. You now have one-time edit access.`,
        recipients: [requestedUserId],
        status: "pending",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Edit access approved successfully",
      approvedForUserId: requestedUserId,
    });
  } catch (error) {
    console.error("❌ Error approving edit request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
