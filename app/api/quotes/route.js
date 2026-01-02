import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";


export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    const { firstName, email, item, captchaToken } = data;

    // ✅ Basic validation
    if (!firstName || !email || !item) {
      return NextResponse.json(
        {
          success: false,
          error: "firstName, email & item are required.",
        },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Captcha verification is required.",
        },
        { status: 400 }
      );
    }

    // ✅ Verify captcha with Google
    const captchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        }),
      }
    );

    const captchaResult = await captchaResponse.json();

    if (!captchaResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Captcha verification failed.",
        },
        { status: 403 }
      );
    }

    delete data.captchaToken;

    // ✅ Save the quote in MongoDB
    const createdQuote = await Quote.create(data);

    return NextResponse.json(
      {
        success: true,
        quote: createdQuote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 }
    );
  }
}