"use server";

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { redirect } from "next/navigation";

export async function updateJob(formData) {
  await connectDB();

  const id = formData.get("id");

  if (!id) {
    throw new Error("Job id missing");
  }

  const update = {
    // BASIC
    jobNumber: formData.get("jobNumber") || null,

    // MBL / HBL
    mblNumber: formData.get("mblNumber") || null,
    mblDate: formData.get("mblDate") || null,        // 'yyyy-mm-dd' → Date by Mongoose
    hblNumber: formData.get("hblNumber") || null,
    hblDate: formData.get("hblDate") || null,

    // PORTS / LOCATION
    portOfLoading: formData.get("portOfLoading") || null,
    portOfDischarge: formData.get("portOfDischarge") || null,
    clearanceAt: formData.get("clearanceAt") || null,

    // PARTIES
    consignee: formData.get("consignee") || null,
    shipper: formData.get("shipper") || null,

    // SHIPMENT
    pkgs: formData.get("pkgs") || null,
    grossWeight: formData.get("grossWeight") || null,
    cbm: formData.get("cbm") || null,

    // CUSTOMS / CLEARANCE
    beNumber: formData.get("beNumber") || null,
    beDate: formData.get("beDate") || null,
    assessableValue: formData.get("assessableValue") || null,
    referenceNumber: formData.get("referenceNumber") || null,
    gigamNumber: formData.get("gigamNumber") || null,
    gigamDate: formData.get("gigamDate") || null,
    lignNumber: formData.get("lignNumber") || null,
    lignDate: formData.get("lignDate") || null,

    // CONTAINER
    containerNumber: formData.get("containerNumber") || null,
    containerType: formData.get("containerType") || null,

    // COMMODITY
    commodity: formData.get("commodity") || null,
  };

  await Job.findByIdAndUpdate(id, update, { new: true });

  // back to details page
  redirect(`/dashboard/admin/jobs/${id}`);
}
