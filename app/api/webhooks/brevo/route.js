export const runtime = "nodejs";

import { NextResponse } from "next/server";


export async function POST(req) {
  try {

    const payload = await req.json();


    console.log("========== BREVO WEBHOOK ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("===================================");


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    console.error("Brevo webhook error:", error);


    return NextResponse.json(
      {
        error: "Webhook failed",
      },
      {
        status:500,
      }
    );
  }
}