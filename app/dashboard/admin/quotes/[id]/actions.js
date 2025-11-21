"use server";

import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { redirect } from "next/navigation";

export async function updateQuote(formData) {
  await connectDB();

  const id = formData.get("id");

  const updateData = Object.fromEntries(formData);

  delete updateData.id; // remove id from update set

  await Quote.findByIdAndUpdate(id, updateData);

  redirect(`/dashboard/admin/quotes/${id}`);
}

export async function deleteQuoteAction(id) {
  await connectDB();

  await Quote.findByIdAndDelete(id);

  redirect("/dashboard/admin/quotes");
}

export async function approveQuoteAction(id) {
  await connectDB();

  await Quote.findByIdAndUpdate(id, { status: "approved" });

  redirect(`/dashboard/admin/quotes/${id}`);
}
