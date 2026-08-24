import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import ResourceComment from "@/models/ResourceComment";
import sendClientEmail from "@/lib/sendClientEmail";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      articleSlug,
      articleTitle,
      name,
      email,
      mobile,
      question,
    } = body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!articleSlug || typeof articleSlug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Article information is required.",
        },
        { status: 400 }
      );
    }

    if (!articleTitle || typeof articleTitle !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Article title is required.",
        },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // EMAIL OR MOBILE
    // ==========================================

    const cleanEmail =
      typeof email === "string" ? email.trim() : "";

    const cleanMobile =
      typeof mobile === "string" ? mobile.trim() : "";

    if (!cleanEmail && !cleanMobile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide either an email address or mobile number.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // EMAIL FORMAT
    // ==========================================

    if (cleanEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please enter a valid email address.",
          },
          { status: 400 }
        );
      }
    }

    // ==========================================
    // QUESTION
    // ==========================================

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid question.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // CREATE QUESTION
    // ==========================================

    const comment = await ResourceComment.create({
      articleSlug: articleSlug.trim(),
      articleTitle: articleTitle.trim(),

      name: name.trim(),

      email: cleanEmail || null,
      mobile: cleanMobile || null,

      question: question.trim(),

      status: "pending",
    });
     
    // ==========================================
// NOTIFY ONS LOGISTICS
// ==========================================

try {
  const notificationEmail = "onsappointments@gmail.com";

  if (notificationEmail) {
    await sendClientEmail({
      to: notificationEmail,

      subject: `New Resource Question — ${articleTitle.trim()}`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #1f2937;">

          <div style="padding: 24px 0; border-bottom: 1px solid #e5e7eb;">
            <h2 style="margin: 0; font-size: 22px; color: #111827;">
              New Resource Question
            </h2>

            <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">
              A visitor has submitted a question through the ONS Logistics Resources Hub.
            </p>
          </div>

          <div style="padding: 24px 0;">

            <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #2563eb;">
              Article
            </p>

            <p style="margin: 0 0 24px; font-size: 17px; font-weight: 600;">
              ${articleTitle.trim()}
            </p>

            <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280;">
              Question
            </p>

            <div style="padding: 16px; background: #f3f4f6; border-radius: 10px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6;">
                ${question.trim()}
              </p>
            </div>

            <p style="margin: 0 0 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280;">
              Visitor Details
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 7px 0; color: #6b7280; width: 120px;">
                  Name
                </td>
                <td style="padding: 7px 0; font-weight: 600;">
                  ${name.trim()}
                </td>
              </tr>

              <tr>
                <td style="padding: 7px 0; color: #6b7280;">
                  Email
                </td>
                <td style="padding: 7px 0;">
                  ${cleanEmail || "Not provided"}
                </td>
              </tr>

              <tr>
                <td style="padding: 7px 0; color: #6b7280;">
                  Mobile
                </td>
                <td style="padding: 7px 0;">
                  ${cleanMobile || "Not provided"}
                </td>
              </tr>
            </table>

          </div>

          <div style="padding: 18px 0; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              ONS Logistics India — Resources Hub
            </p>
          </div>

        </div>
      `,
    });
  }
} catch (emailError) {
  console.error(
    "RESOURCE QUESTION EMAIL NOTIFICATION FAILED:",
    emailError
  );
}

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Your question has been submitted successfully.",
        commentId: comment._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "RESOURCE COMMENT POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while submitting your question.",
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const articleSlug = searchParams.get("articleSlug");

    if (!articleSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Article slug is required.",
        },
        { status: 400 }
      );
    }

    const comments = await ResourceComment.find({
      articleSlug: articleSlug.trim(),
    })
      .select(
        "name question answer isAnswered answeredAt createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(
      "RESOURCE COMMENT GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while loading questions.",
      },
      { status: 500 }
    );
  }
}