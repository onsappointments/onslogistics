export async function saveEvent(
  job: any,
  BASE_URL: string,
  containerNumber: string,
  sizeType: string,
  event: any,
  emailOpts: any,
  setSaving: (v: boolean) => void,
  updateTrackingState: (job: any) => void,
  onSuccess: (warning?: string | null) => void
) {
  try {
    setSaving(true);

    const res = await fetch("/api/admin/jobs/container-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job._id,
        containerNumber,
        sizeType,
        event,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to save event");
      return;
    }

    updateTrackingState(data.job);

    if (emailOpts) {
      const emailRes = await fetch(
        "/api/admin/jobs/container-event/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: job._id,
            containerNumber,
            sizeType,
            event,
            emailType: emailOpts.emailType,
            recipientEmail: emailOpts.recipientEmail,
            trackingUrl: `${BASE_URL}/tracking/${job.jobId}`,
            fromCity: job.quoteId?.fromCity,
            toCity: job.quoteId?.toCity,
            isResend: false,
          }),
        }
      );

      const emailData = await emailRes.json();

      if (!emailRes.ok) {
        alert(
          `Status saved, but email failed: ${
            emailData.error || "Unknown error"
          }`
        );
      } else {
        updateTrackingState(emailData.job);
      }
    }

    onSuccess(data.sequenceWarning ?? null);
  } catch {
    alert("Something went wrong");
  } finally {
    setSaving(false);
  }
}

export async function editEvent(
  job: any,
  clientEmail: string,
  editTarget: any,
  updatedEvent: any,
  containerNumber: string,
  setSaving: (v: boolean) => void,
  updateTrackingState: (job: any) => void,
  setEditTarget: (v: any) => void,
  setEditEmailPrompt: (v: any) => void
) {
  if (!editTarget) return;

  try {
    setSaving(true);

    const res = await fetch("/api/admin/jobs/container-event", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job._id,
        containerNumber,
        eventIndex: editTarget.eventIndex,
        event: updatedEvent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to edit event");
      return;
    }

    updateTrackingState(data.job);
    setEditTarget(null);

    if (updatedEvent.eta || updatedEvent.actualDeparture) {
      setEditEmailPrompt({
        event: updatedEvent,
        containerNumber,
        clientEmail: data.clientEmail || clientEmail,
        sequenceWarning: data.sequenceWarning ?? null,
      });
    } else if (data.sequenceWarning) {
      alert(`Saved. Note: ${data.sequenceWarning}`);
    }
  } catch {
    alert("Something went wrong");
  } finally {
    setSaving(false);
  }
}

export async function sendEditEmail({
  job,
  BASE_URL,
  editEmailPrompt,
  emailType,
  recipientEmail,
  setSaving,
  updateTrackingState,
  setEditEmailPrompt,
}: {
  job: any;
  BASE_URL: string;
  editEmailPrompt: any;
  emailType: string;
  recipientEmail: string;
  setSaving: (v: boolean) => void;
  updateTrackingState: (job: any) => void;
  setEditEmailPrompt: (v: any) => void;
}) {
  if (!editEmailPrompt) return;

  try {
    setSaving(true);

    const { event, containerNumber } = editEmailPrompt;

    const res = await fetch("/api/admin/jobs/container-event/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job._id,
        containerNumber,
        event,
        emailType,
        recipientEmail,
        trackingUrl: `${BASE_URL}/tracking/${job.jobId}`,
        fromCity: job.quoteId?.fromCity,
        toCity: job.quoteId?.toCity,
        isResend: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to send email");
      return;
    }

    updateTrackingState(data.job);

    const warning = editEmailPrompt.sequenceWarning;
    setEditEmailPrompt(null);

    if (warning) {
      alert(`Saved. Note: ${warning}`);
    }
  } catch {
    alert("Failed to send email");
  } finally {
    setSaving(false);
  }
}

export function addContainerShell(
  containerNumber: string,
  sizeType: string,
  realContainers: any[],
  setContainers: (updater: (prev: any[]) => any[]) => void,
  setShowAddContainer: (value: boolean) => void
) {
  if (realContainers.find((c) => c.containerNumber === containerNumber)) {
    setShowAddContainer(false);
    return;
  }

  setContainers((prev) => [
    ...prev,
    {
      containerNumber,
      sizeType,
      events: [],
    },
  ]);

  setShowAddContainer(false);
}

export function openResendModal(
  containers: any[],
  containerNumber: string,
  eventIndex: number,
  setResendTarget: (value: any) => void
) {
  const container = containers.find(
    (c) => c.containerNumber === containerNumber
  );

  const event = container?.events?.[eventIndex];

  if (!event) return;

  setResendTarget({
    containerNumber,
    event,
  });
}

export async function sendResendEmail({
  job,
  BASE_URL,
  resendTarget,
  emailType,
  recipientEmail,
  setSaving,
  updateTrackingState,
  setResendTarget,
}: {
  job: any;
  BASE_URL: string;
  resendTarget: any;
  emailType: string;
  recipientEmail: string;
  setSaving: (v: boolean) => void;
  updateTrackingState: (job: any) => void;
  setResendTarget: (v: any) => void;
}) {
  if (!resendTarget) return;

  try {
    setSaving(true);

    const { containerNumber, event } = resendTarget;

    const res = await fetch(
      "/api/admin/jobs/container-event/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job._id,
          containerNumber,
          event,
          emailType,
          recipientEmail,
          trackingUrl: `${BASE_URL}/tracking/${job.jobId}`,
          fromCity: job.quoteId?.fromCity,
          toCity: job.quoteId?.toCity,
          isResend: true,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to resend email");
      return;
    }

    updateTrackingState(data.job);

    setResendTarget(null);
  } catch {
    alert("Failed to resend email");
  } finally {
    setSaving(false);
  }
}

export async function deleteEvent(
  job: any,
  containerNumber: string,
  eventIndex: number,
  setSaving: (v: boolean) => void,
  updateTrackingState: (job: any) => void
) {
  if (!confirm("Delete this event? This cannot be undone.")) return;

  try {
    setSaving(true);

    const res = await fetch("/api/admin/jobs/container-event", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: job._id,
        containerNumber,
        eventIndex,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete event");
      return;
    }

    updateTrackingState(data.job);
  } catch {
    alert("Something went wrong");
  } finally {
    setSaving(false);
  }
}