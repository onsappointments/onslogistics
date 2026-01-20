
// ============================================
// YOUR UPDATED TECHNICAL QUOTE SAVE ROUTE
// app/api/technical-quotes/route.js
// ============================================

import connectDB from "@/lib/mongodb";
import TechnicalQuote from "@/models/TechnicalQuote";
import Quote from "@/models/Quote";
import User from "@/models/User";
import { logAudit } from "@/lib/audit";

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

    /* ---------------- ✅ PERMISSION CHECK FOR EDITING ---------------- */
    
    let currentUser = null;
    let isSuperAdmin = false;

    if (session?.user?.email) {
      currentUser = await User.findOne({ email: session.user.email });
      isSuperAdmin = currentUser?.adminType === "super_admin";
    }

    // Check if technical quote already exists
    const existingTechQuote = await TechnicalQuote.findOne({
      clientQuoteId: quoteId,
    });

    // If quote exists and user is NOT super admin, check permission
    if (existingTechQuote && currentUser && !isSuperAdmin) {
      const hasApprovedAccess = 
        existingTechQuote.editApprovedBy && 
        existingTechQuote.editApprovedBy.toString() === currentUser._id.toString() &&
        existingTechQuote.editUsed === false;

      if (!hasApprovedAccess) {
        return Response.json(
          { 
            error: "You don't have permission to edit this quote. Please request edit access.",
            needsApproval: true,
            technicalQuoteId: existingTechQuote._id
          },
          { status: 403 }
        );
      }

      console.log("🔓 User has one-time edit access. Will lock after save.");
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

    // ✅ IF REGULAR ADMIN USED THEIR ONE-TIME ACCESS, LOCK THE QUOTE
    if (existingTechQuote && currentUser && !isSuperAdmin) {
      const hadApprovedAccess =
        existingTechQuote.editApprovedBy &&
        existingTechQuote.editApprovedBy.toString() === currentUser._id.toString() &&
        existingTechQuote.editUsed === false;

      if (hadApprovedAccess) {
        updateData.editUsed = true;
        updateData.editApprovedBy = null;
        updateData.editApprovedAt = null;
        console.log("🔒 One-time edit used. Quote is now locked.");
      }
    }

    /* ---------------- UPSERT ---------------- */

    const techQuote = await TechnicalQuote.findOneAndUpdate(
      { clientQuoteId: quoteId },
      { $set: updateData },
      { upsert: true, new: true }
    );

    /* ---------------- AUDIT LOG ---------------- */

    if (!existingTechQuote) {
      // ✅ FIRST TIME CREATION
      await logAudit({
        entityType: "technical_quote",
        entityId: techQuote._id,
        action: "created",
        description: "Technical quote created",
        performedBy: null, // or user._id if you have auth
        meta: {
          quoteId,
          shipmentType,
        },
      });
    } else {
      // ✅ SAVED AS DRAFT
      const wasLockedAfterEdit = updateData.editUsed === true;

      await logAudit({
       entityType: "technical_quote",
       entityId: techQuote._id,
       action: "saved_draft",
       description: "Technical quote saved as draft",
       performedBy: null,
       meta: {
         quoteId,
          updatedLineItems: normalizedLineItems.length,
          wasLockedAfterEdit,
        },
      });
    }

    return Response.json({
      success: true,
      technicalQuote: techQuote,
      message: updateData.editUsed
        ? "Quote saved successfully. Quote is now locked again."
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