import { Response } from "next/server";
import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import Quote from "@/models/Quote";
import User from "@/models/User";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import {
  IMPORT_HEADS,
  EXPORT_HEADS,
} from "@/constants/expenditureHeads";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quoteId, shipmentType, lineItems = [] } = await req.json();

    /* ---------------- BASIC VALIDATION ---------------- */

    if (!quoteId || !shipmentType) {
      return Response.json(
        { error: "quoteId and shipmentType are required" },
        { status: 400 }
      );
    }

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return Response.json({ error: "Quote not found" }, { status: 404 });
    }

    /* ---------------- PERMISSION CHECK ---------------- */

    let currentUser = null;
    let isSuperAdmin = false;

    if (session?.user?.email) {
      currentUser = await User.findOne({ email: session.user.email });
      isSuperAdmin = currentUser?.adminType === "super_admin";
    }

    // Fetch existing technical quote (if any)
    const existingTechQuote = await TechnicalQuote.findOne({
      clientQuoteId: quoteId,
    });

    /* ---------------- CASE 1: NO TECH QUOTE EXISTS → ALLOW ANY ADMIN ---------------- */
    if (!existingTechQuote) {
      console.log("🆕 No technical quote exists → ANY admin can create.");
    }

    /* ---------------- CASE 2: TECH QUOTE EXISTS → APPLY PERMISSION RULES ---------------- */
    else {
      // SUPER ADMIN CAN ALWAYS EDIT
      if (!isSuperAdmin) {
        const hasOneTimeAccess =
          existingTechQuote.editApprovedBy &&
          existingTechQuote.editApprovedBy.toString() === currentUser._id.toString() &&
          existingTechQuote.editUsed === false;

        if (!hasOneTimeAccess) {
          return Response.json(
            {
              error: "You don't have permission to edit this quote. Request edit access.",
              needsApproval: true,
              technicalQuoteId: existingTechQuote._id,
            },
            { status: 403 }
          );
        }

        console.log("🔓 Regular admin has one-time edit access.");
      }
    }

    /* ---------------- VALIDATE EXPENDITURE HEADS ---------------- */

    const ALLOWED_HEADS =
      shipmentType === "import" ? IMPORT_HEADS : EXPORT_HEADS;

    const invalidHead = lineItems.find(
      (item) => !ALLOWED_HEADS.includes(item.head)
    );

    if (invalidHead) {
      return Response.json(
        {
          error: "Invalid expenditure head",
          invalidHead: invalidHead.head,
          allowed: ALLOWED_HEADS,
        },
        { status: 400 }
      );
    }

    /* ---------------- NORMALIZE LINE ITEMS ---------------- */

    const normalizedLineItems = lineItems.map((item) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const exchangeRate = Number(item.exchangeRate || 1);
      const currency = item.currency || "INR";

      const baseAmount = rate * quantity * exchangeRate;

      const igstPercent = Number(item.igstPercent || 0);
      const cgstPercent = Number(item.cgstPercent || 0);
      const sgstPercent = Number(item.sgstPercent || 0);

      const igstAmount = baseAmount * (igstPercent / 100);
      const cgstAmount = baseAmount * (cgstPercent / 100);
      const sgstAmount = baseAmount * (sgstPercent / 100);

      const totalAmount = baseAmount + igstAmount + cgstAmount + sgstAmount;

      return {
        head: item.head,
        quantity,
        rate,
        currency,
        exchangeRate,
        baseAmount,
        igstPercent,
        igstAmount,
        cgstPercent,
        cgstAmount,
        sgstPercent,
        sgstAmount,
        totalAmount,
      };
    });

    /* ---------------- CURRENCY SUMMARY ---------------- */

    const currencySummary = normalizedLineItems.reduce((acc, item) => {
      const curr = item.currency;

      if (!acc[curr]) {
        acc[curr] = {
          currency: curr,
          services: [],
          subtotal: 0,
          exchangeRate: item.exchangeRate || 1,
          inrEquivalent: 0,
        };
      }

      acc[curr].services.push({
        head: item.head,
        quantity: item.quantity,
        amount: item.rate * item.quantity,
        inrAmount: item.totalAmount,
      });

      acc[curr].subtotal += item.rate * item.quantity;
      acc[curr].inrEquivalent += item.totalAmount;

      return acc;
    }, {});

    /* ---------------- GRAND TOTAL (INR) ---------------- */

    const grandTotalINR = Object.values(currencySummary).reduce(
      (sum, curr) => sum + curr.inrEquivalent,
      0
    );

    /* ---------------- PREPARE UPDATE DATA ---------------- */

    const updateData = {
      clientQuoteId: quoteId,
      shipmentType,
      lineItems: normalizedLineItems,
      currencySummary,
      grandTotalINR,
      status: "draft",
    };

    /* ---------------- APPLY ONE-TIME EDIT LOCK ---------------- */

    if (existingTechQuote && currentUser && !isSuperAdmin) {
      const hadApprovedAccess =
        existingTechQuote.editApprovedBy &&
        existingTechQuote.editApprovedBy.toString() === currentUser._id.toString() &&
        existingTechQuote.editUsed === false;

      if (hadApprovedAccess) {
        updateData.editUsed = true;
        updateData.editApprovedBy = null;
        updateData.editApprovedAt = null;

        console.log("🔒 One-time edit used → Quote locked again.");
      }
    }

    /* ---------------- UPSERT (CREATE OR UPDATE) ---------------- */

    const techQuote = await TechnicalQuote.findOneAndUpdate(
      { clientQuoteId: quoteId },
      { $set: updateData },
      { upsert: true, new: true }
    );

    /* ---------------- AUDIT LOG ---------------- */

    if (!existingTechQuote) {
      await logAudit({
        entityType: "technical_quote",
        entityId: techQuote._id,
        action: "created",
        description: "Technical quote created",
        performedBy: currentUser?._id,
        meta: { quoteId, shipmentType },
      });
    } else {
      await logAudit({
        entityType: "technical_quote",
        entityId: techQuote._id,
        action: "saved_draft",
        description: "Technical quote saved as draft",
        performedBy: currentUser?._id,
        meta: {
          quoteId,
          updatedLineItems: normalizedLineItems.length,
          wasLockedAfterEdit: updateData.editUsed === true,
        },
      });
    }

    return Response.json({
      success: true,
      technicalQuote: techQuote,
      message: updateData.editUsed
        ? "Quote saved. Your one-time edit was used. Quote locked again."
        : "Quote saved successfully.",
      wasLocked: updateData.editUsed === true,
    });
  } catch (error) {
    console.error("TECH QUOTE SAVE ERROR:", error);
    return Response.json(
      { error: "Failed to save technical quote", details: error.message },
      { status: 500 }
    );
  }
}
