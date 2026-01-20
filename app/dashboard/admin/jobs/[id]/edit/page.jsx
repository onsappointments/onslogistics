import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateJob } from "./actions";

export default async function EditJobPage({ params }) {
  const { id } = await params;

  await connectDB();

  // ✅ AUTH
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div className="p-10">Unauthorized</div>;
  }

  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) {
    return <div className="p-10">Unauthorized</div>;
  }

  const job = await Job.findById(id).lean();
  if (!job) return <div className="p-10">Job not found.</div>;

  // ✅ PERMISSION RULES
  const isSuperAdmin = currentUser.adminType === "super_admin";
  const isNewJob = job.status === "new";

  // requester can edit ONCE after super admin approval
  const isApprovedRequester =
    job.editRequestedBy &&
    String(job.editRequestedBy) === String(currentUser._id) &&
    job.editApprovedAt &&
    job.editUsed === false;

  const canEdit = isSuperAdmin || isNewJob || isApprovedRequester;

  if (!canEdit) {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Editing Locked</h1>
        <p className="text-gray-600">
          You don’t have permission to edit this job. Please request edit access
          from the Job Details page and wait for Super Admin approval.
        </p>
      </div>
    );
  }

  const fmtDate = (d) => (d ? new Date(d).toISOString().substring(0, 10) : "");

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Edit {job.jobId}</h1>

      <form action={updateJob} className="space-y-8">
        <input type="hidden" name="id" value={job._id.toString()} />

        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Job Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* READ-ONLY JOB ID */}
            <div className="block text-sm">
              <span className="text-gray-700">Job ID</span>
              <input
                type="text"
                value={job.jobId}
                readOnly
                className="mt-1 w-full rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* MBL / HBL */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">MBL / HBL</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="MBL Number" name="mblNumber" defaultValue={job.mblNumber || ""} />
            <FieldInput label="MBL Date" name="mblDate" type="date" defaultValue={fmtDate(job.mblDate)} />
            <FieldInput label="HBL Number" name="hblNumber" defaultValue={job.hblNumber || ""} />
            <FieldInput label="HBL Date" name="hblDate" type="date" defaultValue={fmtDate(job.hblDate)} />
          </div>
        </section>

        {/* PORTS */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Ports & Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="Port of Loading" name="portOfLoading" defaultValue={job.portOfLoading || ""} />
            <FieldInput label="Port of Discharge" name="portOfDischarge" defaultValue={job.portOfDischarge || ""} />
            <FieldInput label="Clearance At" name="clearanceAt" defaultValue={job.clearanceAt || ""} />
          </div>
        </section>

        {/* PARTIES */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="Consignee" name="consignee" defaultValue={job.consignee || ""} />
            <FieldInput label="Shipper" name="shipper" defaultValue={job.shipper || ""} />
          </div>
        </section>

        {/* SHIPMENT */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Shipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldInput label="PKGS" name="pkgs" defaultValue={job.pkgs || ""} />
            <FieldInput label="Gross Weight" name="grossWeight" defaultValue={job.grossWeight || ""} />
            <FieldInput label="CBM" name="cbm" defaultValue={job.cbm || ""} />
          </div>
        </section>

        {/* CUSTOMS */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Customs & Clearance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="BE Number" name="beNumber" defaultValue={job.beNumber || ""} />
            <FieldInput label="BE Date" name="beDate" type="date" defaultValue={fmtDate(job.beDate)} />
            <FieldInput label="Assessable Value" name="assessableValue" defaultValue={job.assessableValue || ""} />
            <FieldInput label="Reference Number" name="referenceNumber" defaultValue={job.referenceNumber || ""} />
            <FieldInput label="GIGAM Number" name="gigamNumber" defaultValue={job.gigamNumber || ""} />
            <FieldInput label="GIGAM Date" name="gigamDate" type="date" defaultValue={fmtDate(job.gigamDate)} />
            <FieldInput label="LIGN Number" name="lignNumber" defaultValue={job.lignNumber || ""} />
            <FieldInput label="LIGN Date" name="lignDate" type="date" defaultValue={fmtDate(job.lignDate)} />
          </div>
        </section>

        {/* CONTAINER & COMMODITY */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Container & Commodity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label="Container Number" name="containerNumber" defaultValue={job.containerNumber || ""} />
            <FieldInput label="Container Type" name="containerType" defaultValue={job.containerType || ""} />
          </div>
          <FieldInput label="Commodity" name="commodity" defaultValue={job.commodity || ""} />
        </section>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

function FieldInput({ label, name, defaultValue, type = "text" }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}
