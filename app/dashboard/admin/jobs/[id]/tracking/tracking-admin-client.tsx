"use client";

import { useState } from "react";
import AddEventForm from "@/Components/tracking/AddEventForm";
import ContainerCard from "@/Components/tracking/ContainerCard";
import PreContainerSection from "@/Components/tracking/PreContainerSection";
import AddContainerModal from "@/Components/tracking/AddContainerModal";
import EditEventModal from "@/Components/tracking/EditEventModal";
import EmailConfirmModal from "@/Components/tracking/EmailConfirmModal";
import { PRE_CONTAINER_SENTINEL } from "@/Components/tracking/lib/constants";
import { fmtDate, toDateValue } from "@/Components/tracking/lib/utils";
import {
  addContainerShell,
  saveEvent,
  editEvent,
  sendEditEmail,
  openResendModal,
  sendResendEmail,
  deleteEvent,
} from "@/Components/tracking/lib/trackingActions";


/* ─────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────── */

export default function TrackingAdminClient({
  job,
  defaultEmail,
}: {
  job: any;
  defaultEmail?: string;
}) {
  const [containers, setContainers] = useState<any[]>(job.containers || []);
  const [emailLogs, setEmailLogs] = useState<any[]>(job.emailLogs || []);
  const [saving, setSaving] = useState(false);

  const updateTrackingState = (updatedJob: any) => {
  setContainers(updatedJob.containers || []);
  setEmailLogs(updatedJob.emailLogs || []);
};

  // Edit flow
  const [editTarget, setEditTarget] = useState<{
    containerNumber: string;
    eventIndex: number;
  } | null>(null);
  const [editEmailPrompt, setEditEmailPrompt] = useState<any>(null);

  // Resend flow — stores the event and its container so we can open the modal
  const [resendTarget, setResendTarget] = useState<{
    containerNumber: string;
    event: any;
  } | null>(null);

  const [showAddContainer, setShowAddContainer] = useState(false);
  const shipmentType =
    job.shipmentType ||
    job.quoteId?.shipmentType ||
    "import";
  console.log("Shipment Type:", job.shipmentType);
  const clientEmail = defaultEmail || job.quoteId?.email || "";
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

  const preContainerBucket = containers.find(
    (c) => c.containerNumber === PRE_CONTAINER_SENTINEL
  );
  const realContainers = containers.filter(
    (c) => c.containerNumber !== PRE_CONTAINER_SENTINEL
  );


  const editContainerData = editTarget
    ? containers.find((c) => c.containerNumber === editTarget.containerNumber)
    : null;
  const editEventData =
    editContainerData?.events?.[editTarget?.eventIndex ?? -1];


  const handleAddContainer = (
  containerNumber: string,
  sizeType: string
) => {
  addContainerShell(
    containerNumber,
    sizeType,
    realContainers,
    setContainers,
    setShowAddContainer
  );

};
  
  const handleSaveEvent = (
  containerNumber: string,
  sizeType: string,
  event: any,
  emailOpts: any,
  onSuccess: (warning?: string | null) => void
) => {
  saveEvent(
    job,
    BASE_URL,
    containerNumber,
    sizeType,
    event,
    emailOpts,
    setSaving,
    updateTrackingState,
    onSuccess
  );
};
  
const handleEditEvent = (updated: any) => {
  if (!editTarget) return;

  editEvent(
    job,
    clientEmail,
    editTarget,
    updated,
    editTarget.containerNumber,
    setSaving,
    updateTrackingState,
    setEditTarget,
    setEditEmailPrompt
  );
};
const handleDelete = (
  containerNumber: string,
  eventIndex: number
) => {
  deleteEvent(
    job,
    containerNumber,
    eventIndex,
    setSaving,
    updateTrackingState
  );
};

const handleResend = (
  containerNumber: string,
  eventIndex: number
) => {
  openResendModal(
    containers,
    containerNumber,
    eventIndex,
    setResendTarget
  );
};
const handleSendEditEmail = ({
  emailType,
  recipientEmail,
  additionalRecipients,
}: {
  emailType: string;
  recipientEmail: string;
  additionalRecipients: string[];
}) => {
  sendEditEmail({
    job,
    BASE_URL,
    editEmailPrompt,
    emailType,
    recipientEmail,
    additionalRecipients,
    setSaving,
    updateTrackingState,
    setEditEmailPrompt,
  });
};

const handleSendResendEmail = ({
  emailType,
  recipientEmail,
  additionalRecipients,
}: {
  emailType: string;
  recipientEmail: string;
  additionalRecipients: string[];
}) => {
  sendResendEmail({
    job,
    BASE_URL,
    resendTarget,
    emailType,
    recipientEmail,
    additionalRecipients ,
    setSaving,
    updateTrackingState,
    setResendTarget,
  });
};



  return (
    <div className="space-y-5">

      {/* ── Modals ─────────────────────────────────────────────────── */}

      {/* Post-edit email prompt */}
      {editEmailPrompt && (
        <EmailConfirmModal
          event={editEmailPrompt.event}
          defaultEmail={editEmailPrompt.clientEmail}
          saving={saving}
          onConfirm={handleSendEditEmail}
          onSkip={() => {
            const warning = editEmailPrompt.sequenceWarning;
            setEditEmailPrompt(null);
            if (warning) alert(`Saved. Note: ${warning}`);
          }}
        />
      )}

      {/* Edit event */}
      {editTarget && editEventData && (
        <EditEventModal
          event={editEventData}
          loading={saving}
          onClose={() => setEditTarget(null)}
          onSave={handleEditEvent}
        />
      )}

      {/* Resend email — isResendOnly hides "skip" and changes labels */}
      {resendTarget && (
        <EmailConfirmModal
          event={resendTarget.event}
          defaultEmail={clientEmail}
          saving={saving}
          isResendOnly
          onConfirm={handleSendResendEmail}
          onSkip={() => setResendTarget(null)}
        />
      )}

      {/* Add container */}
      {showAddContainer && (
        <AddContainerModal
          existing={realContainers.map((c) => c.containerNumber)}
          onAdd={handleAddContainer}
          onClose={() => setShowAddContainer(false)}
        />
      )}

      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {shipmentType === "export" ? "Export" : "Import"} Shipment Tracking
          </p>
          <p className="text-xs text-gray-400">
            {realContainers.length} container
            {realContainers.length !== 1 ? "s" : ""} · Job {job.jobId}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddContainer(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add container
        </button>
      </div>

      {/* ── Job-level events ───────────────────────────────────────── */}
      <PreContainerSection
        container={preContainerBucket}
        emailLogs={emailLogs}
        onEdit={(cn, i) => setEditTarget({ containerNumber: cn, eventIndex: i })}
        onDelete={handleDelete}
        onResend={handleResend}
      />

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {realContainers.length === 0 && !preContainerBucket?.events?.length && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
          <svg
            className="w-10 h-10 mx-auto text-gray-200 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-sm text-gray-400">
            No events recorded yet. Add a status below to get started.
          </p>
        </div>
      )}

      {/* ── Container cards ────────────────────────────────────────── */}
      {realContainers.map((container) => (
        <ContainerCard
          key={container.containerNumber}
          container={container}
          onEdit={(cn, i) => setEditTarget({ containerNumber: cn, eventIndex: i })}
          emailLogs={emailLogs}
          onDelete={handleDelete}
          onResend={handleResend}
        />
      ))}

      {/* ── Add event form ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1">Add Event</p>
        <p className="text-xs text-gray-400 mb-4">
          Steps are automatically routed to the correct container or job-level
          bucket. Job-level steps (Booking, Bill of Entry, OOC, etc.) are
          recorded once for the entire job.
        </p>
        <AddEventForm
          shipmentType={shipmentType}
          containers={containers}
          loading={saving}
          defaultEmail={clientEmail}
          onSubmit={handleSaveEvent}
        />
      </div>
    </div>
  );
}