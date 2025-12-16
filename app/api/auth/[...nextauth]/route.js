import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export async function GET(req, ctx) {
  return handler(req, ctx);
}

export async function POST(req, ctx) {
  return handler(req, ctx);
}
