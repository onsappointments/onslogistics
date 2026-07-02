import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import Quote from "@/models/Quote";
import { PRE_CONTAINER_SENTINEL } from "@/models/Job";
import { getCycleForShipment } from "@/lib/shipmentCycles";
import {
  resolveStepTitle,
  resolveEventBody,
  STEP_ICONS,
} from "@/lib/trackingStatus";

/* ─────────────────────────────────────────────────────────────────────
   FIND JOB — searches every possible ref field simultaneously.
   No prefix guessing. Whatever field the number lives in, it will match.
───────────────────────────────────────────────────────────────────── */
async function findJobByRef(ref: string) {
  const trimmed = ref.trim();

  return Job.findOne({
    $or: [
      { "containers.containerNumber": trimmed },
      { mblNumber: trimmed },
      { hblNumber: trimmed },
      { bookingNumber: trimmed },
      { referenceNumber: trimmed },
      { awbNumber: trimmed },
      { jobId: trimmed },
    ],
  })
    .populate("quoteId")
    .lean();
}

/* ─────────────────────────────────────────────────────────────────────
   Which containers to show the client.
   - If the ref matches a specific container number → show only that one.
   - Otherwise → show all real containers on the job.
───────────────────────────────────────────────────────────────────── */
function resolveDisplayContainers(ref: string, allContainers: any[]) {
  const real = allContainers.filter(
    (c) => c.containerNumber !== PRE_CONTAINER_SENTINEL
  );
  const directHit = real.find(
    (c) => c.containerNumber.trim().toUpperCase() === ref.trim().toUpperCase()
  );
  return directHit ? [directHit] : real;
}

