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

    // 🔐 Current user (must be super admin)
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || currentUser.adminType !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can approve edit requests" },
        { status: 403 }
      );
    }

    // 🔎 Find technical quote
    const quote = await TechnicalQuote.findOne({
      clientQuoteId: new mongoose.Types.ObjectId(clientQuoteId),
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Technical quote not found" },
        { status: 404 }
      );
    }

    /* --------------------------------------------------
       🔒 VALIDATIONS (ORDER MATTERS)
    --------------------------------------------------- */

    // 1️⃣ Quote already locked
    if (quote.isLocked === true) {
      return NextResponse.json(
        { error: "This quote is locked and cannot be edited." },
        { status: 423 }
      );
    }

    // 2️⃣ No request to approve
    if (!quote.editRequestedBy) {
      return NextResponse.json(
        { error: "No edit request found for this quote." },
        { status: 400 }
      );
    }

    // 3️⃣ Already approved for someone and not yet used
    if (quote.editApprovedBy && quote.editUsed === false) {
      return NextResponse.json(
        {
          error:
            "Edit access has already been approved for another user.",
        },
        { status: 409 }
      );
    }

    /* --------------------------------------------------
       ✅ APPROVE REQUEST
    --------------------------------------------------- */

    const requestedUserId = quote.editRequestedBy;
    const requestedUser = await User.findById(requestedUserId);

    quote.editApprovedBy = requestedUserId; // approved FOR requester
    quote.editApprovedAt = new Date();
    quote.editRequestedBy = null;
    quote.editRequestedAt = null;
    quote.editUsed = false;
    quote.isLocked = false; // 🔓 unlock for editing

    await quote.save();

    /* --------------------------------------------------
       🔔 UPDATE EXISTING REQUEST NOTIFICATIONS
    --------------------------------------------------- */

    await Notification.updateMany(
      {
        quoteId: quote._id,
        type: "EDIT_REQUEST",
        status: "pending",
      },
      { status: "approved" }
    );

    /* --------------------------------------------------
       🔔 NOTIFY REQUESTED USER
    --------------------------------------------------- */

    if (requestedUser) {
      const approverName =
        currentUser.fullName ||
        currentUser.name ||
        currentUser.email ||
        "Super Admin";

      await Notification.create({
        type: "EDIT_APPROVED",
        quoteId: quote._id,
        requestedBy: requestedUserId,
        requestedByEmail: requestedUser.email,
        requestedByName:
          requestedUser.fullName ||
          requestedUser.name ||
          requestedUser.email,
        message: `Your edit request has been approved by ${approverName}. You now have one-time edit access.`,
        recipients: [requestedUserId],
        status: "pending",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Edit access approved successfully.",
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
