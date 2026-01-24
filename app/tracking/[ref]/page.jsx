import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Quote from "@/models/Quote";
import { notFound } from "next/navigation";

/* ---------------- DETECT REF TYPE ---------------- */

function detectType(ref) {
  if (/^[A-Z]{4}\d{7}$/i.test(ref)) return "container";
  if (ref.startsWith("BL")) return "bl";
  if (ref.startsWith("BKG")) return "booking";
  return "invoice";
}

export default async function PublicTrackingPage({ params }) {
  const { ref } = await params;

  const type = detectType(ref);

  await connectDB();

  let query = {};

  switch (type) {
    case "container":
      query = { "containers.containerNumber": ref };
      break;
    case "bl":
      query = { $or: [{ mblNumber: ref }, { hblNumber: ref }] };
      break;
    case "booking":
      query = { bookingNumber: ref };
      break;
    case "invoice":
      query = { referenceNumber: ref };
      break;
  }

  const job = await Job.findOne(query)
    .populate("quoteId")
    .lean();

  if (!job) {
  return (
    <main className="bg-[#F5F5F7] min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold">Shipment Tracking</h1>
          <p className="text-gray-500 text-sm mt-1">
            Reference: <span className="font-medium">{ref}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-xl font-semibold text-gray-900">
            No shipment found
          </p>
          <p className="text-gray-600 mt-2">
            The reference you entered looks incorrect or is not in our system.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/tracking"
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Search Again
            </a>
            <a
              href="/"
              className="px-5 py-2 rounded-full border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}


  const quote = job.quoteId;

  return (
    <main className="bg-[#F5F5F7] min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ROUTE HEADER */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold">Shipment Tracking</h1>
          <p className="text-gray-500 text-sm mt-1">
            Reference: <span className="font-medium">{ref}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-sm">
            <Field label="Shipment Type" value={quote?.shipmentType} />
            <Field label="From" value={quote?.fromCity} />
            <Field label="To" value={quote?.toCity} />
            <Field label="Mode" value={quote?.modeOfShipment} />
          </div>
        </div>

        {/* CONTAINERS */}
        {(job.containers || []).map((container) => (
          <div
            key={container.containerNumber}
            className="bg-white rounded-xl shadow p-6"
          >
            <h2 className="text-lg font-semibold mb-4">
              Container {container.containerNumber}
            </h2>

            <ol className="relative border-l border-gray-300 space-y-6 pl-6">
              {(container.events || []).map((event, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute -left-[9px] top-1.5 w-3 h-3 bg-blue-600 rounded-full" />
                  <p className="font-medium">{event.status}</p>

                 <p className="text-sm text-gray-500">
                  {event.location || "—"}
                  {event.eventDate && !isNaN(new Date(event.eventDate)) && (
                  <> • {new Date(event.eventDate).toLocaleDateString()}</>
                  )}


                 </p>

                 {event.remarks && (
                 <p className="mt-1 text-sm text-gray-600 italic">
                   {event.remarks}
                 </p>
                )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ---------------- UI HELPER ---------------- */

function Field({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