/* ─────────────────────────────────────────────────────────────────────
   DATE FORMATTER
───────────────────────────────────────────────────────────────────── */
function fmt(date: string | Date | null | undefined): string | null {
  if (!date) return null;
  const d = new Date(date as string);
  if (isNaN(d.getTime())) return null;
  const hasTime =
    d.getUTCHours() !== 0 ||
    d.getUTCMinutes() !== 0 ||
    d.getUTCSeconds() !== 0;
  if (hasTime) {
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────────────────
   MERGE — interleave sentinel (job-level) + container events in the
   canonical cycle order so clients see one unbroken journey per container.
───────────────────────────────────────────────────────────────────── */
function buildClientTimeline(
  containerEvents: any[],
  sentinelEvents: any[],
  shipmentType: string
): any[] {
  const cycle = getCycleForShipment(shipmentType);

  function withIndex(ev: any) {
    const idx = cycle.findIndex((s) => s.key === ev.cycleStep);
    return { ...ev, _cycleIdx: idx === -1 ? 9999 : idx };
  }

  const merged = [
    ...sentinelEvents.map(withIndex),
    ...containerEvents.map(withIndex),
  ];

  merged.sort((a, b) => {
    if (a._cycleIdx !== b._cycleIdx) return a._cycleIdx - b._cycleIdx;
    const da = new Date(
      a.actualDeparture ?? a.eta ?? a.eventDate ?? 0
    ).getTime();
    const db = new Date(
      b.actualDeparture ?? b.eta ?? b.eventDate ?? 0
    ).getTime();
    return da - db;
  });

  return merged;
}

/* ─────────────────────────────────────────────────────────────────────
   STATUS BADGE CONFIG
───────────────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<
  string,
  { color: string; bg: string; border: string; icon: string }
> = {
  "Empty Picked Up": { color: "#6b7280", bg: "#f9fafb", border: "#d1d5db", icon: "📦" },
  "Gate In": { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", icon: "🚧" },
  "Loaded on Vessel": { color: "#1a56db", bg: "#dbeafe", border: "#93c5fd", icon: "🚢" },
  "Vessel Departed": { color: "#1a56db", bg: "#eff6ff", border: "#bfdbfe", icon: "⚓" },
  "Arrived at Transshipment Port": { color: "#b45309", bg: "#fffbeb", border: "#fde68a", icon: "🔁" },
  "Vessel Arrived": { color: "#047857", bg: "#ecfdf5", border: "#6ee7b7", icon: "🛳️" },
  "Discharged": { color: "#065f46", bg: "#d1fae5", border: "#6ee7b7", icon: "📤" },
  "Gate Out": { color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd", icon: "🚪" },
  "Delivered": { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", icon: "✅" },
};

function getCfg(cycleStep: string, status: string) {
  const stepIcon = STEP_ICONS[cycleStep];
  const statusCfg = STATUS_CFG[status];
  if (statusCfg) return { ...statusCfg, icon: stepIcon ?? statusCfg.icon };
  return { color: "#1a56db", bg: "#eff6ff", border: "#bfdbfe", icon: stepIcon ?? "📍" };
}

/* ─────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────── */
export default async function PublicTrackingPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  await connectDB();

  const job = await findJobByRef(ref);

  /* ── NOT FOUND ─────────────────────────────────────────────────── */
  if (!job) {
    return (
      <main
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        className="min-h-screen bg-[#f0f4f8] flex flex-col"
      >
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <nav className="bg-white border-b border-[#dde3ed] px-6 h-14 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1a56db] flex items-center justify-center">
              <span className="text-white text-xs">⚓</span>
            </div>
            <span className="text-gray-900 font-semibold text-sm tracking-wide">
              ONS Logistics
            </span>
          </div>
          <Link href="/tracking" className="text-xs text-[#1a56db] font-medium hover:underline">
            ← Track another
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-3xl mx-auto mb-6">
              🔍
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">No shipment found</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              We couldn't find a shipment matching
            </p>
            <p
              className="font-mono text-[#1a56db] text-sm bg-[#eff6ff] border border-[#bfdbfe] rounded-lg px-4 py-2 inline-block mb-4"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {ref}
            </p>
            <p className="text-gray-400 text-xs mb-8">
              Double-check your container number, BL number, booking reference, or invoice number.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/tracking"
                className="px-5 py-2.5 rounded-lg bg-[#1a56db] text-white text-sm font-medium hover:bg-[#1648c0] transition-colors"
              >
                Try again
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg border border-[#dde3ed] text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── DATA PREP ─────────────────────────────────────────────────── */
  const quote = (job as any).quoteId as any;
  const shipmentType: "import" | "export" =
    (job as any).shipmentType === "export" ? "export" : "import";
  const routeLabel = [quote?.fromCity, quote?.toCity].filter(Boolean).join(" → ");

  const allContainers: any[] = (job as any).containers ?? [];
  const sentinelEvents: any[] =
    allContainers.find((c) => c.containerNumber === PRE_CONTAINER_SENTINEL)?.events ?? [];

  const displayContainers = resolveDisplayContainers(ref, allContainers);

  const containersWithTimeline = displayContainers.map((container) => ({
    ...container,
    clientTimeline: buildClientTimeline(
      container.events ?? [],
      sentinelEvents,
      shipmentType
    ),
  }));

  const latestEvent = containersWithTimeline.flatMap((c) => c.clientTimeline).at(-1);
  const isDelivered =
    latestEvent?.status === "Delivered" ||
    latestEvent?.cycleStep === "cargo_dispatch";

  /* ── RENDER ────────────────────────────────────────────────────── */
  return (
    <main
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      className="min-h-screen bg-[#f0f4f8]"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav className="bg-white border-b border-[#dde3ed] px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#1a56db] flex items-center justify-center">
            <span className="text-white text-xs">⚓</span>
          </div>
          <span className="text-gray-900 font-semibold text-sm tracking-wide">
            ONS Logistics
          </span>
        </div>
        <Link href="/tracking" className="text-xs text-[#1a56db] font-medium hover:underline transition-colors">
          ← Track another
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── HERO CARD ─────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl border border-[#dde3ed] overflow-hidden p-6 sm:p-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a56db]" />
          <p className="text-[#1a56db] text-xs font-semibold uppercase tracking-widest mb-2">
            Shipment Tracking
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h1
              className="text-gray-900 text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {ref}
            </h1>
            {isDelivered && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
                ✅ Delivered
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {routeLabel && <MetaChip label="Route" value={routeLabel} wide />}
            <MetaChip label="Mode" value={quote?.modeOfShipment} />
            <MetaChip label="Type" value={quote?.shipmentType} />
            <MetaChip
              label="Containers"
              value={`${displayContainers.length} container${displayContainers.length !== 1 ? "s" : ""}`}
            />
          </div>
        </div>

        {/* ── SECTION LABEL ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-1">
          <p className="text-sm font-semibold text-gray-700">Shipment Status</p>
          <span className="text-xs font-semibold bg-[#e8edf8] text-[#1a56db] rounded-full px-2.5 py-0.5">
            {displayContainers.length} container{displayContainers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── NO CONTAINERS / ONLY PRE-CONTAINER EVENTS ─────────── */}
        {containersWithTimeline.length === 0 && sentinelEvents.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#dde3ed] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#edf0f7] bg-[#f8f9fc]">
              <p className="text-gray-700 font-semibold text-sm">Shipment in Progress</p>
              <p className="text-gray-400 text-xs mt-0.5">Container not yet allocated</p>
            </div>
            <div className="px-5 py-5">
              <TimelineEvents
                events={sentinelEvents.map((ev) => ({
                  ...ev,
                  _cycleIdx: getCycleForShipment(shipmentType).findIndex(
                    (s) => s.key === ev.cycleStep
                  ),
                }))}
                shipmentType={shipmentType}
              />
            </div>
          </div>
        )}

        {containersWithTimeline.length === 0 && sentinelEvents.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#dde3ed] p-10 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Your shipment is being processed
            </p>
            <p className="text-gray-400 text-xs">
              Detailed tracking updates will appear here once your cargo is on the move.
            </p>
          </div>
        )}

        {/* ── CONTAINER CARDS ───────────────────────────────────── */}
        {containersWithTimeline.map((container) => {
          const timeline = container.clientTimeline;
          const lastEvent = timeline.at(-1);
          const cfg = lastEvent
            ? getCfg(lastEvent.cycleStep ?? "", lastEvent.status ?? "")
            : { color: "#1a56db", bg: "#eff6ff", border: "#bfdbfe", icon: "📍" };

          return (
            <div
              key={container.containerNumber}
              className="bg-white rounded-2xl border border-[#dde3ed] overflow-hidden"
            >
              {/* Container header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-[#edf0f7] bg-[#f8f9fc]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border"
                    style={{ background: cfg.bg, borderColor: cfg.border }}
                  >
                    {cfg.icon}
                  </div>
                  <div>
                    <p
                      className="text-gray-900 font-semibold text-sm tracking-wide"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {container.containerNumber}
                    </p>
                    {container.sizeType && (
                      <p className="text-gray-400 text-xs">{container.sizeType}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {lastEvent && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 border"
                      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                    >
                      {resolveStepTitle(
                        lastEvent.cycleStep ?? "",
                        lastEvent.eventType ?? "status",
                        lastEvent.status ?? ""
                      )}
                    </span>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {timeline.length} update{timeline.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {timeline.length === 0 ? (
                <div className="px-5 py-10 text-center text-gray-400 text-sm">
                  No updates recorded yet
                </div>
              ) : (
                <div className="px-5 py-5">
                  <TimelineEvents events={timeline} shipmentType={shipmentType} />
                </div>
              )}
            </div>
          );
        })}

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <div className="text-center pt-2 pb-8">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} ONS Logistics · Automated tracking system
          </p>
          <Link
            href="/tracking"
            className="inline-block mt-2 text-xs text-[#1a56db] hover:underline transition-colors"
          >
            Track a different shipment →
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   TIMELINE EVENTS — extracted so the pre-container-only case can
   reuse the same rendering logic.
───────────────────────────────────────────────────────────────────── */
function TimelineEvents({
  events,
  shipmentType,
}: {
  events: any[];
  shipmentType: "import" | "export";
}) {
  return (
    <div className="relative">
      <div className="absolute left-[13px] top-4 bottom-4 w-px bg-[#e2e8f0]" />
      <div className="space-y-0">
        {events.map((event: any, idx: number) => {
          const isLast = idx === events.length - 1;
          const eventType = event.eventType ?? "single";
          const stepIcon = STEP_ICONS[event.cycleStep ?? ""] ?? "📍";

          const displayTitle = resolveStepTitle(
            event.cycleStep ?? "",
            eventType as any,
            event.status ?? ""
          );

          const bodyText = resolveEventBody({
            cycleStep: event.cycleStep ?? "",
            eventType: eventType as any,
            status: event.status ?? "",
            eta: event.eta,
            actualDeparture: event.actualDeparture,
            remarks: event.remarks,
            shipmentType,
          });

          const hasEta = !!event.eta;
          const hasActual = !!event.actualDeparture;

          return (
            <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0 mt-0.5">
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-sm border-2"
                  style={
                    isLast
                      ? { background: "#1a56db", borderColor: "#1a56db" }
                      : { background: "#f9fafb", borderColor: "#d1d5db" }
                  }
                >
                  {isLast ? (
                    <span className="text-white text-xs">{stepIcon}</span>
                  ) : (
                    <svg
                      className="w-2.5 h-2.5"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                      style={{ color: "#9ca3af" }}
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm font-semibold leading-snug ${isLast ? "text-gray-900" : "text-gray-600"}`}>
                  {displayTitle}
                </p>

                {(hasEta || hasActual) && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {hasEta && (eventType === "eta" || eventType === "single") && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Est. {fmt(event.eta)}
                      </span>
                    )}
                    {hasActual && eventType === "actual" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {fmt(event.actualDeparture)}
                      </span>
                    )}
                  </div>
                )}

                {event.location && (
                  <p className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </p>
                )}

                {bodyText && (
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{bodyText}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────── */
function MetaChip({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={wide ? "col-span-2 sm:col-span-2" : ""}>
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-gray-900 text-sm font-semibold leading-snug">{value}</p>
    </div>
  );
}