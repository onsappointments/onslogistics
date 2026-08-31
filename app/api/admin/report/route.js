import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import TechnicalQuote from "@/models/TechnicalQuote";
import { authOptions } from "@/lib/authOptions";
import { PRE_CONTAINER_SENTINEL } from "@/models/Job";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const SERVICE_SCOPE_LABELS = {
  CUSTOMS: "C",
  FREIGHT_FORWARDING: "F",
  CUSTOMS_AND_FREIGHT_FORWARDING: "C-F",
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

function clean(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const str = String(value).trim();

  return str || null;
}

function toISOString(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function formatServiceScope(value) {
  if (!value) return null;

  return SERVICE_SCOPE_LABELS[value] || value;
}

/**
 * Return the latest occurrence of a cycle step.
 *
 * We prefer actualDeparture, then eventDate, then ETA.
 */
function getLatestEvent(events = [], cycleStep) {
  const matches = events.filter(
    (event) => event?.cycleStep === cycleStep
  );

  if (!matches.length) {
    return null;
  }

  return [...matches].sort((a, b) => {
    const aTime = new Date(
      a.actualDeparture ||
        a.eventDate ||
        a.eta ||
        0
    ).getTime();

    const bTime = new Date(
      b.actualDeparture ||
        b.eventDate ||
      b.eta ||
        0
    ).getTime();

    return bTime - aTime;
  })[0];
}

/**
 * Return the most useful date for a report milestone.
 *
 * Actual > eventDate > ETA
 */
function getMilestoneDate(event) {
  if (!event) return null;

  return toISOString(
    event.actualDeparture ||
      event.eventDate ||
      event.eta
  );
}

/**
 * Normalize a single container into report data.
 */
function normalizeContainer(container, shipmentType) {
  const events = Array.isArray(container?.events)
    ? container.events
    : [];

  const vesselPlanning = getLatestEvent(
    events,
    shipmentType === "export"
      ? "vessel_planning"
      : "planning_vessel"
  );

  const stuffing = getLatestEvent(
    events,
    shipmentType === "export"
      ? "container_stuffed"
      : "stuffing_container_allocated"
  );

  const shippedOnBoard = getLatestEvent(
    events,
    shipmentType === "export"
      ? "shipped_on_board_export"
      : "shipped_on_board"
  );

  const vesselArrival = getLatestEvent(
    events,
    shipmentType === "export"
      ? "vessel_arrived_destination"
      : "vessel_arrived_pod"
  );

  const railment =
    shipmentType === "import"
      ? getLatestEvent(
          events,
          "container_railment_pod"
        )
      : null;

  const localIcd =
    shipmentType === "import"
      ? getLatestEvent(
          events,
          "arrived_local_icd"
        )
      : null;

  const finalEvent = getLatestEvent(
    events,
    shipmentType === "export"
      ? "delivered_to_consignee"
      : "cargo_dispatch"
  );

  return {
    containerNumber: clean(
      container?.containerNumber
    ),

    sizeType: clean(
      container?.sizeType
    ),

    sealNumber: clean(
      stuffing?.sealNumber
    ),

    vesselName: clean(
      vesselPlanning?.vesselName
    ),

    voyage: clean(
      vesselPlanning?.voyage
    ),

    trainNumber: clean(
      railment?.trainNumber
    ),

    wagonNumber: clean(
      railment?.wagonNumber
    ),

    milestones: {
      stuffing: getMilestoneDate(stuffing),

      vesselPlanning:
        getMilestoneDate(vesselPlanning),

      shippedOnBoard:
        getMilestoneDate(shippedOnBoard),

      vesselArrival:
        getMilestoneDate(vesselArrival),

      railment:
        getMilestoneDate(railment),

      localIcd:
        getMilestoneDate(localIcd),

      final:
        getMilestoneDate(finalEvent),
    },

    currentEvent: finalEvent
      ? {
          cycleStep:
            clean(finalEvent.cycleStep),

          status:
            clean(finalEvent.status),

          eventType:
            clean(finalEvent.eventType),

          date:
            getMilestoneDate(finalEvent),
        }
      : null,
  };
}

/**
 * Normalize one Job + one real container
 * into one report row.
 */
function normalizeReportRow({
  job,
  quote,
  technicalQuote,
  container,
}) {
  const shipmentType =
    String(
      job.shipmentType ||
        quote?.shipmentType ||
        technicalQuote?.shipmentType ||
        "import"
    ).toLowerCase();

  const shipmentDetails =
    technicalQuote?.shipmentDetails || {};

  const jobMeta =
    technicalQuote?.jobMeta || {};

  const serviceScope =
    quote?.serviceScope || null;

  const normalizedContainer =
    normalizeContainer(
      container,
      shipmentType
    );

  return {
    id: container?.containerNumber
      ? `${job._id}_${container.containerNumber}`
      : String(job._id),

    jobId: String(job._id),

    jobNumber: clean(
      job.jobNumber ||
        job.jobId
    ),

    shipmentType,

    status: clean(job.status),

    serviceScope: {
      value: serviceScope,
      label: formatServiceScope(
        serviceScope
      ),
    },

    salesPerson: clean(
      quote?.assignedToName
    ),

    accountsPerson: clean(
      jobMeta.accountsPerson
    ),

    company: clean(
      job.company ||
        quote?.company
    ),

    customerName: clean(
      job.customerName
    ),

    shipper: clean(
      job.shipper ||
        shipmentDetails.shipper
    ),

    consignee: clean(
      job.consignee ||
        shipmentDetails.consignee
    ),

    route: {
      pol: clean(
        job.portOfLoading ||
          shipmentDetails.portOfLoading
      ),

      pod: clean(
        job.portOfDischarge ||
          shipmentDetails.portOfDischarge
      ),

      clearanceAt: clean(
        job.clearanceAt
      ),
    },

    shipment: {
      modeOfShipment: clean(
        shipmentDetails.modeOfShipment ||
          quote?.modeOfShipment
      ),

      modeOfTransport: clean(
        quote?.modeOfTransport
      ),

      fclLcl: clean(
        shipmentDetails.fclLcl
      ),

      carrier: clean(
        shipmentDetails.carrier
      ),
    },

    booking: {
      number: clean(
        job.bookingNumber
      ),

      date: toISOString(
        job.bookingDate
      ),
    },

    invoice: {
      number: clean(
        job.invoiceNumber
      ),

      date: toISOString(
        job.invoiceDate
      ),
    },

    billOfLading: {
      mblNumber: clean(
        job.mblNumber
      ),

      mblDate: toISOString(
        job.mblDate
      ),

      hblNumber: clean(
        job.hblNumber
      ),

      hblDate: toISOString(
        job.hblDate
      ),

      awbNumber: clean(
        job.awbNumber
      ),

      awbDate: toISOString(
        job.awbDate
      ),
    },

    customs: {
      billOfEntry: {
        number: clean(
          job.beNumber
        ),

        date: toISOString(
          job.beDate
        ),
      },

      shippingBill: {
  bills:
    Array.isArray(job.shippingBills) &&
    job.shippingBills.length > 0
      ? job.shippingBills
          .map((bill) => ({
            number: clean(bill?.number),
            date: toISOString(bill?.date),
          }))
          .filter(
            (bill) =>
              bill.number ||
              bill.date
          )
      : job.sbNumber || job.sbDate
      ? [
          {
            number: clean(job.sbNumber),
            date: toISOString(job.sbDate),
          },
        ]
      : [],
},

      assessableValue: clean(
        job.assessableValue
      ),

      referenceNumber: clean(
        job.referenceNumber
      ),

      gigam: {
        number: clean(
          job.gigamNumber
        ),

        date: toISOString(
          job.gigamDate
        ),
      },

      lign: {
        number: clean(
          job.lignNumber
        ),

        date: toISOString(
          job.lignDate
        ),
      },
    },

    cargo: {
      packages: clean(
        job.pkgs
      ),

      grossWeight: clean(
        job.grossWeight
      ),

      cbm: clean(
        job.cbm
      ),

      commodity: clean(
        job.commodity
      ),
    },

    container:
      normalizedContainer,

    tracking: {
      jobReference: clean(
        job.jobNumber
      ),
    },

    createdAt: toISOString(
      job.createdAt
    ),

    updatedAt: toISOString(
      job.updatedAt
    ),
  };
}

/* ─────────────────────────────────────────────────────────────
   GET REPORT
───────────────────────────────────────────────────────────── */

export async function GET(req) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const {
      searchParams,
    } = new URL(req.url);

    const shipmentType =
      String(
        searchParams.get(
          "shipmentType"
        ) || "import"
      ).toLowerCase();

    if (
      shipmentType !== "import" &&
      shipmentType !== "export"
    ) {
      return NextResponse.json(
        {
          error:
            "shipmentType must be either import or export",
        },
        {
          status: 400,
        }
      );
    }
    const month =
     searchParams.get("month")?.trim() || null;

     if (
  month &&
  !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)
) {
  return NextResponse.json(
    {
      error:
        "month must be in YYYY-MM format",
    },
    { status: 400 }
  );
}
let dateFilter = {};

if (month) {
  const [year, monthNumber] =
    month.split("-").map(Number);

  const startDate = new Date(
    year,
    monthNumber - 1,
    1
  );

  const endDate = new Date(
    year,
    monthNumber,
    1
  );

  dateFilter = {
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  };
}

    const jobs = await Job.find({...dateFilter,})
  .populate({
    path: "quoteId",
    model: Quote,
    select: [
      "fromCountry",
      "toCountry",
      "fromCity",
      "toCity",
      "fromLocationType",
      "toLocationType",
      "fromICD",
      "toICD",
      "item",
      "modeOfTransport",
      "estimatedShippingDate",
      "freightTerms",
      "containerType",
      "modeOfShipment",
      "shipmentType",
      "serviceScope",
      "company",
      "assignedToName" ,
    ].join(" "),
  })
  .populate({
    path: "technicalQuoteId",
    model: TechnicalQuote,
    select: [
      "shipmentType",
      "jobMeta",
      "shipmentDetails",
    ].join(" "),
  })
  .sort({
    createdAt: -1,
  })
  .lean();

    const rows = [];

for (const job of jobs) {
  const quote =
    job.quoteId &&
    typeof job.quoteId === "object"
      ? job.quoteId
      : null;

  const technicalQuote =
    job.technicalQuoteId &&
    typeof job.technicalQuoteId === "object"
      ? job.technicalQuoteId
      : null;

  const jobShipmentType = String(
    job.shipmentType ||
      quote?.shipmentType ||
      technicalQuote?.shipmentType ||
      "import"
  ).toLowerCase();

  // This Job does not belong to the currently selected report.
  if (jobShipmentType !== shipmentType) {
    continue;
  }

  const containers =
    Array.isArray(job.containers)
      ? job.containers
      : [];

  const realContainers = containers.filter(
    (container) =>
      container?.containerNumber &&
      container.containerNumber !== PRE_CONTAINER_SENTINEL
  );

  /*
   * If the Job already has real containers,
   * create one report row per container.
   */
  if (realContainers.length > 0) {
    for (const container of realContainers) {
      rows.push(
        normalizeReportRow({
          job,
          quote,
          technicalQuote,
          container,
        })
      );
    }

    continue;
  }

  /*
   * No real container yet.
   *
   * Still include the Job because export/import
   * operations can legitimately exist before
   * container allocation.
   */
  rows.push(
    normalizeReportRow({
      job,
      quote,
      technicalQuote,
      container: null,
    })
  );
}

    return NextResponse.json({
      success: true,

      report: {
        shipmentType,
        month,
        generatedAt:
          new Date().toISOString(),

        totalJobs: jobs.length,

        totalRows: rows.length,
      },

      rows,
    });
  } catch (error) {
    console.error(
      "Operations report error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate operations report",
      },
      {
        status: 500,
      }
    );
  }
}