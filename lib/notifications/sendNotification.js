import sendClientEmail from "@/lib/sendClientEmail";

import { quoteRequestTemplate } from "./templates/quoteRequest";
import { jobCreatedTemplate } from "./templates/jobCreated";
import { jobAssignedTemplate } from "./templates/jobAssigned";
import { containerStatusTemplate } from "./templates/containerStatus";

export async function sendNotification({
  type,
  recipient,
  data,
  attachments = []
}) {

  let subject = "";
  let html = "";

  switch(type){

    case "QUOTE_REQUEST":
      subject = "New Quote Request";
      html = quoteRequestTemplate(data);
      break;

    case "JOB_CREATED":
      subject = `Job Created - ${data.jobNo}`;
      html = jobCreatedTemplate(data);
      break;

    case "JOB_ASSIGNED":
      subject = `Job Assigned - ${data.jobNo}`;
      html = jobAssignedTemplate(data);
      break;

    case "CONTAINER_STATUS":
      subject = `Shipment Update - ${data.containerNo}`;
      html = containerStatusTemplate(data);
      break;
  }

  return sendClientEmail({
    to: recipient,
    subject,
    html,
    attachments
  });
}