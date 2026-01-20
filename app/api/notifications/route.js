// app/api/notifications/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch notifications where user is a recipient
    const notifications = await Notification.find({
      recipients: currentUser._id,
    })
      .populate("requestedBy", "name email")
      .populate({
        path: "quoteId",
        model: "TechnicalQuote",
        populate: {
          path: "clientQuoteId",
          model: "Quote",
        },
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // Convert to plain JS objects

    // Count unread notifications
    const unreadCount = notifications.filter(
      (notif) =>
        !notif.readBy?.some(
          (read) => read.userId.toString() === currentUser._id.toString()
        )
    ).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const alreadyRead = notification.readBy.some(
      (read) => read.userId.toString() === currentUser._id.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({
        userId: currentUser._id,
        readAt: new Date(),
      });
      await notification.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
